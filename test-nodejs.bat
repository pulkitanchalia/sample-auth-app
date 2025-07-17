@echo off
echo Testing Node.js installation...
echo.

echo Checking if Node.js directory exists:
if exist "C:\Program Files\nodejs" (
    echo ✅ Directory exists: C:\Program Files\nodejs
    echo.
    echo Contents:
    dir "C:\Program Files\nodejs"
) else (
    echo ❌ Directory not found: C:\Program Files\nodejs
)

echo.
echo Testing Node.js executable:
if exist "C:\Program Files\nodejs\node.exe" (
    echo ✅ node.exe found
    "C:\Program Files\nodejs\node.exe" --version
) else (
    echo ❌ node.exe not found
)

echo.
echo Testing NPM:
if exist "C:\Program Files\nodejs\npm.cmd" (
    echo ✅ npm.cmd found
) else (
    echo ❌ npm.cmd not found
)

echo.
echo Adding to PATH and testing:
set "PATH=C:\Program Files\nodejs;%PATH%"
node --version 2>nul
if %errorlevel% equ 0 (
    echo ✅ Node.js works with PATH
) else (
    echo ❌ Node.js doesn't work even with PATH
)

echo.
pause
