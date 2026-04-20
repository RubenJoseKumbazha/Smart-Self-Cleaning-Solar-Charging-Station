# Smart Solar Charging Station - StartupScript (PowerShell)
# Usage: powershell -File start.ps1

$ErrorActionPreference = "Continue"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Smart Solar Charging Station - System Startup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "[1/3] Checking Node.js..." -ForegroundColor Yellow
$nodeExists = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
if (-not $nodeExists) {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install from: https://nodejs.org/" -ForegroundColor Gray
    exit 1
}
$nodeVersion = node --version
Write-Host "[OK] Node.js is installed: $nodeVersion" -ForegroundColor Green

# Check PHP
Write-Host ""
Write-Host "[2/3] Checking PHP..." -ForegroundColor Yellow
$phpExists = $null -ne (Get-Command php -ErrorAction SilentlyContinue)
if ($phpExists) {
    $phpVersion = php --version | Select-Object -First 1
    Write-Host "[OK] PHP is installed" -ForegroundColor Green
} else {
    Write-Host "[WARNING] PHP not found - Relay server will not start" -ForegroundColor Yellow
}

# Check dependencies
Write-Host ""
Write-Host "[3/3] Checking npm dependencies..." -ForegroundColor Yellow

$backendNodeModules = Test-Path "backend\node_modules"
$frontendNodeModules = Test-Path "frontend\node_modules"

if (-not $backendNodeModules -or -not $frontendNodeModules) {
    Write-Host "Installing missing dependencies..." -ForegroundColor Yellow
    
    if (-not $backendNodeModules) {
        Write-Host "Installing backend dependencies..." -ForegroundColor Gray
        Push-Location backend
        npm install --legacy-peer-deps
        Pop-Location
    }
    
    if (-not $frontendNodeModules) {
        Write-Host "Installing frontend dependencies..." -ForegroundColor Gray
        Push-Location frontend
        npm install --legacy-peer-deps
        Pop-Location
    }
} else {
    Write-Host "[OK] All dependencies installed" -ForegroundColor Green
}

# Start services
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Starting Services..." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Create temp directory for logs if needed
$logsDir = "logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir | Out-Null
}

# Start Relay Server (PHP)
if ($phpExists) {
    Write-Host "Starting Relay Server (PHP) on port 8000..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList {
        Set-Location "$using:scriptPath\Connector\relay_server"
        Write-Host "[RELAY SERVER] Starting..." -ForegroundColor Cyan
        php -S 127.0.0.1:8000
    } -WindowStyle Normal
    Start-Sleep -Seconds 2
}

# Start Backend API (Node.js)
Write-Host "Starting Backend API (Node.js) on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList {
    Set-Location "$using:scriptPath\backend"
    Write-Host "[BACKEND API] Starting..." -ForegroundColor Cyan
    npm start
} -WindowStyle Normal
Start-Sleep -Seconds 2

# Start Frontend Dashboard (React)
Write-Host "Starting Frontend Dashboard (React) on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList {
    Set-Location "$using:scriptPath\frontend"
    Write-Host "[FRONTEND] Starting..." -ForegroundColor Cyan
    npm run dev
} -WindowStyle Normal
Start-Sleep -Seconds 3

# Try to open browser
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  All Services Started Successfully!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Access the system:" -ForegroundColor Yellow
Write-Host "  - Frontend Dashboard: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  - Backend API: http://localhost:5000" -ForegroundColor Cyan
if ($phpExists) {
    Write-Host "  - Relay Server: http://localhost:8000" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "Each service is running in its own window." -ForegroundColor Gray
Write-Host "Close any window to stop that service." -ForegroundColor Gray
Write-Host ""

# Try to open dashboard in browser
try {
    Write-Host "Opening dashboard in browser..." -ForegroundColor Yellow
    Start-Process "http://localhost:5173"
} catch {
    Write-Host "Could not automatically open browser" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Press Enter to exit this window..." -ForegroundColor Gray
Read-Host | Out-Null

exit 0
