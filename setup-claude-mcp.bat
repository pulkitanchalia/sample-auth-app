@echo off
echo ========================================
echo Claude Desktop MCP Configuration Setup
echo ========================================
echo.

REM Check if Claude Desktop config directory exists
set "CLAUDE_CONFIG_DIR=%APPDATA%\Claude"

if not exist "%CLAUDE_CONFIG_DIR%" (
    echo Creating Claude Desktop config directory...
    mkdir "%CLAUDE_CONFIG_DIR%"
    if %errorlevel% neq 0 (
        echo Error: Failed to create directory %CLAUDE_CONFIG_DIR%
        pause
        exit /b 1
    )
)

echo Claude config directory: %CLAUDE_CONFIG_DIR%

REM Check if our config file exists
set "SOURCE_CONFIG=%~dp0claude_desktop_config.json"
if not exist "%SOURCE_CONFIG%" (
    echo Error: Source config file not found at %SOURCE_CONFIG%
    pause
    exit /b 1
)

echo Source config file: %SOURCE_CONFIG%

REM Backup existing config if it exists
set "TARGET_CONFIG=%CLAUDE_CONFIG_DIR%\claude_desktop_config.json"
if exist "%TARGET_CONFIG%" (
    echo Backing up existing config...
    copy "%TARGET_CONFIG%" "%TARGET_CONFIG%.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%" >nul 2>&1
    echo ✅ Backup created
)

REM Copy our config to Claude Desktop
echo Copying MCP server configuration...
copy "%SOURCE_CONFIG%" "%TARGET_CONFIG%" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Configuration copied successfully!
) else (
    echo ❌ Failed to copy configuration
    pause
    exit /b 1
)

echo.
echo Configuration installed at: %TARGET_CONFIG%
echo.
echo Next steps:
echo 1. Make sure your FastAPI backend is running on http://localhost:8000
echo 2. Make sure MCP server is built: npm run build (in mcp-server directory)
echo 3. Restart Claude Desktop completely
echo 4. Test by asking Claude: "Can you check if the authentication system is working?"
echo.
echo Available MCP tools for Claude:
echo - auth_health_check: Check system status
echo - auth_signup: Register new users  
echo - auth_login: User authentication
echo - auth_get_current_user: Get user information
echo - auth_logout: End user sessions
echo.

pause
