@echo off
REM Smart Solar Charging Station - Windows Startup Script
REM This script starts all required services: Backend (Node.js), Frontend (React), and Relay Server (PHP)

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ============================================================
echo   Smart Solar Charging Station - System Startup
echo ============================================================
echo.

REM Check if Node.js is installed
echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo [OK] Node.js is installed
node --version

REM Check if PHP is installed
echo.
echo [2/3] Checking PHP installation...
php --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo WARNING: PHP is not installed or not in PATH
    echo Relay server will not start
    echo.
) else (
    echo [OK] PHP is installed
    php --version | findstr /R "^PHP"
)

REM Install/Update backend npm packages
echo.
echo [3/3] Installing backend dependencies...
cd backend
if not exist "node_modules" (
    echo Installing npm packages for backend...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed
)
cd ..

REM Install/Update frontend npm packages
echo.
echo Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    echo Installing npm packages for frontend...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed
)
cd ..

REM Start services
echo.
echo ============================================================
echo   Starting Services...
echo ============================================================
echo.

echo Starting Relay Server (PHP) on port 8000...
start "Relay Server" cmd /k "cd Connector\relay_server && php -S 127.0.0.1:8000"
timeout /t 2 /nobreak

echo Starting Backend API (Node.js) on port 5000...
start "Backend API" cmd /k "cd backend && npm start"
timeout /t 2 /nobreak

echo Starting Frontend Dashboard (React) on port 5173...
start "Frontend Dashboard" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak

echo.
echo ============================================================
echo   All Services Started Successfully!
echo ============================================================
echo.
echo Access the system:
echo   - Frontend Dashboard: http://localhost:5173
echo   - Backend API: http://localhost:5000
echo   - Relay Server: http://localhost:8000
echo.
echo Each service is running in its own window.
echo Close any window to stop that service.
echo.
timeout /t 10 /nobreak

endlocal
