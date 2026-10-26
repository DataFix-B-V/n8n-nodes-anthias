import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
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
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
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
						value: 'device',
					},
				],
				default: 'asset',
			},
			...assetsDescription,
			...deviceDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const baseUrlOverwrite = ((this.getNodeParameter('overwriteBaseUrl', 0, '') as string) || '').trim();
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
				let [endpoint, method, urlParams, bodyType] = await createRequestOptions.call(this, resource, operation);

				for (const param of urlParams) {
					const value = String(this.getNodeParameter(param, i, '')).trim();

					if (!value) {
						throw new NodeOperationError(this.getNode(), `Missing required parameter: “${param}”`, {
							itemIndex: i,
						});
					}

					endpoint = endpoint.replace(`{${param}}`, encodeURIComponent(value));
				}

				const body = bodyType === 'none' ? {} : await getBody.call(this, resource, operation, i);

				const headers: IDataObject = {};

				// POST /api/v2/file_asset requires X-Upload-Id
				if (resource === 'asset' && operation === 'uploadFileAsset') {
					const uploadId = String(this.getNodeParameter('upload_id', i, '')).trim();

					if (uploadId) {
						headers['X-Upload-Id'] = uploadId;
					}
				}

				let response: unknown;

				try {
					response = await makeRequest.call(this, method,
						baseUrlOverwrite,
						endpoint,
						body,
						bodyType,
						headers,
					);
				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({
							json: {
								error: error instanceof Error ? error.message : String(error),
							},
							pairedItem: { item: i },
						});

						continue;
					}

					throw error;
				}

				if (Array.isArray(response)) {
					for (const responseItem of response) {
						returnData.push({
							json: responseItem as IDataObject,
							pairedItem: { item: i },
						});
					}
				} else if (response && typeof response === 'object') {
					returnData.push({
						json: response as IDataObject,
						pairedItem: { item: i },
					});
				} else {
					returnData.push({
						json: {
							message: response === null ? null : String(response),
						},
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : String(error),
						},
						pairedItem: { item: i },
					});

					continue;
				}

				if (!(error instanceof NodeApiError) && !(error instanceof NodeOperationError)) {
					throw new NodeOperationError(
						this.getNode(),
						error instanceof Error ? error.message : 'Unknown error',
						{ itemIndex: i },
					);
				}

				throw error;
			}
		}

		return [returnData];
	}
}
