@echo off
echo 🔧 Backend Fix Script - Installing Missing Dependencies
echo.

cd /d "%~dp0"

echo 📍 Current directory: %CD%
echo.

echo 🐍 Activating virtual environment...
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    echo ✅ Virtual environment activated
) else (
    echo ❌ Virtual environment not found, creating one...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo ✅ Virtual environment created and activated
)
echo.

echo 📦 Installing/updating packages...
pip install --upgrade pip
pip install bcrypt
pip install -r requirements.txt
echo ✅ Packages installed
echo.

echo 🧪 Testing password hashing...
python -c "from auth import get_password_hash; print('✅ Password hashing works:', get_password_hash('test')[:20] + '...')" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Password hashing test passed
) else (
    echo ❌ Password hashing test failed
    echo Installing bcrypt again...
    pip install --force-reinstall bcrypt
)
echo.

echo 🗄️ Initializing database...
python -c "from database import create_tables; create_tables(); print('✅ Database initialized')" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Database initialization successful
) else (
    echo ❌ Database initialization failed
)
echo.

echo 🎉 Setup complete! You can now start the server with:
echo    python start_server.py
echo.
echo Or manually with:
echo    python main.py
echo.
pause
