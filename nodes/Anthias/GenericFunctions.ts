import { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IRequestOptions, IWebhookFunctions } from "n8n-workflow";

import assetsConfig from './Assets/AssetsFieldConfig.json';
// import backupConfig from './Backup/BackupFieldConfig.json';
import deviceConfig from './Device/DeviceFieldConfig.json';
// import fileConfig from './File/FileFieldConfig.json';
// import infoConfig from './Info/InfoFieldConfig.json';
// import integrationConfig from './Integration/IntegrationFieldConfig.json';
// import powerConfig from './Power/PowerFieldConfig.json';

import assetsBody from './Assets/AssetsBody.json';
import deviceBody from './Device/DeviceBody.json';

export async function makeRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	baseUrl: string,
	extraUrl: string,
	body: object = {},
): Promise<any> {

	const credentialType = 'anthiasCredentialsApi';
	const credentials = await this.getCredentials(credentialType);

	if (!(baseUrl?.length>0)) {
		baseUrl = credentials.baseUrl as string;
	}

	const endpoint = `${baseUrl}${extraUrl}`;

	this.logger.info(`${endpoint}`);

	const options: IRequestOptions = {
		method,
		body,
		uri: endpoint,
		json: true, // parse response as JSON automatically
	};
	// Send request using n8n’s built-in helper
	const temp = await this.helpers.requestWithAuthentication.call(this, credentialType, options);
	// this.logger.info(''+temp.length)
	// this.logger.info(JSON.stringify(temp))
	return temp;
}

export async function getEndpoint(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	resource: string,
	operation: string):Promise<string>{
	let operationConfig;
	let keyword = 'url'

	// Logging
	this.logger.info(`Getting endpoint for resource=${resource} | operation=${operation}`);

	switch(resource){
		case 'asset':
			operationConfig = assetsConfig[operation as keyof typeof assetsConfig];
			return operationConfig[keyword as keyof typeof operationConfig];
		// case 'backup':
		// 	operationConfig = backupConfig[operation as keyof typeof backupConfig];
		// 	return operationConfig[keyword as keyof typeof operationConfig];
		case 'device':
			operationConfig = deviceConfig[operation as keyof typeof deviceConfig];
			return operationConfig[keyword as keyof typeof operationConfig];
		// case 'file':
		// 	operationConfig = fileConfig[operation as keyof typeof fileConfig];
		// 	return operationConfig[keyword as keyof typeof operationConfig];
		// case 'info':
		// 	operationConfig = infoConfig[operation as keyof typeof infoConfig];
		// 	return operationConfig[keyword as keyof typeof operationConfig];
		// case 'integration':
		// 	operationConfig = integrationConfig[operation as keyof typeof integrationConfig];
		// 	return operationConfig[keyword as keyof typeof operationConfig];
		// case 'power':
		// 	operationConfig = powerConfig[operation as keyof typeof powerConfig];
		// 	return operationConfig[keyword as keyof typeof operationConfig];
	}

	// Default return to satisfy all code paths
	return '';
}

export async function getUrlParams(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	resource: string,
	operation: string):Promise<string>{
		let operationConfig;
		let keyword = 'urlParams'

		// Logging
		this.logger.info(`Getting URL params for resource=${resource} | operation=${operation}`);

		switch(resource){
			case 'asset':
				operationConfig = assetsConfig[operation as keyof typeof assetsConfig];
				return operationConfig[keyword as keyof typeof operationConfig];
			// case 'backup':
			// 	operationConfig = backupConfig[operation as keyof typeof backupConfig];
			// 	return operationConfig[keyword as keyof typeof operationConfig];
			case 'device':
				operationConfig = deviceConfig[operation as keyof typeof deviceConfig];
				return operationConfig[keyword as keyof typeof operationConfig];
			// case 'file':
			// 	operationConfig = fileConfig[operation as keyof typeof fileConfig];
			// 	return operationConfig[keyword as keyof typeof operationConfig];
			// case 'info':
			// 	operationConfig = infoConfig[operation as keyof typeof infoConfig];
			// 	return operationConfig[keyword as keyof typeof operationConfig];
			// case 'integration':
			// 	operationConfig = integrationConfig[operation as keyof typeof integrationConfig];
			// 	return operationConfig[keyword as keyof typeof operationConfig];
			// case 'power':
			// 	operationConfig = powerConfig[operation as keyof typeof powerConfig];
			// 	return operationConfig[keyword as keyof typeof operationConfig];
		}
		// Default return to satisfy all code paths
		return '';
}

export async function getMethod(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	resource: string,
	operation: string):Promise<string>{
		let operationConfig;
		let keyword = 'method'

		// Logging
		this.logger.info(`Getting method for resource=${resource} | operation=${operation}`);

		switch(resource){
			case 'asset':
				operationConfig = assetsConfig[operation as keyof typeof assetsConfig];
				return operationConfig[keyword as keyof typeof operationConfig];
			// case 'backup':
			// 	operationConfig = backupConfig[operation as keyof typeof backupConfig];
			// 	return operationConfig[keyword as keyof typeof operationConfig];
			case 'device':
				operationConfig = deviceConfig[operation as keyof typeof deviceConfig];
				return operationConfig[keyword as keyof typeof operationConfig];
			// case 'file':
			// 	operationConfig = fileConfig[operation as keyof typeof fileConfig];
			// 	return operationConfig[keyword as keyof typeof operationConfig];
			// case 'info':
			// 	operationConfig = infoConfig[operation as keyof typeof infoConfig];
			// 	return operationConfig[keyword as keyof typeof operationConfig];
			// case 'integration':
			// 	operationConfig = integrationConfig[operation as keyof typeof integrationConfig];
			// 	return operationConfig[keyword as keyof typeof operationConfig];
			// case 'power':
			// 	operationConfig = powerConfig[operation as keyof typeof powerConfig];
			// 	return operationConfig[keyword as keyof typeof operationConfig];
		}
		// Default return to satisfy all code paths
		return '';
}

export async function getBody(
  this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
  resource: string,
  operation: string,
  itemIndex: number,
): Promise<IDataObject> {

  let template: IDataObject | undefined;
  if (resource === 'asset') {
    template = assetsBody[operation as keyof typeof assetsBody] as unknown as IDataObject;
  }
	if (resource === 'device') {
		template = deviceBody[operation as keyof typeof deviceBody] as unknown as IDataObject;
	}

  if (!template) {
		return {};
	}

  const body: IDataObject = {};
  for (const key of Object.keys(template)) {
    body[key] = this.getNodeParameter(key, itemIndex, template[key]);
  }

  return body;
}

