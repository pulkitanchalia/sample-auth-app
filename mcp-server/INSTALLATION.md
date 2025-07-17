# Node.js Installation Guide for MCP Server

## Prerequisites
The MCP server requires Node.js and npm to be installed on your system.

## Installation Steps

### 1. Install Node.js
1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** for Windows
3. Run the installer and follow the setup wizard
4. Make sure to check "Add to PATH" during installation

### 2. Verify Installation
Open a new command prompt or PowerShell window and run:
```bash
node --version
npm --version
```

### 3. Install MCP Server Dependencies
Navigate to the mcp-server directory and install dependencies:
```bash
cd mcp-server
npm install
```

### 4. Build and Run the MCP Server
```bash
# Build the TypeScript code
npm run build

# Start the server
npm start

# Or run in development mode with auto-reload
npm run dev
```

## Troubleshooting

### Node.js not found after installation
- Close and reopen your command prompt/PowerShell
- Check if Node.js was added to your system PATH
- You may need to restart your computer

### Permission errors during npm install
- Run the command prompt as Administrator
- Or use: `npm install --no-optional`

### MCP Server Configuration
The MCP server will connect to your FastAPI backend at `http://localhost:8000`. Make sure your backend is running before testing the MCP server.

## Testing the MCP Server
Once running, the MCP server exposes the following tools:
- `register_user`: Register a new user
- `login_user`: Login with credentials
- `get_current_user`: Get current user info (requires auth token)
- `logout_user`: Logout current user

The server communicates via stdio and follows the Model Context Protocol specification.
