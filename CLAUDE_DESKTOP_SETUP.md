# Claude Desktop MCP Server Integration Guide

## Overview
This guide helps you integrate your authentication MCP server with Claude Desktop.

## Prerequisites
1. ✅ Claude Desktop installed
2. ✅ MCP server built and working (`npm run build` completed)
3. ✅ FastAPI backend running on http://localhost:8000
4. ✅ Node.js installed at `C:\Program Files\nodejs`

## Configuration Steps

### Step 1: Locate Claude Desktop Config Directory
The configuration file should be placed at:
```
%APPDATA%\Claude\claude_desktop_config.json
```

Full path example:
```
C:\Users\[YourUsername]\AppData\Roaming\Claude\claude_desktop_config.json
```

### Step 2: Choose Configuration File

#### Production Configuration (Recommended)
Use `claude_desktop_config.json` for normal operation:
```json
{
  "mcpServers": {
    "auth-api-server": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["C:\\Users\\pulkit.anchalia\\OneDrive - UKG\\Desktop\\test\\mcp-server\\dist\\index.js"],
      "env": {
        "NODE_ENV": "production",
        "API_BASE_URL": "http://localhost:8000",
        "PATH": "C:\\Program Files\\nodejs;${PATH}"
      }
    }
  }
}
```

#### Development Configuration (For Debugging)
Use `claude_desktop_config_dev.json` for debugging:
```json
{
  "mcpServers": {
    "auth-api-server": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["C:\\Users\\pulkit.anchalia\\OneDrive - UKG\\Desktop\\test\\mcp-server\\dist\\index.js"],
      "env": {
        "NODE_ENV": "development",
        "API_BASE_URL": "http://localhost:8000",
        "DEBUG": "true",
        "PATH": "C:\\Program Files\\nodejs;${PATH}"
      }
    }
  }
}
```

### Step 3: Install Configuration

#### Option A: Manual Copy
1. Open File Explorer
2. Navigate to `%APPDATA%\Claude\`
3. Copy `claude_desktop_config.json` to this directory
4. Restart Claude Desktop

#### Option B: Using Command Line
```batch
copy "C:\Users\pulkit.anchalia\OneDrive - UKG\Desktop\test\claude_desktop_config.json" "%APPDATA%\Claude\"
```

#### Option C: Using PowerShell
```powershell
Copy-Item "C:\Users\pulkit.anchalia\OneDrive - UKG\Desktop\test\claude_desktop_config.json" "$env:APPDATA\Claude\"
```

### Step 4: Verify Configuration

1. **Restart Claude Desktop** completely
2. **Start your backend server**: `start-backend.bat`
3. **Test in Claude**: Ask "Can you check if the authentication system is working?"

Claude should now have access to these tools:
- `auth_health_check` - Check system status
- `auth_signup` - Register new users
- `auth_login` - User authentication
- `auth_get_current_user` - Get user info
- `auth_logout` - End user sessions

## Troubleshooting

### MCP Server Not Found
- Verify the path to `dist/index.js` is correct
- Make sure you ran `npm run build` successfully
- Check that Node.js is at `C:\Program Files\nodejs\node.exe`

### Backend Connection Failed
- Ensure FastAPI backend is running: `http://localhost:8000`
- Test with: `curl http://localhost:8000/`
- Check firewall settings

### Claude Doesn't See Tools
- Restart Claude Desktop completely
- Check config file syntax (JSON must be valid)
- Look for Claude Desktop error logs

### Permission Errors
- Run Claude Desktop as Administrator (if needed)
- Check file permissions on the MCP server directory
- Verify Node.js has execution permissions

## Configuration Details

### Key Parameters Explained

- **command**: Full path to Node.js executable
- **args**: Path to your compiled MCP server
- **NODE_ENV**: Set to "production" or "development"
- **API_BASE_URL**: Your FastAPI backend URL
- **PATH**: Ensures Node.js is found during execution

### Environment Variables

- `NODE_ENV=production` - Optimized for performance
- `NODE_ENV=development` - Enables debugging features
- `API_BASE_URL` - Backend server URL (change if different)
- `DEBUG=true` - Additional logging (development only)

## Testing the Integration

### Basic Test
Ask Claude:
```
"Can you check if the authentication system is working?"
```

Expected response: Claude calls `auth_health_check` and reports system status.

### User Registration Test
Ask Claude:
```
"Create a test account with username 'testuser' and email 'test@example.com'"
```

Expected response: Claude calls `auth_signup` and confirms user creation.

### Complete Workflow Test
Ask Claude:
```
"Help me test the complete authentication workflow - create a user, log them in, check their info, and log them out"
```

Expected response: Claude performs all authentication operations in sequence.

## Advanced Configuration

### Multiple Environments
You can configure different MCP servers for different environments:

```json
{
  "mcpServers": {
    "auth-api-local": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["C:\\path\\to\\local\\mcp-server\\dist\\index.js"],
      "env": { "API_BASE_URL": "http://localhost:8000" }
    },
    "auth-api-staging": {
      "command": "C:\\Program Files\\nodejs\\node.exe", 
      "args": ["C:\\path\\to\\staging\\mcp-server\\dist\\index.js"],
      "env": { "API_BASE_URL": "https://staging-api.example.com" }
    }
  }
}
```

### Logging and Debugging
For troubleshooting, you can enable additional logging:

```json
{
  "mcpServers": {
    "auth-api-server": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["C:\\Users\\pulkit.anchalia\\OneDrive - UKG\\Desktop\\test\\mcp-server\\dist\\index.js"],
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "*",
        "VERBOSE": "true",
        "API_BASE_URL": "http://localhost:8000"
      }
    }
  }
}
```

## Next Steps

1. **Copy configuration** to Claude Desktop config directory
2. **Restart Claude Desktop**
3. **Start your backend server**
4. **Test the integration** with Claude
5. **Explore AI-powered authentication** workflows!

Your authentication system is now ready for AI assistant integration! 🚀
