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

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AnthiasRequestResponse =
	| IDataObject
	| IDataObject[]
	| string
	| number
	| boolean
	| null;

export type AnthiasBodyType = 'json' | 'formData' | 'none';

export type AnthiasRequestBody = IDataObject | FormData;

export type RequestOptionsTuple = [
	string,
	IHttpRequestMethods,
	string[],
	AnthiasBodyType,
];

// -----------------------------------------------------------------------------
// Error helper
// -----------------------------------------------------------------------------

function toJsonObject(error: unknown): JsonObject {
	if (error instanceof Error) {
		const result: JsonObject = {
			message: error.message,
			name: error.name,
		};

		if (error.stack) {
			result.stack = error.stack;
		}

		return result;
	}

	return {
		message: String(error ?? 'Unknown error'),
	};
}

// -----------------------------------------------------------------------------
// HTTP request
// -----------------------------------------------------------------------------

export async function makeRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	baseUrl: string,
	extraUrl: string,
	body: AnthiasRequestBody = {},
	bodyType: AnthiasBodyType = 'json',
	headers: IDataObject = {},
): Promise<AnthiasRequestResponse> {
	const credentialType = 'anthiasCredentialsApi';
	const credentials = await this.getCredentials(credentialType);

	if (!credentials) {
		throw new NodeOperationError(
			this.getNode(),
			'Missing credentials “anthiasCredentialsApi”. Configure credentials on the node.',
		);
	}

	if (!baseUrl || baseUrl.trim().length === 0) {
		baseUrl = (credentials.baseUrl as string) ?? '';
	}

	if (!baseUrl) {
		throw new NodeOperationError(
			this.getNode(),
			'Base URL is required (set “Overwrite Credential Base URL” or provide it in credentials).',
		);
	}

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
		url: endpoint,
	};

	if (Object.keys(headers).length > 0) {
		options.headers = headers;
	}

	switch (bodyType) {
		case 'json':
			options.body = body as IDataObject;
			options.json = true;
			break;

		case 'formData':
			options.body = body as FormData;
			break;

		case 'none':
			options.json = true;
			break;

		default:
			throw new NodeOperationError(this.getNode(), `Unsupported body type: “${bodyType}”.`);
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, credentialType, options);
		return response as AnthiasRequestResponse;
	} catch (error) {
		throw new NodeApiError(this.getNode(), toJsonObject(error), {
			message: 'Anthias API request failed',
		});
	}
}

// -----------------------------------------------------------------------------
// Request configuration
// -----------------------------------------------------------------------------

export async function createRequestOptions(
	this: IExecuteFunctions,
	resource: string,
	operation: string,
): Promise<RequestOptionsTuple> {
	try {
		switch (resource) {
			case 'asset': {
				const cfg = assetsConfig[operation as keyof typeof assetsConfig] as
					| {
							url: string;
							method: IHttpRequestMethods;
							urlParams: string[];
							bodyType?: AnthiasBodyType;
					  }
					| undefined;

				if (!cfg || typeof cfg !== 'object') {
					throw new NodeOperationError(this.getNode(), `Invalid asset operation: “${operation}”.`);
				}

				return [
					cfg.url,
					cfg.method,
					cfg.urlParams ?? [],
					cfg.bodyType ?? 'json',
				];
			}

			case 'device': {
				const cfg = deviceConfig[operation as keyof typeof deviceConfig] as
					| {
							url: string;
							method: IHttpRequestMethods;
							urlParams: string[];
							bodyType?: AnthiasBodyType;
					  }
					| undefined;

				if (!cfg || typeof cfg !== 'object') {
					throw new NodeOperationError(this.getNode(), `Invalid device operation: “${operation}”.`);
				}

				return [
					cfg.url,
					cfg.method,
					cfg.urlParams ?? [],
					cfg.bodyType ?? 'json',
				];
			}

			default:
				throw new NodeOperationError(this.getNode(), `Unknown resource: “${resource}”.`);
		}
	} catch (error) {
		if (error instanceof NodeOperationError) {
			throw error;
		}

		throw new NodeOperationError(this.getNode(), toJsonObject(error));
	}
}

// -----------------------------------------------------------------------------
// Request body
// -----------------------------------------------------------------------------

const possiblerFormDataOperations: Record<string, string[]> = {
	asset: ['uploadFileAsset'],
};

export async function getBody(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	resource: string,
	operation: string,
	itemIndex: number,
): Promise<AnthiasRequestBody> {
	try {
		if (possiblerFormDataOperations[resource]?.includes(operation)) {
			const executeContext = this as IExecuteFunctions;

			const binaryPropertyName = executeContext.getNodeParameter('file_upload', itemIndex) as string;

			if (!binaryPropertyName) {
				throw new NodeOperationError(executeContext.getNode(), 'Input Binary Field is required.', {
					itemIndex,
				});
			}

			const binaryData = executeContext.helpers.assertBinaryData(itemIndex, binaryPropertyName);
			const buffer = await executeContext.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

			const formData = new FormData();

			const blob = new Blob([new Uint8Array(buffer)], {
				type: binaryData.mimeType ?? 'application/octet-stream',
			});

			formData.append('file_upload', blob, binaryData.fileName ?? 'upload');

			return formData;
		}

		const defaultParameters = [
			'overwriteBaseUrl',
			'resource',
			'operation',
			'options',
		];

		const nodeOptions = this.getNodeParameter('options', itemIndex, {}) as IDataObject;
		const parameters: IDataObject = {};

		for (const [key, value] of Object.entries(this.getNode().parameters)) {
			this.logger?.info?.(`Processing parameter: ${key} with value: ${value}`);

			if (!defaultParameters.includes(key) && value !== '') {
				parameters[key] = this.getNodeParameter(key, itemIndex, {}) as IDataObject;
			}
		}

		const body: IDataObject = {
			...parameters,
			...nodeOptions,
		};

		if (
			resource === 'asset' &&
			['createAsset', 'updateAsset', 'replaceAsset'].includes(operation)
		) {
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
			{
				error: error instanceof Error ? error.message : String(error),
			},
		);

		throw new NodeOperationError(this.getNode(), toJsonObject(error), { itemIndex });
	}
}
