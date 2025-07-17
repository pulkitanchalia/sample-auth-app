@echo off
echo ========================================
echo MCP Server Setup and Run
echo ========================================
echo.

REM Add Node.js to PATH for this session
set "PATH=C:\Program Files\nodejs;%PATH%"

REM Check if Node.js is installed
set "NODE_PATH=C:\Program Files\nodejs\node.exe"
set "NPM_PATH=C:\Program Files\nodejs\npm.cmd"

if exist "%NODE_PATH%" (
    echo Node.js found at: %NODE_PATH%
) else (
    echo Error: Node.js not found at expected location.
    echo Please check if Node.js is installed correctly.
    pause
    exit /b 1
)

echo Node.js version: 
"%NODE_PATH%" --version

echo NPM version: 
"%NPM_PATH%" --version

echo.
echo Navigating to MCP server directory...
cd /d "%~dp0mcp-server"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    "%NPM_PATH%" install
    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies.
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed.
)

echo.
echo Building TypeScript code...
"%NPM_PATH%" run build
if %errorlevel% neq 0 (
    echo Error: Failed to build the project.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Starting MCP Server...
echo ========================================
echo The server will run on stdio.
echo Press Ctrl+C to stop the server.
echo.

"%NPM_PATH%" start
