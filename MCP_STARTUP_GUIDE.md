# MCP Server Startup Guide

## Current Status: Node.js Not Detected

The MCP server requires Node.js to run, but it doesn't appear to be installed on your system.

## Step 1: Install Node.js

### Option A: Download from Official Website
1. Go to: https://nodejs.org/
2. Download the **LTS version** (recommended for most users)
3. Run the installer and follow the setup wizard
4. ✅ Make sure to check "Add to PATH" during installation
5. Restart your command prompt/PowerShell after installation

### Option B: Use Windows Package Manager (if available)
```powershell
# If you have winget installed
winget install OpenJS.NodeJS
```

### Option C: Use Chocolatey (if installed)
```powershell
# If you have Chocolatey installed
choco install nodejs
```

## Step 2: Verify Installation

After installing Node.js, open a **new** command prompt or PowerShell and run:

```bash
node --version
npm --version
```

You should see version numbers like:
```
v20.x.x
10.x.x
```

## Step 3: Start the MCP Server

Once Node.js is installed, you can start the MCP server:

### Option A: Use the automated script
```bash
cd "c:\Users\pulkit.anchalia\OneDrive - UKG\Desktop\test"
start-mcp-server.bat
```

### Option B: Manual startup
```bash
cd "c:\Users\pulkit.anchalia\OneDrive - UKG\Desktop\test\mcp-server"
npm install
npm run build
npm start
```

## Step 4: Verify MCP Server is Running

When successful, you should see:
```
Auth API MCP Server running on stdio
```

## Troubleshooting

### If Node.js installation fails:
- Make sure you're running as Administrator
- Try downloading the .msi installer directly
- Restart your computer after installation

### If "node is not recognized":
- Close and reopen your command prompt
- Check if Node.js was added to your system PATH
- You may need to restart your computer

### If npm install fails:
- Try running as Administrator
- Clear npm cache: `npm cache clean --force`
- Delete node_modules folder and try again

## What the MCP Server Does

Once running, the MCP server:
- ✅ Exposes your FastAPI authentication backend as AI tools
- ✅ Allows AI assistants to register users, login, logout, etc.
- ✅ Provides 5 authentication tools for AI integration
- ✅ Runs on stdio protocol for MCP compatibility

## Next Steps After Installation

1. **Start Backend**: Make sure your FastAPI backend is running on http://localhost:8000
2. **Start MCP Server**: Run `start-mcp-server.bat`
3. **Test Integration**: Run `run-ai-demo.bat` to see it in action
4. **Configure AI Assistant**: Use the provided configuration files

---

**Need help?** Check the detailed guides:
- `MCP_SETUP_GUIDE.md` - Complete setup instructions
- `AI_INTEGRATION_GUIDE.md` - How to integrate with AI assistants
- `COMPLETE_AI_INTEGRATION.md` - Overview of the entire system
