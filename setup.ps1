# Smart Solar Charging Station - Windows Setup (PowerShell)
# Run as Administrator in PowerShell
# Usage: powershell -ExecutionPolicy Bypass -File setup.ps1

param(
    [switch]$SkipNodeJS,
    [switch]$SkipPHP,
    [switch]$SkipDependencies,
    [switch]$Silent
)

# Requires elevation
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "This script requires Administrator privileges. Restarting..." -ForegroundColor Red
    Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit 1
}

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Smart Solar Charging Station - Windows Setup" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# ==================== FUNCTIONS ====================

function Test-CommandExists {
    param($command)
    
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

function Download-File {
    param($URL, $OutputPath)
    
    try {
        Write-Host "Downloading $([System.IO.Path]::GetFileName($OutputPath))..." -ForegroundColor Yellow
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $URL -OutFile $OutputPath -UseBasicParsing -ErrorAction Stop
        $ProgressPreference = 'Continue'
        
        return $true
    } catch {
        Write-Host "Failed to download: $_" -ForegroundColor Red
        return $false
    }
}

function Install-Software {
    param($Name, $InstallerPath, $Arguments)
    
    try {
        Write-Host "Installing $Name..." -ForegroundColor Yellow
        $process = Start-Process -FilePath $InstallerPath -ArgumentList $Arguments -Wait -PassThru
        if ($process.ExitCode -eq 0) {
            Write-Host "[OK] $Name installed successfully" -ForegroundColor Green
            return $true
        } else {
            Write-Host "[ERROR] Installation failed with code $($process.ExitCode)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "Installation error: $_" -ForegroundColor Red
        return $false
    }
}

function Extract-Archive-Safe {
    param($SourcePath, $DestinationPath)
    
    try {
        if (-not (Test-Path $DestinationPath)) {
            New-Item -ItemType Directory -Path $DestinationPath | Out-Null
        }
        
        Write-Host "Extracting to $DestinationPath..." -ForegroundColor Yellow
        Expand-Archive -Path $SourcePath -DestinationPath $DestinationPath -Force
        return $true
    } catch {
        Write-Host "Extraction error: $_" -ForegroundColor Red
        return $false
    }
}

function Install-NPMDependencies {
    param($ProjectPath, $ProjectName)
    
    try {
        Write-Host ""
        Write-Host "Installing npm dependencies for $ProjectName..." -ForegroundColor Yellow
        
        Push-Location $ProjectPath
        
        if (Test-Path "node_modules") {
            Write-Host "[OK] Dependencies already installed for $ProjectName" -ForegroundColor Green
        } else {
            Write-Host "This may take a few minutes..." -ForegroundColor Gray
            & npm install --legacy-peer-deps
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[OK] $ProjectName dependencies installed" -ForegroundColor Green
            } else {
                Write-Host "[ERROR] Failed to install $ProjectName dependencies" -ForegroundColor Red
                Pop-Location
                return $false
            }
        }
        
        Pop-Location
        return $true
    } catch {
        Write-Host "Installation error: $_" -ForegroundColor Red
        return $false
    }
}

function Add-ToSystemPath {
    param($PathToAdd)
    
    try {
        $currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
        
        if ($currentPath -notlike "*$PathToAdd*") {
            Write-Host "Adding to system PATH: $PathToAdd" -ForegroundColor Yellow
            $newPath = "$currentPath;$PathToAdd"
            [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
            Write-Host "[OK] PATH updated" -ForegroundColor Green
        }
    } catch {
        Write-Host "Failed to update PATH: $_" -ForegroundColor Red
    }
}

# ==================== MAIN SETUP ====================

# Step 1: Check Node.js
Write-Host ""
Write-Host "[STEP 1/4] Checking Node.js..." -ForegroundColor Cyan

if (Test-CommandExists node) {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js is installed: $nodeVersion" -ForegroundColor Green
} else {
    if (-not $SkipNodeJS) {
        Write-Host "[INSTALL] Node.js not found" -ForegroundColor Yellow
        
        $osArch = if ([System.Environment]::Is64BitOperatingSystem) { "x64" } else { "x86" }
        $nodeUrl = "https://nodejs.org/dist/v20.9.0/node-v20.9.0-$osArch.msi"
        $nodePath = "$env:TEMP\nodejs.msi"
        
        if (Download-File -URL $nodeUrl -OutputPath $nodePath) {
            Install-Software -Name "Node.js" -InstallerPath $nodePath -Arguments "/quiet"
            Remove-Item $nodePath -Force -ErrorAction SilentlyContinue
            
            # Refresh PATH
            $env:Path = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
        }
    } else {
        Write-Host "[SKIPPED] Node.js installation skipped" -ForegroundColor Yellow
    }
}

# Step 2: Check PHP
Write-Host ""
Write-Host "[STEP 2/4] Checking PHP..." -ForegroundColor Cyan

if (Test-CommandExists php) {
    $phpVersion = php --version | Select-Object -First 1
    Write-Host "[OK] PHP is installed: $phpVersion" -ForegroundColor Green
} else {
    if (-not $SkipPHP) {
        Write-Host "[INSTALL] PHP not found (optional for Relay Server)" -ForegroundColor Yellow
        
        $phpUrl = "https://windows.php.net/downloads/releases/php-8.2.12-nts-Win32-x64.zip"
        $phpPath = "$env:TEMP\php.zip"
        $phpDir = "C:\Program Files\PHP"
        
        if (Download-File -URL $phpUrl -OutputPath $phpPath) {
            if (Extract-Archive-Safe -SourcePath $phpPath -DestinationPath $phpDir) {
                Add-ToSystemPath -PathToAdd $phpDir
                Remove-Item $phpPath -Force -ErrorAction SilentlyContinue
                
                # Refresh PATH
                $env:Path = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
            }
        }
    } else {
        Write-Host "[SKIPPED] PHP installation skipped" -ForegroundColor Yellow
    }
}

# Step 3: Install Backend Dependencies
Write-Host ""
Write-Host "[STEP 3/4] Backend Dependencies..." -ForegroundColor Cyan

if (-not $SkipDependencies) {
    Install-NPMDependencies -ProjectPath "backend" -ProjectName "Backend" | Out-Null
} else {
    Write-Host "[SKIPPED] Dependency installation skipped" -ForegroundColor Yellow
}

# Step 4: Install Frontend Dependencies
Write-Host ""
Write-Host "[STEP 4/4] Frontend Dependencies..." -ForegroundColor Cyan

if (-not $SkipDependencies) {
    Install-NPMDependencies -ProjectPath "frontend" -ProjectName "Frontend" | Out-Null
} else {
    Write-Host "[SKIPPED] Dependency installation skipped" -ForegroundColor Yellow
}

# ==================== COMPLETION ====================

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete! System Ready to Start" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Double-click: start.bat" -ForegroundColor Gray
Write-Host "2. Or run: powershell -File start.ps1" -ForegroundColor Gray
Write-Host "3. Open browser to: http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "Services will run on:" -ForegroundColor Yellow
Write-Host "  - Frontend Dashboard: http://localhost:5173" -ForegroundColor Gray
Write-Host "  - Backend API: http://localhost:5000" -ForegroundColor Gray
Write-Host "  - Relay Server: http://localhost:8000" -ForegroundColor Gray
Write-Host ""

if (-not $Silent) {
    Write-Host "Press any key to continue..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

exit 0
