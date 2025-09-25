import { INodeProperties } from 'n8n-workflow';

export const deviceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'getDeviceSettings',
		placeholder: 'Select operation',
		options: [
			{ name: 'Get Device Settings', value: 'getDeviceSettings', action: 'Get device settings' },
			{ name: 'Get Integrations Information', value: 'getIntegrationsInformation', action: 'Get integrations information' },
			{ name: 'Get System Information', value: 'getSystemInfo', action: 'Get system information' },
			{ name: 'Reboot Device', value: 'rebootDevice', action: 'Reboot device' },
			{ name: 'Shutdown Device', value: 'shutdownDevice', action: 'Shutdown device' },
			{ name: 'Update Device Settings', value: 'updateDeviceSettings', action: 'Update device settings' },
		],
		displayOptions: {
			show: {
				resource: ['device']
			}
		},
	},
	{
		displayName: 'Auth Backend',
		name: 'auth_backend',
		placeholder: 'Authentication backend ("" For no authentication / auth_basic - Basic authentication)',
		type: 'options',
		required: true,
		options: [
			{ name: 'No Authentication', value: '' },
			{ name: 'Basic Authentication', value: 'auth_basic' },
		],
		default: 'auth_basic',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'Authentication backend',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		options: [
			{
				displayName: 'Audio Output',
				name: 'audio_output',
				placeholder: 'Device Audio Output',
				type: 'string',
				default: 'HDMI',
				description: 'The audio output setting of the device (e.g., "HDMI", "Analog")',
			},
			{
				displayName: 'Date Format',
				name: 'date_format',
				placeholder: 'Date format string',
				type: 'string',
				default: 'mm/dd/yyyy',
				description: 'Date format string',
			},
			{
				displayName: 'Date Format',
				name: 'date_format',
				placeholder: 'Date format string',
				type: 'string',
				default: 'mm/dd/yyyy',
				description: 'Date format string',
			},
			{
				displayName: 'Debug Logging',
				name: 'debug_logging',
				type: 'boolean',
				default: false,
				description: 'Whether to enable debug logging',
			},
			{
				displayName: 'Default Assets',
				name: 'default_assets',
				type: 'boolean',
				default: false,
				description: 'Whether to use default assets',
			},
			{
				displayName: 'Default Duration',
				name: 'default_duration',
				type: 'number',
				placeholder: 'Default playback duration (seconds)',
				default: 5,
				description: 'Default duration for playback (in seconds)',
			},
			{
				displayName: 'Default Streaming Duration',
				name: 'default_streaming_duration',
				type: 'number',
				placeholder: 'Default streaming duration (seconds)',
				default: 5,
				description: 'Default streaming duration (in seconds)',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				placeholder: 'Enter password',
				default: '',
				description: 'Enter new password for authentication (default = "admin")',
			},
			{
				displayName: 'Password (Confirm)',
				name: 'password_2',
				type: 'string',
				typeOptions: {
					password: true,
				},
				placeholder: 'Enter password',
				default: '',
				description: 'Reenter new password for authentication (default = "admin")',
			},
			{
				displayName: 'Player Name',
				name: 'player_name',
				placeholder: 'Device Player Name',
				type: 'string',
				default: '',
				description: 'The name of the device as shown in the Anthias dashboard',
			},
			{
				displayName: 'Show Splash',
				name: 'show_splash',
				type: 'boolean',
				default: false,
				description: 'Whether to show splash screen on startup',
			},
			{
				displayName: 'Shuffle Playlist',
				name: 'shuffle_playlist',
				type: 'boolean',
				default: false,
				description: 'Whether to shuffle the playlist',
			},
			{
				displayName: 'Use 24 Hour Clock',
				name: 'use_24_hour_clock',
				type: 'boolean',
				default: false,
				description: 'Whether to use 24 hour clock format',
			},
		],
	},
];
