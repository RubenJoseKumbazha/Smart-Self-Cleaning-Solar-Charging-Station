@echo off
REM Smart Solar Charging Station - Automated Setup Script for Windows
REM This script checks for required software and installs them automatically
REM Run as Administrator for best results

setlocal enabledelayedexpansion
color 0A
title Smart Solar Charging Station - Setup

cd /d "%~dp0"

echo.
echo   ========================================================
echo       Smart Solar Charging Station - Windows Setup
echo   ========================================================
echo.

REM Check for Administrator privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo WARNING: This script should ideally run as Administrator
    echo for automatic software installation.
    echo.
    echo Continuing without admin privileges...
    timeout /t 3 /nobreak
)

REM Detect Windows version and architecture
for /f "tokens=1,2 delims=." %%A in ('ver') do set OS_VERSION=%%A
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    set ARCH=x64
) else (
    set ARCH=x86
)

echo Detected: Windows (arch: %ARCH%)
echo.

REM Check Node.js installation
echo [STEP 1/4] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js is installed
    node --version
) else (
    echo [INSTALL] Node.js not found
    echo.
    echo Downloading Node.js v20.9.0...
    
    if "%ARCH%"=="x64" (
        powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.9.0/node-v20.9.0-x64.msi' -OutFile '%TEMP%\nodejs.msi'" 2>nul
    ) else (
        powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.9.0/node-v20.9.0-x86.msi' -OutFile '%TEMP%\nodejs.msi'" 2>nul
    )
    
    if exist "%TEMP%\nodejs.msi" (
        echo [INSTALL] Installing Node.js...
        msiexec /i "%TEMP%\nodejs.msi" /quiet /norestart
        timeout /t 3 /nobreak
        del "%TEMP%\nodejs.msi"
        
        REM Add Node.js to PATH
        set PATH=%PATH%;C:\Program Files\nodejs
    ) else (
        echo [ERROR] Could not download Node.js
        echo Please install manually from: https://nodejs.org/
        goto ERROR_EXIT
    )
)

echo.
echo [STEP 2/4] Checking PHP...
php --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] PHP is installed
    php --version | findstr /R "^PHP"
) else (
    echo [INSTALL] PHP not found
    echo.
    echo Downloading PHP 8.2.12 (NTS)...
    
    powershell -Command "Invoke-WebRequest -Uri 'https://windows.php.net/downloads/releases/php-8.2.12-nts-Win32-x64.zip' -OutFile '%TEMP%\php.zip' -ErrorAction SilentlyContinue" 2>nul
    
    if exist "%TEMP%\php.zip" (
        echo [INSTALL] Extracting PHP...
        md "%PROGRAMFILES%\PHP" 2>nul
        powershell -Command "Expand-Archive -Path '%TEMP%\php.zip' -DestinationPath '%PROGRAMFILES%\PHP' -Force" 2>nul
        del "%TEMP%\php.zip"
        
        REM Add PHP to PATH
        setx PATH "%PATH%;%PROGRAMFILES%\PHP"
    ) else (
        echo [WARNING] Could not download PHP
        echo Relay server will not work without PHP
        echo Please download from: https://windows.php.net/downloads/releases/
    )
)

echo.
echo [STEP 3/4] Installing Backend Dependencies...
cd backend
if not exist "node_modules" (
    echo Downloading npm packages (this may take a few minutes)...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install backend dependencies
        goto ERROR_EXIT
    )
) else (
    echo [OK] Backend dependencies already installed
)
cd ..

echo.
echo [STEP 4/4] Installing Frontend Dependencies...
cd frontend
if not exist "node_modules" (
    echo Downloading npm packages (this may take a few minutes)...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies
        goto ERROR_EXIT
    )
) else (
    echo [OK] Frontend dependencies already installed
)
cd ..

echo.
echo   ========================================================
echo       Setup Complete! System Ready to Start
echo   ========================================================
echo.
echo Option 1: Double-click start.bat to launch the application
echo Option 2: Run: start.bat
echo Option 3: Use the "Start Solar Station" desktop shortcut
echo.
echo The application will open on:
echo   - Frontend: http://localhost:5173
echo   - Backend API: http://localhost:5000
echo   - Relay Server: http://localhost:8000
echo.

goto SETUP_COMPLETE

:ERROR_EXIT
echo.
echo Setup failed. Please check the error messages above.
pause
exit /b 1

:SETUP_COMPLETE
echo.
timeout /t 5 /nobreak
exit /b 0
