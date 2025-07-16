@echo off
echo 🎨 Starting Angular Frontend...
echo.

REM Add Node.js to PATH for this session
set PATH=%PATH%;C:\Program Files\nodejs

echo 📍 Current directory: %CD%
echo 🔧 Node.js version:
node --version
echo 📦 npm version:
npm --version
echo.

echo 🚀 Starting Angular development server...
echo 🌐 Frontend will be available at: http://localhost:4200
echo ⏹️ Press Ctrl+C to stop the server
echo.

npm.cmd start
