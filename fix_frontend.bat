@echo off
echo 🎨 Frontend Setup Script - Fixing Angular Application
echo.

cd /d "%~dp0"
cd frontend\auth-app

echo 📍 Current directory: %CD%
echo.

echo 📦 Installing Angular dependencies...
call npm install

echo.
echo 🔧 Installing additional packages that might be missing...
call npm install @angular/platform-browser-dynamic
call npm install tslib
call npm install @types/node

echo.
echo 🚀 Attempting to start the development server...
echo 🌐 Angular app will be available at: http://localhost:4200
echo ⏹️ Press Ctrl+C to stop the server
echo.

call npm start
