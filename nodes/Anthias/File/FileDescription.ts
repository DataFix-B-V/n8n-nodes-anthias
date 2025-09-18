import { INodeProperties } from 'n8n-workflow';

export const fileDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'uploadFileAsset',
    options: [
      { name: 'Upload File Asset', value: 'uploadFileAsset', action: 'Upload file asset' },
    ],
    displayOptions: {
      show: {
        resource: ['file'],
      },
    },
  },
];
