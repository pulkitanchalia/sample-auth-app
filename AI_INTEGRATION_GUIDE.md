# MCP Server AI Integration Guide

## Overview

This guide explains how to integrate the MCP server with various AI assistants and platforms. The MCP server exposes your authentication backend as tools that AI systems can use programmatically.

## Integration Methods

### 1. Claude Desktop Integration

Claude Desktop supports MCP servers natively. Here's how to configure it:

#### Configuration File
Create or edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "auth-api-server": {
      "command": "node",
      "args": ["C:\\path\\to\\your\\test\\mcp-server\\dist\\index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

#### Steps:
1. Build the MCP server: `npm run build`
2. Add the configuration above
3. Restart Claude Desktop
4. The authentication tools will be available in conversations

### 2. VS Code with Continue Extension

If using Continue extension in VS Code:

#### Configuration in `.continue/config.json`:
```json
{
  "models": [...],
  "mcpServers": [
    {
      "name": "auth-api-server",
      "command": "node",
      "args": ["./mcp-server/dist/index.js"],
      "cwd": "C:\\path\\to\\your\\test"
    }
  ]
}
```

### 3. Custom AI Application Integration

For custom applications, use the MCP SDK:

#### Node.js Example:
```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

async function connectToMCPServer() {
  // Start the MCP server process
  const serverProcess = spawn('node', ['./mcp-server/dist/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Create client transport
  const transport = new StdioClientTransport({
    reader: serverProcess.stdout,
    writer: serverProcess.stdin
  });

  // Create and connect client
  const client = new Client(
    { name: "my-ai-app", version: "1.0.0" },
    { capabilities: {} }
  );

  await client.connect(transport);
  return client;
}

// Use the tools
async function demonstrateUsage() {
  const client = await connectToMCPServer();
  
  // List available tools
  const tools = await client.request(
    { method: "tools/list" },
    {}
  );
  console.log('Available tools:', tools.tools);

  // Call a tool
  const result = await client.request(
    { method: "tools/call" },
    {
      name: "auth_health_check",
      arguments: {}
    }
  );
  console.log('Health check result:', result);
}
```

### 4. Python Integration Example

For Python-based AI applications:

```python
import subprocess
import json
import asyncio
from mcp import ClientSession, StdioServerParameters

async def use_mcp_server():
    # Start the MCP server
    server_params = StdioServerParameters(
        command="node",
        args=["./mcp-server/dist/index.js"]
    )
    
    async with ClientSession(server_params) as session:
        # List tools
        tools = await session.list_tools()
        print("Available tools:", [tool.name for tool in tools])
        
        # Use health check tool
        result = await session.call_tool("auth_health_check", {})
        print("Health check:", result)
        
        # Register a user
        signup_result = await session.call_tool("auth_signup", {
            "username": "ai_user",
            "email": "ai@example.com", 
            "password": "secure123"
        })
        print("Signup result:", signup_result)

# Run the example
asyncio.run(use_mcp_server())
```

## Available MCP Tools

The server exposes these tools for AI use:

### 1. `auth_health_check`
- **Purpose**: Check if backend API is running
- **Parameters**: None
- **AI Use Case**: Verify system availability before other operations

### 2. `auth_signup` 
- **Purpose**: Register new user accounts
- **Parameters**: `username`, `email`, `password`
- **AI Use Case**: Create accounts for users during conversations

### 3. `auth_login`
- **Purpose**: Authenticate users and get tokens
- **Parameters**: `username`, `password`  
- **AI Use Case**: Login users and obtain authentication tokens

### 4. `auth_get_current_user`
- **Purpose**: Get user information with token
- **Parameters**: `token`
- **AI Use Case**: Retrieve user details for personalization

### 5. `auth_logout`
- **Purpose**: End user sessions
- **Parameters**: `token`
- **AI Use Case**: Securely logout users

## AI Workflow Examples

### Example 1: User Registration Workflow
```
AI: "I'll help you create an account. Let me register you in the system."

1. AI calls: auth_health_check() - Verify system is running
2. AI calls: auth_signup({username: "john", email: "john@example.com", password: "secure123"})
3. AI responds: "Account created successfully! You can now login."
```

### Example 2: Authentication Workflow  
```
AI: "Let me log you into the system."

1. AI calls: auth_login({username: "john", password: "secure123"})
2. AI receives token and stores it
3. AI calls: auth_get_current_user({token: "jwt_token_here"})
4. AI responds: "Welcome back, John! Your account is active."
```

### Example 3: User Management
```
AI: "I'll check your account status and then log you out."

1. AI calls: auth_get_current_user({token: stored_token})
2. AI displays user information
3. AI calls: auth_logout({token: stored_token})
4. AI responds: "You've been logged out successfully."
```

## Configuration Options

### Environment Variables
The MCP server can be configured with environment variables:

```bash
# Backend API URL (default: http://localhost:8000)
export API_BASE_URL=http://localhost:8000

# Timeout settings
export REQUEST_TIMEOUT=30000
```

### Custom Configuration
Modify the MCP server configuration in `src/index.ts`:

```typescript
// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
const REQUEST_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT || '30000');

// Add custom headers if needed
const DEFAULT_HEADERS = {
  'User-Agent': 'MCP-Auth-Server/1.0.0',
  'Accept': 'application/json'
};
```

## Security Considerations

### 1. Token Management
- AI assistants should securely store JWT tokens
- Tokens should be cleared after logout
- Implement token refresh if needed

### 2. Network Security
- MCP server communicates with local backend only
- Use HTTPS in production environments
- Validate all inputs through Zod schemas

### 3. Access Control
- MCP server inherits backend authentication rules
- Users can only access their own data
- Admin operations require proper permissions

## Testing AI Integration

### 1. Manual Testing
Use the provided test script:
```bash
test-api-and-mcp.ps1
```

### 2. Automated Testing
Create test scenarios for AI workflows:

```javascript
// Test AI workflow
async function testAIWorkflow() {
  const client = await connectToMCPServer();
  
  // Test health check
  await client.call_tool("auth_health_check", {});
  
  // Test user registration
  const signupResult = await client.call_tool("auth_signup", {
    username: "test_ai_user",
    email: "test@ai.com",
    password: "testpass123"
  });
  
  // Test login
  const loginResult = await client.call_tool("auth_login", {
    username: "test_ai_user", 
    password: "testpass123"
  });
  
  const token = JSON.parse(loginResult.content[0].text).token;
  
  // Test user info retrieval
  await client.call_tool("auth_get_current_user", { token });
  
  // Test logout
  await client.call_tool("auth_logout", { token });
  
  console.log("AI workflow test completed successfully!");
}
```

## Troubleshooting Integration

### Common Issues:

1. **MCP Server Not Found**
   - Ensure the path to `dist/index.js` is correct
   - Check that the server was built: `npm run build`

2. **Backend Connection Failed**
   - Verify FastAPI backend is running on localhost:8000
   - Check firewall/network settings

3. **Tool Calls Failing**
   - Review MCP server logs (stderr output)
   - Validate input parameters match schema requirements

4. **Permission Errors**
   - Ensure Node.js has proper file permissions
   - Check that the MCP server process can access the backend

## Advanced Integration

### Custom Tool Development
Extend the MCP server with additional tools:

```typescript
// Add new tool to the tools list
{
  name: 'auth_reset_password',
  description: 'Reset user password with email',
  inputSchema: {
    type: 'object',
    properties: {
      email: { type: 'string', description: 'User email address' }
    },
    required: ['email']
  }
}

// Implement the handler
async function handlePasswordReset(args: any) {
  const { email } = args;
  const response = await axios.post(`${API_BASE_URL}/reset-password`, { email });
  
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        success: true,
        message: 'Password reset email sent'
      }, null, 2)
    }]
  };
}
```

### Multi-Environment Support
Configure different backends for different environments:

```typescript
const getApiBaseUrl = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production': return 'https://api.yourapp.com';
    case 'staging': return 'https://staging-api.yourapp.com';
    default: return 'http://localhost:8000';
  }
};
```

This comprehensive integration guide shows how AI assistants can use your authentication system through the MCP server, enabling seamless user management in AI-powered applications.
