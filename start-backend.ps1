# Start Backend PowerShell Script
Write-Host "Starting FastAPI Backend..." -ForegroundColor Green

Set-Location backend

if (!(Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host "Starting FastAPI server..." -ForegroundColor Green
python main.py
