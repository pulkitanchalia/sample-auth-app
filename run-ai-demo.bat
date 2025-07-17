@echo off
echo ========================================
echo MCP Server AI Integration Demo
echo ========================================
echo.
echo This demo shows how an AI assistant would use the MCP server
echo to interact with your authentication backend.
echo.
echo Prerequisites:
echo 1. FastAPI backend running on http://localhost:8000
echo 2. Node.js and npm installed
echo 3. MCP server dependencies installed
echo.

REM Check if backend is running
echo Checking if backend is running...
curl -s http://localhost:8000/ >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend is not running on http://localhost:8000
    echo Please start the backend first using start-backend.bat
    echo.
    pause
    exit /b 1
)

echo ✅ Backend is running
echo.

REM Navigate to MCP server directory
cd /d "%~dp0mcp-server"

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Build the project
echo Building MCP server...
npm run build

echo.
echo ========================================
echo Starting AI Integration Demo...
echo ========================================
echo.

REM Run the demo
npm run demo

echo.
echo Demo completed!
pause
