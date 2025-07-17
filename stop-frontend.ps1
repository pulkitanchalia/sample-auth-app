# Stop Frontend Server Script
# PowerShell version

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Stop Frontend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking for running Angular frontend processes..." -ForegroundColor Yellow

# Check if port 4200 is in use
$port4200 = Get-NetTCPConnection -LocalPort 4200 -ErrorAction SilentlyContinue
if ($port4200) {
    Write-Host "Found process using port 4200:" -ForegroundColor Red
    $port4200 | Format-Table LocalAddress, LocalPort, State, OwningProcess
    
    foreach ($connection in $port4200) {
        $processId = $connection.OwningProcess
        Write-Host "Stopping process with PID: $processId" -ForegroundColor Yellow
        try {
            Stop-Process -Id $processId -Force
            Write-Host "✅ Successfully stopped frontend server (PID: $processId)" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to stop process $processId : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "ℹ️  No process found using port 4200" -ForegroundColor Blue
}

Write-Host ""
Write-Host "Checking for Node.js processes (ng serve, npm start, etc.)..." -ForegroundColor Yellow

# Get all Node.js processes
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Found Node.js processes:" -ForegroundColor Yellow
    
    foreach ($process in $nodeProcesses) {
        try {
            $commandLine = (Get-WmiObject Win32_Process -Filter "ProcessId = $($process.Id)").CommandLine
            if ($commandLine -match "ng serve|angular|4200") {
                Write-Host "Stopping Angular process: PID $($process.Id)" -ForegroundColor Red
                Write-Host "Command: $commandLine" -ForegroundColor Gray
                Stop-Process -Id $process.Id -Force
                Write-Host "✅ Stopped Angular process (PID: $($process.Id))" -ForegroundColor Green
            }
        } catch {
            Write-Host "❌ Error checking process $($process.Id): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "ℹ️  No Node.js processes found" -ForegroundColor Blue
}

Write-Host ""
Write-Host "Checking frontend directory..." -ForegroundColor Yellow

# Navigate to frontend directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $scriptDir "frontend\auth-app"

if (Test-Path $frontendDir) {
    Write-Host "Found frontend directory: $frontendDir" -ForegroundColor Green
    Set-Location $frontendDir
    
    # Try to run npm stop if available
    if (Test-Path "package.json") {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        if ($packageJson.scripts.stop) {
            Write-Host "Running npm stop..." -ForegroundColor Yellow
            npm run stop
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Stopped via npm run stop" -ForegroundColor Green
            }
        } else {
            Write-Host "ℹ️  No npm stop script available" -ForegroundColor Blue
        }
    }
} else {
    Write-Host "ℹ️  Frontend directory not found" -ForegroundColor Blue
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Manual Stop Options:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If frontend is still running, you can stop it manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. In the terminal where 'ng serve' is running:" -ForegroundColor White
Write-Host "   Press Ctrl+C" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Kill all Node.js processes:" -ForegroundColor White
Write-Host "   Get-Process -Name 'node' | Stop-Process -Force" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Kill process using port 4200:" -ForegroundColor White
Write-Host "   Get-NetTCPConnection -LocalPort 4200 | ForEach { Stop-Process -Id `$_.OwningProcess -Force }" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Use VS Code terminal:" -ForegroundColor White
Write-Host "   Click the trash icon in the terminal tab" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Current Port Status:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$currentPort4200 = Get-NetTCPConnection -LocalPort 4200 -ErrorAction SilentlyContinue
if ($currentPort4200) {
    Write-Host "⚠️  Port 4200 is still in use:" -ForegroundColor Red
    $currentPort4200 | Format-Table LocalAddress, LocalPort, State, OwningProcess
} else {
    Write-Host "✅ Port 4200 is now free" -ForegroundColor Green
}

Write-Host ""
Read-Host "Press Enter to exit"
