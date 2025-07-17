@echo off
echo ========================================
echo Installing MCP Server Dependencies
echo ========================================
echo.

REM Set Node.js paths
set "NODE_PATH=C:\Program Files\nodejs\node.exe"
set "NPM_PATH=C:\Program Files\nodejs\npm.cmd"

REM Add Node.js to PATH for this session
set "PATH=C:\Program Files\nodejs;%PATH%"

REM Check if Node.js exists
if not exist "%NODE_PATH%" (
    echo Error: Node.js not found at %NODE_PATH%
    pause
    exit /b 1
)

if not exist "%NPM_PATH%" (
    echo Error: NPM not found at %NPM_PATH%
    pause
    exit /b 1
)

echo Found Node.js at: %NODE_PATH%
echo Found NPM at: %NPM_PATH%

REM Navigate to MCP server directory
cd /d "%~dp0mcp-server"
if %errorlevel% neq 0 (
    echo Error: Could not navigate to mcp-server directory
    pause
    exit /b 1
)

echo Current directory: %cd%

REM Check if package.json exists
if not exist "package.json" (
    echo Error: package.json not found in current directory
    pause
    exit /b 1
)

echo Found package.json

REM Show Node.js and NPM versions
echo.
echo Checking versions...
"%NODE_PATH%" --version
"%NPM_PATH%" --version

echo.
echo Installing dependencies...
echo This may take a few minutes...
echo.

REM Run npm install
"%NPM_PATH%" install

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Dependencies installed successfully!
    echo ========================================
    echo.
    
    if exist "node_modules" (
        echo Created node_modules directory
    )
    
    echo Next steps:
    echo 1. Build the project: npm run build
    echo 2. Start the server: npm start
    echo 3. Or use: start-mcp-server.bat
    echo.
) else (
    echo.
    echo ========================================
    echo Installation failed!
    echo ========================================
    echo.
    echo Troubleshooting tips:
    echo 1. Run as Administrator
    echo 2. Check internet connection
    echo 3. Clear npm cache: npm cache clean --force
    echo.
)

pause
