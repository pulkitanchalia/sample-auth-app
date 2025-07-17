# Manual MCP Server Startup Instructions

Since Node.js is installed at `C:\Program Files\nodejs` but not in your PATH, here are the manual steps to start the MCP server:

## Step 1: Open Command Prompt or PowerShell as Administrator

1. Press `Win + R`, type `cmd`, and press `Ctrl + Shift + Enter` (to run as admin)
   OR
   Press `Win + X` and select "Windows PowerShell (Admin)"

## Step 2: Add Node.js to PATH (Temporary)

In the command prompt, run:
```batch
set PATH=C:\Program Files\nodejs;%PATH%
```

For PowerShell, run:
```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
```

## Step 3: Verify Node.js is Working

Test Node.js:
```batch
node --version
npm --version
```

You should see version numbers like:
```
v20.x.x
10.x.x
```

## Step 4: Navigate to MCP Server Directory

```batch
cd "c:\Users\pulkit.anchalia\OneDrive - UKG\Desktop\test\mcp-server"
```

## Step 5: Install Dependencies (First Time Only)

```batch
npm install
```

This will download all required packages. You should see:
- Progress indicators for downloading packages
- No error messages
- A `node_modules` folder created

## Step 6: Build the TypeScript Code

```batch
npm run build
```

This compiles the TypeScript to JavaScript. You should see:
- Compilation messages
- A `dist` folder created with `index.js`

## Step 7: Start the MCP Server

```batch
npm start
```

When successful, you'll see:
```
Auth API MCP Server running on stdio
```

## Step 8: Test the Server (Optional)

Open another command prompt and run:
```batch
cd "c:\Users\pulkit.anchalia\OneDrive - UKG\Desktop\test"
test-api-and-mcp.ps1
```

## Troubleshooting

### If you get "node is not recognized":
- Make sure you ran the PATH command in Step 2
- Try closing and reopening the command prompt
- Verify Node.js is actually installed at `C:\Program Files\nodejs`

### If npm install fails:
- Run as Administrator
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` folder and try again

### If build fails:
- Check for TypeScript errors in the output
- Make sure all dependencies installed correctly
- Try: `npm run build --verbose`

### If start fails:
- Make sure the build completed successfully
- Check that `dist/index.js` exists
- Verify the backend is running on http://localhost:8000

## Permanent PATH Fix (Optional)

To permanently add Node.js to your PATH:

1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Click "Environment Variables"
3. Under "System Variables", find and select "Path"
4. Click "Edit"
5. Click "New"
6. Add: `C:\Program Files\nodejs`
7. Click "OK" on all dialogs
8. Restart your command prompt

## Quick Commands Summary

```batch
# Set PATH (temporary)
set PATH=C:\Program Files\nodejs;%PATH%

# Navigate to MCP server
cd "c:\Users\pulkit.anchalia\OneDrive - UKG\Desktop\test\mcp-server"

# Install, build, and start
npm install
npm run build
npm start
```

## What the MCP Server Does

Once running, the MCP server:
- ✅ Connects to your FastAPI backend at http://localhost:8000
- ✅ Exposes authentication tools for AI assistants
- ✅ Runs on stdio protocol for MCP compatibility
- ✅ Logs all operations to stderr for debugging

The server will keep running until you press `Ctrl+C` to stop it.
