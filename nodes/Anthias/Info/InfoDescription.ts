import { INodeProperties } from 'n8n-workflow';

export const infoDescription: INodeProperties[] = [
  // Pick the operation
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'getSystemInfo',
    options: [
      { name: 'Get System Information', value: 'getSystemInfo', action: 'Get system information' },
    ],
    displayOptions: {
      show: {
        resource: ['info'],
      },
    },
  },
];
