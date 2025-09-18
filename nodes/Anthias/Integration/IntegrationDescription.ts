import { INodeProperties } from 'n8n-workflow';

export const integrationDescription: INodeProperties[] = [
  // Pick the operation
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'getIntegrationsInformation',
    options: [
      { name: 'Get Integrations Information', value: 'getIntegrationsInformation', action: 'Get integrations information' },
    ],
    displayOptions: {
      show: {
        resource: ['integration'],
      },
    },
  },
];
