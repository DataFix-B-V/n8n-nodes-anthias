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
			{ name: 'Update Device Settings', value: 'updateDeviceSettings', action: 'Update device settings' },
		],
		displayOptions: {
			show: {
				resource: ['device']
			}
		},
	},

	{
		displayName: 'Player Name',
		name: 'player_name',
		placeholder: 'Device Player Name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'The name of the device as shown in the Anthias dashboard',
	},
	{
		displayName: 'Audio Output',
		name: 'audio_output',
		placeholder: 'Device Audio Output',
		type: 'string',
		default: 'HDMI',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'The audio output setting of the device (e.g., "HDMI", "Analog")',
	},
	{
		displayName: 'Default Duration',
		name: 'default_duration',
		type: 'number',
		placeholder: 'Default playback duration (seconds)',
		default: 5,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'Default duration for playback (in seconds)',
	},
	{
		displayName: 'Default Streaming Duration',
		name: 'default_streaming_duration',
		type: 'number',
		placeholder: 'Default streaming duration (seconds)',
		default: 5,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'Default streaming duration (in seconds)',
	},
	{
		displayName: 'Date Format',
		name: 'date_format',
		placeholder: 'Date format string',
		type: 'string',
		default: 'mm/dd/yyyy',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'Date format string',
	},
	{
		displayName: 'Show Splash',
		name: 'show_splash',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'Whether to show splash screen on startup',
	},
	{
		displayName: 'Default Assets',
		name: 'default_assets',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'Whether to use default assets',
	},
	{
		displayName: 'Shuffle Playlist',
		name: 'shuffle_playlist',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'Whether to shuffle the playlist',
	},
	{
		displayName: 'Use 24 Hour Clock',
		name: 'use_24_hour_clock',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'Whether to use 24 hour clock format',
	},
	{
		displayName: 'Debug Logging',
		name: 'debug_logging',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'Whether to enable debug logging',
	},
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		placeholder: 'Enter username',
		default: 'admin',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'Username for authentication',
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: {
			password: true,
		},
		placeholder: 'Enter password',
		default: 'admin',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'Password for authentication (default = "admin")',
	},
	{
		displayName: 'Confirm Password',
		name: 'password_2',
		placeholder: 'Confirm password',
		type: 'string',
		typeOptions: {
			password: true,
		},
		default: 'admin',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'Confirm password for verification (default = "admin")',
	},
	{
		displayName: 'Auth Backend',
		name: 'auth_backend',
		placeholder: 'Authentication backend ("" For no authentication / auth_basic - Basic authentication)',
		type: 'options',
		options: [
			{ name: 'No Authentication', value: '' },
			{ name: 'Basic Authentication', value: 'auth_basic' },
		],
		default: '',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'Authentication backend',
	},
	{
		displayName: 'Current Password',
		name: 'current_password',
		placeholder: 'Enter current password',
		type: 'string',
		typeOptions: {
			password: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateDeviceSettings'],
			},
		},
		description: 'Current password for verification',
	},
];
