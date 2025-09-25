import { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IHttpRequestOptions, IWebhookFunctions } from "n8n-workflow";

import assetsConfig from './Assets/AssetsFieldConfig.json';
import deviceConfig from './Device/DeviceFieldConfig.json';


export type AnthiasRequestResponse = IDataObject | IDataObject[] | string | number | boolean | null;

export async function makeRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	baseUrl: string,
	extraUrl: string,
	body: object = {},
): Promise<AnthiasRequestResponse> {

	// Get credentials
	const credentialType = 'anthiasCredentialsApi';
	const credentials = await this.getCredentials(credentialType);

	// Overwrite baseUrl if  not specified in node parameters
	if (!(baseUrl?.length>0)) {
		baseUrl = credentials.baseUrl as string;
	}

	// Construct full endpoint URL
	const endpoint = `${baseUrl}${extraUrl}`;
	const options: IHttpRequestOptions = {
		method,
		body,
		url: endpoint,
		json: true,
	};
	// Send request using n8n’s built-in helper
	const temp = await this.helpers.requestWithAuthentication.call(this, credentialType, options);
	return temp;
}

export type RequestOptionsTuple = [string, string, string[]];

export async function createRequestOptions(
	this: IExecuteFunctions,
	resource: string,
	operation: string,
): Promise<RequestOptionsTuple> {

	try {
		switch (resource) {
			case 'asset':
				let assetConfig = assetsConfig[operation as keyof typeof assetsConfig];
				if (typeof assetConfig === 'object' && assetConfig !== null) {
					return [assetConfig.url, assetConfig.method, assetConfig.urlParams];
				} else {
					throw new Error(`Invalid assetConfig for operation: ${operation}`);
				}
			case 'device':
				let deviceConfigItem = deviceConfig[operation as keyof typeof deviceConfig];
				if (typeof deviceConfigItem === 'object' && deviceConfigItem !== null) {
					return [deviceConfigItem.url, deviceConfigItem.method, deviceConfigItem.urlParams];
				} else {
					throw new Error(`Invalid deviceConfig for operation: ${operation}`);
				}
			default:
				   return ['', '', []];
		}
	} catch (error) {

		throw error;
	}
}

// Function to generate the request body based on resource, operation, and node parameters
export async function getBody(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	resource: string,
	operation: string,
	itemIndex: number,
): Promise<IDataObject> {
	try {
		// Dynamic body builder based on node parameters
		const defaultParameters = ['overwriteBaseUrl', 'resource', 'operation', 'options'];
		const options = this.getNodeParameter('options', itemIndex, {}) as IDataObject;

		let parameters: IDataObject = {};
		for (const [key, value] of Object.entries(this.getNode().parameters)) {
			this.logger.debug(`Processing parameter: ${key} with value: ${value}`);
			if (!defaultParameters.includes(key) && value !== '') {
				parameters[key] = this.getNodeParameter(key, itemIndex, {}) as IDataObject;
			}
		}

		// Merging parameters and options into the final body
		let template: IDataObject | undefined;
		if (resource === 'asset') {
			template = {
				...parameters,
				"skip_asset_check": true,
				...options
			};
			return template ?? {};
		}
		if (resource === 'device') {
			if (operation === 'updateDeviceSettings') {
				// Get credentials
				let credentials = await this.getCredentials('anthiasCredentialsApi');
				let password = credentials.password as string;
				let username = credentials.username as string;

				template = {
					...parameters,
					current_password: password,
					username: username,
					...options
				};
			};
			return template ?? {};
		}
		return {};
	} catch (error) {
		this.logger?.error?.(`Error in getBody for resource: ${resource}, operation: ${operation}`, error);
		throw error;
	}
}
