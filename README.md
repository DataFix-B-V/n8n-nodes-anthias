![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-anthias

This is a custom node for n8n, a powerful workflow automation tool. It provides a simple way to connect your n8n workflows with the Anthias, a digital signage platform. By using this node, you can automate tasks related to your digital displays, content management, and player controls.

## What can you do with this node?
The n8n-nodes-anthias node acts as a bridge between n8n and the Anthias API. It includes features like:

- Retrieve information about your screens and players.
- Update content on a display.
- Change the schedule for a screen.
- Trigger actions on a player, such as a reboot or a content refresh.

## Developer
![logo](https://github.com/datafix-b-v/n8n-nodes-anthias/blob/master/images/logoDataFix.png)

This node was created by [DataFix B.V.](https://datafix.nl), a n8n expert partner from the Netherlands.

DataFix supports companies with their implementation of n8n, including node development. If you want to use our services, feel free to reach out. You can contact us through our [site](https://datafix.nl) or by emailing hi@datafix.nl


## Credentials

To connect the Anthias node to your Anthias deployment, you need the device's API URL and, if authentication is enabled, a username and password.

### 1. Enable API authentication in Anthias

1. Open the Anthias dashboard in your browser using your device's IP address or hostname.
2. Navigate to **Settings → Authentication**.
3. Select **Basic Authentication** as the authentication method.
4. Configure a username and a strong password.
5. Save the settings.

These credentials are used to authenticate requests to your Anthias deployment.

**Note:** New Anthias installations have authentication disabled by default. Enabling authentication is recommended to prevent unauthorized access to your device.

### 2. Find your Anthias API URL

The Anthias API is hosted directly on your device.

The API v2 base URL follows this format:

```text
http://<device-ip>/api/v2
```

For example, if your Anthias device is available at `192.168.1.100`, your API base URL is:

```text
http://192.168.1.100/api/v2
```

If your deployment uses HTTPS or a custom hostname, use the corresponding address instead.

### 3. Configure credentials in n8n

1. Open your n8n instance.
2. Add the **Anthias** node to your workflow.
3. Under **Credential for Anthias Credentials API**, select **Create New Credential**.
4. Enter the following values:

| Field | Description | Example |
|-------|-------------|---------|
| User Name | Username configured in Anthias | `admin` |
| Password | Password configured in Anthias | Your Anthias password |
| Base URL (Including /api/v2) | Base URL of your Anthias API | `http://192.168.1.100/api/v2` |

5. Save the credential.
6. Test the connection to verify that n8n can communicate with your Anthias device.

The credential uses HTTP Basic authentication to authenticate API requests.

**Security:** HTTP Basic authentication should be used over HTTPS or a trusted private network. Do not expose your Anthias API directly to the public internet.

For more information, see the [Anthias API documentation](https://anthias.screenly.io/api/).

## Example: Get Many Assets

This example demonstrates how to retrieve assets from your Anthias deployment using n8n.

### Step 1: Add the Anthias node

1. Open an existing workflow or create a new workflow in n8n.
2. Add the **Anthias** node.
3. Select the Anthias credential configured above.

### Step 2: Configure the operation

Configure the node with the following settings:

| Setting | Value |
|---------|-------|
| Resource | Asset |
| Operation | Get Many |
| Overwrite Credential Base URL | Leave empty |

Leaving **Overwrite Credential Base URL** empty makes the node use the Base URL configured in your credentials.

### Step 3: Execute the node

1. Click **Execute step**.
2. The node sends a GET request to your Anthias deployment.
3. The retrieved assets appear in the node's output panel.

The corresponding API request is:

```http
GET http://192.168.1.100/api/v2/assets
```

Authentication is handled automatically using your configured credentials.

### Step 4: View the results

The node returns the assets available in your Anthias deployment.

For example, a simplified response could look like this:

```json
[
  {
    "asset_id": "example-asset-001",
    "name": "Welcome Screen",
    "uri": "https://example.com/welcome.png",
    "duration": 10,
    "mimetype": "image/png",
    "is_enabled": true
  },
  {
    "asset_id": "example-asset-002",
    "name": "Company Website",
    "uri": "https://example.com",
    "duration": 30,
    "mimetype": "text/html",
    "is_enabled": true
  }
]
```

**Note:** This is illustrative data. The actual output depends on the assets configured in your Anthias deployment.

### Optional: Use a different Anthias deployment

You can override the Base URL configured in your credentials for an individual node.

1. Open the Anthias node.
2. Enter a different API base URL in **Overwrite Credential Base URL**.
3. Execute the node again.

For example:

```text
http://192.168.1.101/api/v2
```

This allows you to connect to different Anthias devices without creating a separate credential for each device, provided the same username and password are valid.

## Additional Resources

- [Anthias Official Website](https://anthias.screenly.io/)
- [Anthias API Documentation](https://anthias.screenly.io/api/)
- [Anthias GitHub Repository](https://github.com/Screenly/Anthias)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## More information

Refer to the [documentation on installing nodes](https://docs.n8n.io/integrations/community-nodes/installation/) for detailed information on installing custom nodes.

Refer to the [documentation on creating nodes](https://docs.n8n.io/integrations/creating-nodes/) for detailed information on building your own nodes.

## License

[MIT](https://github.com/DataFix-B-V/n8n-nodes-anthias/blob/main/LICENSE.md)
