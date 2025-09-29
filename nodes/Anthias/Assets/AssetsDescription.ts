import { INodeProperties } from 'n8n-workflow';

export const assetsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'getAllAssets',
	options: [
	  { name: 'Control Asset Playback', value: 'controlAssetPlayback', action: 'Control asset playback' },
	  { name: 'Create Asset', value: 'createAsset', action: 'Create an asset' },
		{ name: 'Delete Asset', value: 'deleteAsset', action: 'Delete an asset' },
	  { name: 'Get All Assets', value: 'getAllAssets', action: 'Get all assets' },
	  { name: 'Get Asset', value: 'getAsset', action: 'Get an asset' },
	  { name: 'Get Asset Content', value: 'getAssetContent', action: 'Get asset content' },
	  { name: 'Update Asset', value: 'updateAsset', action: 'Update an asset' },
		{ name: 'Update Playlist Order', value: 'updatePlaylistOrder', action: 'Update playlist order' }
	],
    displayOptions: {
			show: {
				resource: ['asset']
			}
		},
  },
	{
		displayName: 'Playlist Order',
		name: 'ids',
		type: 'string',
		default: '',
		placeholder: 'Comma-separated list of asset IDs in the desired order',
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['updatePlaylistOrder']
			}
		},
	},
  {
    displayName: 'Asset ID',
    name: 'assetId',
    type: 'string',
		required: true,
    default: '',
    placeholder: 'ID of the asset',
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['getAsset', 'getAssetContent', 'updateAsset' ,'deleteAsset'],
      },
    },
  },
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['createAsset', 'updateAsset']
			}
		},
		placeholder: 'Enter the name of the asset',
	},
	{
		displayName: 'URI',
		name: 'uri',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['createAsset']
			}
		},
		placeholder: 'Enter the URI of the asset',
	},
	{
		displayName: 'Start Date',
		name: 'start_date',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['createAsset', 'updateAsset']
			}
		},
		placeholder: 'YYYY-MM-DDTHH:MM:SSZ',
	},
	{
		displayName: 'End Date',
		name: 'end_date',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['createAsset', 'updateAsset']
			}
		},
		placeholder: 'YYYY-MM-DDTHH:MM:SSZ',
	},
	{
		displayName: 'Duration',
		name: 'duration',
		type: 'number',
		default: 5,
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['createAsset', 'updateAsset']
			}
		},
		placeholder: 'Duration in seconds',
	},
	{
		displayName: 'MIME Type',
		name: 'mimetype',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['createAsset']
			}
		},
		placeholder: 'Enter the MIME type of the asset',
	},
	{
		displayName: 'Is Enabled',
		name: 'is_enabled',
		type: 'boolean',
		default: true,
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['createAsset']
			}
		},
		description: 'Whether the asset is enabled',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['updateAsset']
			}
		},
		placeholder: 'Enter the name of the asset',
	},
	{
		displayName: 'Is Enabled',
		name: 'is_enabled',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['updateAsset']
			}
		},
		description: 'Whether the asset is enabled',
	},
  {
    displayName: 'Control Asset Playback',
    name: 'controlCommand',
    type: 'options',
    default: 'next',
    options: [
      { name: 'Next', value: 'next', description: 'Play the next asset' },
      { name: 'Previous', value: 'previous', description: 'Play the previous asset' },
      { name: 'Custom (Specify Asset)', value: 'custom', description: 'Play a specific asset' },
    ],
    placeholder: 'Control the asset playback',
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['controlAssetPlayback'],
      },
    },
  },
  {
    displayName: 'Asset ID (for Custom)',
    name: 'assetIdPlayback',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'ID of the asset to play',
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['controlAssetPlayback'],
        controlCommand: ['custom'],
      },
    },
  },
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['createAsset', 'updateAsset']
			}
		},
		options: [
		{
			displayName: 'Is Processing',
			name: 'is_processing',
			type: 'boolean',
			default: true,
			description: 'Whether the asset is processing',
		},
		{
			displayName: 'Nocache',
			name: 'nocache',
			type: 'boolean',
			default: true,
			description: 'Whether to bypass cache',
		},
		{
			displayName: 'Play Order',
			name: 'play_order',
			type: 'number',
			default: 0,
			description: 'The play order of the asset',
		},
		{
			displayName: 'Skip Asset Check',
			name: 'skip_asset_check',
			type: 'boolean',
			default: true,
			description: 'Whether to skip asset check',
		},
		],
	},

  // Hidden computed field -> final path param value
  {
    displayName: 'Computed Command',
    name: 'command',
    type: 'hidden',
    // Produces: "next", "previous", or "asset&<id>"
    default:
      "={{ $parameter.controlCommand === 'custom' ? 'asset&' + $parameter.assetIdPlayback : $parameter.controlCommand }}",
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['controlAssetPlayback'],
      },
    },
  },
];
