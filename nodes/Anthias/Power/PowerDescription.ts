import { INodeProperties } from 'n8n-workflow';

export const powerDescription: INodeProperties[] = [
  // Pick the operation
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'rebootSystem',
    options: [
      { name: 'Reboot System', value: 'rebootSystem', action: 'Reboot system' },
      { name: 'Poweroff System', value: 'poweroffSysten', action: 'Poweroff system' },
    ],
    displayOptions: {
      show: {
        resource: ['power'],
      },
    },
  },
];
