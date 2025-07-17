# MCP Server Setup and Run Script
# PowerShell version with Node.js path fix

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MCP Server Setup and Run" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Add Node.js to PATH for this session
$env:PATH = "C:\Program Files\nodejs;$env:PATH"

# Set Node.js paths
$nodePath = "C:\Program Files\nodejs\node.exe"
$npmPath = "C:\Program Files\nodejs\npm.cmd"

# Check if Node.js is installed
if (Test-Path $nodePath) {
    Write-Host "✅ Node.js found at: $nodePath" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found at expected location." -ForegroundColor Red
    Write-Host "Please check if Node.js is installed correctly." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Node.js version
try {
    $nodeVersion = & $nodePath --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error running Node.js: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check NPM version
try {
    $npmVersion = & $npmPath --version
    Write-Host "NPM version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error running NPM: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Navigating to MCP server directory..." -ForegroundColor Yellow

# Get the script directory and navigate to mcp-server
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$mcpServerDir = Join-Path $scriptDir "mcp-server"

if (-not (Test-Path $mcpServerDir)) {
    Write-Host "❌ MCP server directory not found at $mcpServerDir" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Set-Location $mcpServerDir
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Blue

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    try {
        & $npmPath install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed with exit code $LASTEXITCODE"
        }
        Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install dependencies: $($_.Exception.Message)" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "✅ Dependencies already installed." -ForegroundColor Green
}

Write-Host ""
Write-Host "Building TypeScript code..." -ForegroundColor Yellow
try {
    & $npmPath run build
    if ($LASTEXITCODE -ne 0) {
        throw "npm run build failed with exit code $LASTEXITCODE"
    }
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to build the project: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting MCP Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "The server will run on stdio." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host ""

try {
    & $npmPath start
} catch {
    Write-Host "❌ Failed to start MCP server: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
