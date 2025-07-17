# Auth API MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to the authentication API endpoints.

## Features

The MCP server exposes the following tools:

### 🔧 **Available Tools**

1. **auth_health_check** - Check if the authentication API is running
2. **auth_signup** - Register a new user account
3. **auth_login** - Login with credentials to get JWT token
4. **auth_get_current_user** - Get current user info using JWT token
5. **auth_logout** - Logout and invalidate session

## Setup

### 1. Install Dependencies
```bash
cd mcp-server
npm install
```

### 2. Build the Server
```bash
npm run build
```

### 3. Run the Server
```bash
npm start
```

## Development

### Run in Development Mode
```bash
npm run dev
```

### Watch Mode
```bash
npm run watch
```

## Configuration

The server connects to the authentication API at:
- **Base URL**: `http://localhost:8000`

Make sure your FastAPI backend is running before using the MCP server.

## Usage Examples

### Health Check
```json
{
  "method": "tools/call",
  "params": {
    "name": "auth_health_check",
    "arguments": {}
  }
}
```

### Sign Up New User
```json
{
  "method": "tools/call",
  "params": {
    "name": "auth_signup",
    "arguments": {
      "username": "johndoe",
      "email": "john@example.com",
      "password": "securepassword123"
    }
  }
}
```

### Login User
```json
{
  "method": "tools/call",
  "params": {
    "name": "auth_login",
    "arguments": {
      "username": "johndoe",
      "password": "securepassword123"
    }
  }
}
```

### Get Current User
```json
{
  "method": "tools/call",
  "params": {
    "name": "auth_get_current_user",
    "arguments": {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
  }
}
```

### Logout User
```json
{
  "method": "tools/call",
  "params": {
    "name": "auth_logout",
    "arguments": {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
  }
}
```

## Error Handling

The server provides proper error handling for:
- Invalid input parameters
- Authentication failures
- API connection issues
- Network errors

## Integration

To use this MCP server with an AI assistant:

1. Start your FastAPI backend (`http://localhost:8000`)
2. Build and start the MCP server
3. Configure your AI assistant to connect to the MCP server
4. Use the available tools to interact with the authentication API

## Security Notes

- JWT tokens are passed as parameters - ensure secure communication
- The server validates all input parameters
- API errors are properly handled and reported
- No sensitive data is logged by default
