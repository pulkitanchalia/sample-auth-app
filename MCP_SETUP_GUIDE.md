# MCP Server Setup Guide

## Overview

The MCP (Model Context Protocol) server exposes the FastAPI backend authentication APIs as tools that can be used by AI assistants. This allows AI systems to interact with the authentication system programmatically.

## What is MCP?

Model Context Protocol (MCP) is a protocol that allows AI assistants to access external tools and resources. In this case, our MCP server provides authentication-related tools that an AI can use to:

- Register new users
- Login users and obtain JWT tokens
- Retrieve user information
- Handle user logout
- Check API health

## Prerequisites

1. **Node.js and npm**: Download from [https://nodejs.org/](https://nodejs.org/)
2. **Running FastAPI backend**: The backend must be running on `http://localhost:8000`

## Installation

### Automatic Setup (Recommended)

1. **Install Node.js** (if not already installed):
   ```bash
   # Run the installation helper
   install-nodejs.bat
   ```

2. **Start the MCP server**:
   ```bash
   # This will install dependencies, build, and start the server
   start-mcp-server.bat     # Windows Batch
   # OR
   start-mcp-server.ps1     # PowerShell
   ```

### Manual Setup

1. **Navigate to MCP server directory**:
   ```bash
   cd mcp-server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the TypeScript code**:
   ```bash
   npm run build
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

## MCP Tools Available

### 1. `auth_health_check`
- **Description**: Check if the authentication API is running
- **Parameters**: None
- **Returns**: Health status of the API

### 2. `auth_signup`
- **Description**: Register a new user account
- **Parameters**:
  - `username` (string): Username for the new account
  - `email` (string): Email address for the new account
  - `password` (string): Password (minimum 6 characters)
- **Returns**: User creation success message and user details

### 3. `auth_login`
- **Description**: Login with username and password to get JWT token
- **Parameters**:
  - `username` (string): Username to login with
  - `password` (string): Password to login with
- **Returns**: JWT access token and token type

### 4. `auth_get_current_user`
- **Description**: Get current user information using JWT token
- **Parameters**:
  - `token` (string): JWT token from login
- **Returns**: Current user details

### 5. `auth_logout`
- **Description**: Logout current user session
- **Parameters**:
  - `token` (string): JWT token to logout
- **Returns**: Logout success message

## Testing the MCP Server

### 1. Test Backend Connectivity
Run the comprehensive test:
```bash
test-api-and-mcp.ps1
```

### 2. Manual API Testing
Test the backend APIs directly:
```bash
# Health check
curl http://localhost:8000/

# Register user
curl -X POST "http://localhost:8000/signup" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'

# Login
curl -X POST "http://localhost:8000/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

## Configuration

The MCP server is configured to connect to:
- **Backend API**: `http://localhost:8000`
- **Communication**: stdio (standard input/output)

To change the backend URL, modify the `API_BASE_URL` constant in `src/index.ts`.

## Integration with AI Assistants

Once running, the MCP server can be integrated with compatible AI assistants by:

1. **Configure the AI assistant** to use the MCP server
2. **Specify the server path**: Point to the built JavaScript file (`dist/index.js`)
3. **Use the tools**: The AI can now call the authentication tools

Example MCP configuration for an AI assistant:
```json
{
  "name": "auth-api-server",
  "command": "node",
  "args": ["dist/index.js"],
  "cwd": "/path/to/mcp-server"
}
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Watching for Changes
```bash
npm run watch
```

### Building for Production
```bash
npm run build
```

## Troubleshooting

### Common Issues

1. **"Node.js not found"**
   - Install Node.js from https://nodejs.org/
   - Restart your terminal/command prompt
   - Verify with: `node --version`

2. **"Backend API not accessible"**
   - Ensure FastAPI backend is running on `http://localhost:8000`
   - Test with: `curl http://localhost:8000/`

3. **"npm install fails"**
   - Try running as administrator
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and try again

4. **"Build fails"**
   - Check TypeScript errors in the console
   - Ensure all dependencies are installed
   - Try: `npm run build --verbose`

### Logs and Debugging

The MCP server logs to stderr, so you can see diagnostic information while it runs. The server communicates via stdio with the AI assistant.

## Security Considerations

- The MCP server runs locally and communicates with the local FastAPI backend
- JWT tokens are handled securely and passed through the MCP protocol
- No sensitive information is logged to console
- All API calls use proper authentication headers

## Next Steps

1. Start your FastAPI backend
2. Install Node.js if needed
3. Run the MCP server setup scripts
4. Configure your AI assistant to use the MCP server
5. Test the integration with the provided test scripts
