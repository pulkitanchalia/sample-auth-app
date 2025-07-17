# Install MCP Server Dependencies
# PowerShell script to install Node.js dependencies

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing MCP Server Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set Node.js paths
$nodePath = "C:\Program Files\nodejs\node.exe"
$npmPath = "C:\Program Files\nodejs\npm.cmd"

# Add Node.js to PATH for this session
$env:PATH = "C:\Program Files\nodejs;$env:PATH"

# Verify Node.js installation
if (-not (Test-Path $nodePath)) {
    Write-Host "❌ Node.js not found at: $nodePath" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path $npmPath)) {
    Write-Host "❌ NPM not found at: $npmPath" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Node.js found at: $nodePath" -ForegroundColor Green
Write-Host "✅ NPM found at: $npmPath" -ForegroundColor Green

# Get script directory and navigate to mcp-server
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$mcpServerDir = Join-Path $scriptDir "mcp-server"

if (-not (Test-Path $mcpServerDir)) {
    Write-Host "❌ MCP server directory not found at: $mcpServerDir" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "📁 Navigating to: $mcpServerDir" -ForegroundColor Blue
Set-Location $mcpServerDir

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found in current directory" -ForegroundColor Red
    Write-Host "Current location: $(Get-Location)" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Found package.json" -ForegroundColor Green

# Show package.json info
$packageJson = Get-Content "package.json" | ConvertFrom-Json
Write-Host "📦 Package: $($packageJson.name) v$($packageJson.version)" -ForegroundColor Blue

# Check Node.js and NPM versions
try {
    $nodeVersion = & $nodePath --version
    $npmVersion = & $npmPath --version
    Write-Host "🟢 Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "🟢 NPM version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error checking versions: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray

try {
    # Run npm install with full path
    & $npmPath install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
        
        # Check if node_modules was created
        if (Test-Path "node_modules") {
            $moduleCount = (Get-ChildItem "node_modules" -Directory).Count
            Write-Host "📁 Created node_modules with $moduleCount packages" -ForegroundColor Blue
        }
        
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Build the project: npm run build" -ForegroundColor White
        Write-Host "2. Start the server: npm start" -ForegroundColor White
        Write-Host "3. Or use the start script: start-mcp-server.ps1" -ForegroundColor White
        
    } else {
        Write-Host "❌ npm install failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error during installation: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "1. Run PowerShell as Administrator" -ForegroundColor White
    Write-Host "2. Clear npm cache: npm cache clean --force" -ForegroundColor White
    Write-Host "3. Check internet connection" -ForegroundColor White
    Write-Host "4. Try deleting node_modules and package-lock.json if they exist" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to exit"
