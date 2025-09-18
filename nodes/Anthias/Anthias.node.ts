import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { makeRequest, getEndpoint, getUrlParams, getMethod, getBody} from './GenericFunctions';

import { assetsDescription } from './Assets/AssetsDescription';
// import { backupDescription } from './Backup/BackupDescription';
import { deviceDescription } from './Device/DeviceDescription';
// import { fileDescription } from './File/FileDescription';
// import { infoDescription } from './Info/InfoDescription';
// import { integrationDescription } from './Integration/IntegrationDescription';
// import { powerDescription } from './Power/PowerDescription';

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
					// {
					// 	name: 'Backup',
					// 	value: 'backup',
					// },
					{
						// eslint-disable-next-line n8n-nodes-base/node-param-resource-with-plural-option
						name: 'Device',
						value: 'device'
					},
					// {
					// 	name: 'File',
					// 	value: 'file'
					// },
					// {
					// 	name: 'Info',
					// 	value: 'info',
					// },
					// {
					// 	name: 'Integration',
					// 	value: 'integration'
					// },
					// {
					// 	name: 'Power',
					// 	value: 'power'
					// }
				],
				default: 'asset',
			},
			...assetsDescription,
			// ...backupDescription,
			...deviceDescription,
			// ...fileDescription,
			// ...infoDescription,
			// ...integrationDescription,
			// ...powerDescription,
		]
		};

// Return of all the input data
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	let baseUrlOverwrite = (this.getNodeParameter('overwriteBaseUrl', 0, '') as string || '').trim();

	const items = this.getInputData();
	let returnData: IDataObject[] = [];

	for (let i = 0; i < items.length; i++) {
		const resource = this.getNodeParameter('resource', i) as string;
		const operation = this.getNodeParameter('operation', i) as string;

		// Printing all node parameters for debugging
		this.logger.info(`Node parameters for item ${i}:`);
		const nodeParams = this.getNode().parameters;
		for (const [key, value] of Object.entries(nodeParams)) {
			this.logger.info(`  ${key}: ${JSON.stringify(value)}`);
		}

		// generateBody based on the json template and the parameters from the node
		let body = await getBody.call(this, resource, operation, i);

		this.logger.info(`Body generated: ${JSON.stringify(body)}`);

		// Resolve endpoint and substitute any path params like {assetId}
		let endpoint = await getEndpoint.call(this, resource, operation);
		const urlParams = await getUrlParams.call(this, resource, operation);
		const method = await getMethod.call(this, resource, operation)

		for (const param of urlParams) {;
			const value = String(this.getNodeParameter(param, i, '')).trim();
			endpoint = endpoint.replace(`{${param}}`, value);
		}

		// Optional log
		this.logger.info(`resource=${resource} | operation=${operation} | endpoint=${endpoint} | method=${method}`);

		//let response;
		let response = await makeRequest.call(this, method as IHttpRequestMethods, baseUrlOverwrite, endpoint, body);


		this.logger.info(' '.repeat(100));   // prints blank new line

		// Normalize to array of IDataObject
		if (Array.isArray(response)) {
			returnData = returnData.concat(response as IDataObject[]);
		} else if (response && typeof response === 'object') {
			returnData.push(response as IDataObject);
		} else {
			// string / number / boolean, etc.
			returnData.push({ message: response as string });
		}
	}

	return [this.helpers.returnJsonArray(returnData)];
	}
}
