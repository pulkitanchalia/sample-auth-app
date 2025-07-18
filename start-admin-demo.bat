@echo off
echo Setting up Admin Dashboard Demo...
echo.

echo 1. Starting Backend Server...
cd backend
start cmd /k "python main.py"
timeout /t 3 >nul

echo 2. Starting Frontend (Angular)...
cd ..\frontend\auth-app
start cmd /k "ng serve"

echo.
echo ========================================
echo Admin Dashboard Setup Complete!
echo ========================================
echo.
echo Backend API: http://localhost:8000
echo Frontend: http://localhost:4200
echo.
echo To test admin features:
echo 1. Sign up with username 'admin' 
echo 2. Or use the first user you create (ID = 1)
echo 3. Login and you'll see the Admin Dashboard button
echo.
echo Admin endpoints available:
echo - GET /admin/users (view all users)
echo - GET /admin/stats (user statistics)
echo - PUT /admin/users/{id}/status (activate/deactivate users)
echo - DELETE /admin/users/{id} (delete users)
echo.
pause
