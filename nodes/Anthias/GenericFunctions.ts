import {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
	IWebhookFunctions,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import type { JsonObject } from 'n8n-workflow';

import assetsConfig from './Assets/AssetsFieldConfig.json';
import deviceConfig from './Device/DeviceFieldConfig.json';

// --- helpers ---
function toJsonObject(e: unknown): JsonObject {
	if (e && typeof e === 'object') return e as JsonObject;
	return { message: String(e ?? 'Unknown error') } as unknown as JsonObject;
}

export type AnthiasRequestResponse =
	| IDataObject | IDataObject[] | string | number | boolean| null;

export async function makeRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	baseUrl: string,
	extraUrl: string,
	body: object = {},
): Promise<AnthiasRequestResponse> {
	const credentialType = 'anthiasCredentialsApi';
	const credentials = await this.getCredentials(credentialType);

	if (!credentials) {
		throw new NodeOperationError(
			this.getNode(),
			'Missing credentials “anthiasCredentialsApi”. Configure credentials on the node.',
		);
	}

	// Use credential base URL if node parameter is empty
	if (!baseUrl || baseUrl.trim().length === 0) {
		baseUrl = (credentials.baseUrl as string) ?? '';
	}

	if (!baseUrl) {
		throw new NodeOperationError(
			this.getNode(),
			'Base URL is required (set “Overwrite Credential Base URL” or provide it in credentials).',
		);
	}

	// Validate baseUrl as a string and normalize slashes
	if (typeof baseUrl !== 'string' || !/^https?:\/\/.+/.test(baseUrl)) {
		throw new NodeOperationError(
			this.getNode(),
			`Invalid base URL: “${baseUrl}”. Use a fully qualified URL like https://api.example.com`,
		);
	}
	const normalizedBase = baseUrl.replace(/\/+$/, '');
	const normalizedExtra = extraUrl ? `/${extraUrl.replace(/^\/+/, '')}` : '';
	const endpoint = `${normalizedBase}${normalizedExtra}`;

	const options: IHttpRequestOptions = {
		method,
		body,
		url: endpoint,
		json: true,
	};

	try {
		// Keep the helper you’re already using; `requestWithAuthentication` also works in newer n8n.
		const res = await this.helpers.httpRequestWithAuthentication.call(
			this,
			credentialType,
			options,
		);
		return res as AnthiasRequestResponse;
	} catch (error) {
		throw new NodeApiError(this.getNode(), toJsonObject(error), {
			message: 'Anthias API request failed',
			// itemIndex left for the caller (node.ts) to add
		});
	}
}

export type RequestOptionsTuple = [string, string, string[]];

export async function createRequestOptions(
	this: IExecuteFunctions,
	resource: string,
	operation: string,
): Promise<RequestOptionsTuple> {
	try {
		switch (resource) {
			case 'asset': {
				const cfg = assetsConfig[operation as keyof typeof assetsConfig] as
					| { url: string; method: string; urlParams: string[] }
					| undefined;

				if (!cfg || typeof cfg !== 'object') {
					throw new NodeOperationError(
						this.getNode(),
						`Invalid asset operation: “${operation}”.`,
					);
				}
				return [cfg.url, cfg.method, cfg.urlParams ?? []];
			}

			case 'device': {
				const cfg = deviceConfig[operation as keyof typeof deviceConfig] as
					| { url: string; method: string; urlParams: string[] }
					| undefined;

				if (!cfg || typeof cfg !== 'object') {
					throw new NodeOperationError(
						this.getNode(),
						`Invalid device operation: “${operation}”.`,
					);
				}
				return [cfg.url, cfg.method, cfg.urlParams ?? []];
			}

			default:
				throw new NodeOperationError(
					this.getNode(),
					`Unknown resource: “${resource}”.`,
				);
		}
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		throw new NodeOperationError(
			this.getNode(),
			toJsonObject(error),
		);
	}
}

// Build request body from node parameters
export async function getBody(
	this: | IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	resource: string,
	operation: string,
	itemIndex: number,
): Promise<IDataObject> {
	try {
		const defaultParameters = ['overwriteBaseUrl', 'resource', 'operation', 'options'];
		const options = this.getNodeParameter('options', itemIndex, {}) as IDataObject;

		const parameters: IDataObject = {};
		for (const [key, value] of Object.entries(this.getNode().parameters)) {
			this.logger?.debug?.(`Processing parameter: ${key} with value: ${value}`);
			if (!defaultParameters.includes(key) && value !== '') {
				parameters[key] = this.getNodeParameter(key, itemIndex, {}) as IDataObject;
			}
		}

		const body: IDataObject = {
			...parameters,
			...options,
		};

		if (resource === 'asset') {
			body.skip_asset_check = true;
		}

		if (resource === 'device' && operation === 'updateDeviceSettings') {
			const credentials = await this.getCredentials('anthiasCredentialsApi');
			if (!credentials) {
				throw new NodeOperationError(
					this.getNode(),
					'Missing credentials required for device settings update.',
					{ itemIndex },
				);
			}
			body.current_password = credentials.password as string;
			body.username = credentials.username as string;
		}

		return body;
	} catch (error) {
		this.logger?.error?.(
			`Error in getBody for resource: ${resource}, operation: ${operation}`,
			{ error: error instanceof Error ? error.message : String(error) },
		);
		throw new NodeOperationError(this.getNode(), toJsonObject(error), { itemIndex });
	}
}
