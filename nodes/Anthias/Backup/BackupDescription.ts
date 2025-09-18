import { INodeProperties } from 'n8n-workflow';

export const backupDescription: INodeProperties[] = [
	  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'createBackup',
    options: [
      { name: 'Create Backup', value: 'createBackup', action: 'Create backup' },
			{ name: 'Restore Backup', value: 'restoreBackup', action: 'Restore backup' },
    ],
    displayOptions: {
			show: {
				resource: ['backup']
			}
		},
  },

	{
	displayName: 'Restore Backup',
	name: 'backup_upload',
	type: 'string',
	default: '',
	required: true,
	displayOptions: {
		show: {
			resource: ['backup'],
			operation: ['restoreBackup'],
		},
	},
}
];
