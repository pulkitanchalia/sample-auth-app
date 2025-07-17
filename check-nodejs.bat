@echo off
echo ========================================
echo Checking Node.js Installation
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is NOT installed
    echo.
    echo To install Node.js:
    echo 1. Visit: https://nodejs.org/
    echo 2. Download the LTS version for Windows
    echo 3. Run the installer
    echo 4. Restart this command prompt
    echo.
    echo After installation, you can run:
    echo - start-mcp-server.bat to setup and start the MCP server
    echo - test-api-and-mcp.ps1 to test the complete system
    echo.
) else (
    echo ✅ Node.js is installed
    node --version
    
    REM Check if npm is available
    npm --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ npm is NOT available
    ) else (
        echo ✅ npm is available
        npm --version
    )
    
    echo.
    echo You can now run:
    echo - start-mcp-server.bat to setup and start the MCP server
    echo - test-api-and-mcp.ps1 to test the complete system
    echo.
)

echo ========================================
pause
