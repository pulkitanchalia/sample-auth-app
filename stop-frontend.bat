@echo off
echo ========================================
echo Stop Frontend Server
echo ========================================
echo.

echo Checking for running Angular frontend processes...

REM Check if port 4200 is in use
netstat -ano | findstr :4200 >nul 2>&1
if %errorlevel% equ 0 (
    echo Found process using port 4200:
    netstat -ano | findstr :4200
    
    REM Get the PID using port 4200
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4200') do (
        echo Killing process with PID: %%a
        taskkill /PID %%a /F >nul 2>&1
        if %errorlevel% equ 0 (
            echo ✅ Successfully stopped frontend server on port 4200
        ) else (
            echo ❌ Failed to stop process %%a
        )
    )
) else (
    echo ℹ️  No process found using port 4200
)

echo.
echo Checking for Node.js processes (ng serve, npm start, etc.)...

REM Kill any ng serve processes
tasklist | findstr "node.exe" >nul 2>&1
if %errorlevel% equ 0 (
    echo Found Node.js processes:
    tasklist | findstr "node.exe"
    
    echo.
    echo Checking for Angular CLI processes...
    wmic process where "name='node.exe'" get commandline,processid | findstr "ng serve\|angular" >nul 2>&1
    if %errorlevel% equ 0 (
        echo Stopping Angular CLI processes...
        for /f "tokens=2" %%a in ('wmic process where "name='node.exe'" get processid ^| findstr /r "^[0-9]"') do (
            wmic process where "processid=%%a" get commandline | findstr "ng serve\|angular" >nul 2>&1
            if !errorlevel! equ 0 (
                echo Killing Angular process PID: %%a
                taskkill /PID %%a /F >nul 2>&1
            )
        )
    ) else (
        echo ℹ️  No Angular CLI processes found
    )
) else (
    echo ℹ️  No Node.js processes found
)

echo.
echo Checking for any npm processes in frontend directory...
cd /d "%~dp0frontend\auth-app" >nul 2>&1
if exist "package.json" (
    echo Found frontend directory: %cd%
    
    REM Try to stop any npm processes
    npm run stop >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Stopped via npm run stop
    ) else (
        echo ℹ️  No npm stop script available
    )
) else (
    echo ℹ️  Frontend directory not found or no package.json
)

echo.
echo ========================================
echo Manual Stop Options:
echo ========================================
echo.
echo If frontend is still running, you can stop it manually:
echo.
echo 1. In the terminal where 'ng serve' is running:
echo    Press Ctrl+C
echo.
echo 2. Kill all Node.js processes:
echo    taskkill /F /IM node.exe
echo.
echo 3. Kill process using port 4200:
echo    netstat -ano ^| findstr :4200
echo    taskkill /F /PID [PID_NUMBER]
echo.
echo 4. Use VS Code terminal:
echo    Click the trash icon in the terminal tab
echo.
echo ========================================
echo Current Port Status:
echo ========================================
netstat -ano | findstr :4200
if %errorlevel% neq 0 (
    echo ✅ Port 4200 is now free
) else (
    echo ⚠️  Port 4200 is still in use
)

echo.
pause
