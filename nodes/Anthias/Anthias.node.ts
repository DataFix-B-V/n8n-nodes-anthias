import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

import { makeRequest, getBody, createRequestOptions } from './GenericFunctions';
import { assetsDescription } from './Assets/AssetsDescription';
import { deviceDescription } from './Device/DeviceDescription';


export class Anthias implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Anthias',
		name: 'anthias',
		group: ['transform'],
		version: 1,
		description: 'Node for controlling Anthias deployments with the Anthias API',
		icon: 'file:AnthiasIcon.svg',
		defaults: {
			name: 'Anthias',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'anthiasCredentialsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Overwrite Credential Base URL',
				name: 'overwriteBaseUrl',
				type: 'string',
				default: '',
				placeholder: 'Enter the URL to overwrite the credential base URL',
				description: 'Enter the URL to overwrite the credential base URL',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Asset',
						value: 'asset',
					},
					{
						name: 'Device',
						value: 'device'
					},
				],
				default: 'asset',
			},
			...assetsDescription,
			...deviceDescription,
		]
		};

// Return of all the input data
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const baseUrlOverwrite = (this.getNodeParameter('overwriteBaseUrl', 0, '') as string || '').trim();
	const resource = this.getNodeParameter('resource', 0) as string;
	const operation = this.getNodeParameter('operation', 0) as string;

	if (!resource) {
			throw new NodeOperationError(this.getNode(), '“Resource” is required.');
		}
	if (!operation) {
			throw new NodeOperationError(this.getNode(), '“Operation” is required for the selected resource.');
		}

	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];


	for (let i = 0; i < items.length; i++) {
			try {
				// Create request options for this resource/operation
				let [endpoint, method, urlParams] = await createRequestOptions.call(this, resource, operation);

				// Replace required URL params; validate presence
				for (const param of urlParams) {
					const value = String(this.getNodeParameter(param, i, '')).trim();
					if (!value) {
						throw new NodeOperationError(this.getNode(), `Missing required parameter: “${param}”`, {
							itemIndex: i,
						});
					}
					endpoint = endpoint.replace(`{${param}}`, value);
				}

				// Build body from node parameters
				const body = await getBody.call(this, resource, operation, i);

				// External request → wrap failures with NodeApiError
				let response: unknown;
				try {
					response = await makeRequest.call(
						this,
						method as IHttpRequestMethods,
						baseUrlOverwrite,
						endpoint,
						body,
					);
				} catch (error) {
					if (this.continueOnFail && this.continueOnFail()) {
						returnData.push({
							json: { error: (error as Error)?.message ?? error },
							pairedItem: { item: i },
						});
						continue;
					}
					throw new NodeApiError(this.getNode(), { message: (error as Error)?.message ?? String(error) }, {
						itemIndex: i,
						message: 'Anthias API request failed',
					});
				}

				// Normalize response
				if (Array.isArray(response)) {
					for (const item of response) {
						returnData.push({ json: item as IDataObject, pairedItem: { item: i } });
					}
				} else if (response && typeof response === 'object') {
					returnData.push({ json: response as IDataObject, pairedItem: { item: i } });
				} else {
					returnData.push({ json: { message: response as string }, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail && this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error)?.message ?? error },
						pairedItem: { item: i },
					});
					continue;
				}
				// Ensure consistent formatting if something unexpected bubbles up
				if (!(error instanceof NodeApiError) && !(error instanceof NodeOperationError)) {
					throw new NodeOperationError(this.getNode(), (error as Error)?.message ?? 'Unknown error', {
						itemIndex: i,
					});
				}
				throw error;
			}
		}

		return [returnData];
	}
}
