# Start Frontend PowerShell Script
Write-Host "Starting Angular Frontend..." -ForegroundColor Green

Set-Location "frontend\auth-app"

if (!(Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting Angular development server..." -ForegroundColor Green
npm start
