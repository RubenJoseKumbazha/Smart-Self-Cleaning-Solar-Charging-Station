# Windows Installation & Startup Guide

## Quick Start for Windows Users

### Option 1: Automatic Setup (Easiest)

1. **Download the project** to your Windows computer
2. **Right-click `setup.bat`** and select **"Run as administrator"**
3. Wait for the script to:
   - Check for Node.js and PHP
   - Download missing software automatically
   - Install npm dependencies
4. Once complete, **double-click `start.bat`** to launch all services
5. Open browser to: **http://localhost:5173**

### Option 2: Professional Installer (Recommended for Distribution)

This creates a professional .exe installer that users can double-click to install:

#### Step 1: Install NSIS

- Download **NSIS** from: https://nsis.sourceforge.io/Download
- Install with default settings
- Restart your computer

#### Step 2: Build the Installer

1. Open **File Explorer**
2. Navigate to the project folder
3. Right-click **`installer.nsi`**
4. Select **"Compile NSIS Script"**
5. Wait for compilation to complete
6. A file **`SmartSolarStation-Setup.exe`** will be created

#### Step 3: Distribute the Installer

Users can now:
- Double-click `SmartSolarStation-Setup.exe`
- Follow the installer wizard
- Select components to install
- Click "Install"
- System automatically configures and downloads required software

### Option 3: Manual Setup

If automatic setup fails:

1. **Install Node.js** from https://nodejs.org/ (LTS version)
2. **Install PHP** from https://windows.php.net/download/
3. **Open Command Prompt** in the project folder
4. Run these commands:
   ```cmd
   cd backend
   npm install
   cd ..\frontend
   npm install
   cd ..
   ```
5. **Double-click `start.bat`**

---

## Files Overview

| File | Purpose | Usage |
|------|---------|-------|
| `setup.bat` | Automatic setup script | Run once to install everything |
| `start.bat` | Start all services | Run after setup to start system |
| `installer.nsi` | Professional Windows installer source | Build with NSIS to create .exe |
| `SmartSolarStation-Setup.exe` | Ready-to-distribute installer | Users run this to install |

---

## Starting the Application

### After Initial Setup

**Simply double-click: `start.bat`**

This will:
- Start Backend API (Node.js) on port 5000
- Start Frontend Dashboard (React) on port 5173
- Start Relay Server (PHP) on port 8000
- Open each service in its own Command Prompt window

### Access Points

Once started, open your browser to:

| Service | URL |
|---------|-----|
| **Frontend Dashboard** | http://localhost:5173 |
| **Backend API** | http://localhost:5000/api |
| **Relay Server** | http://localhost:8000 |

### Stopping Services

To stop the application:
- Simply **close the Command Prompt windows** for each service
- Or press **Ctrl+C** in any window

---

## System Requirements

### Minimum
- **Windows 7 or newer** (32-bit or 64-bit)
- **2 GB RAM**
- **500 MB free disk space**
- **Internet connection** (for initial setup)

### Recommended
- **Windows 10 or newer** (64-bit)
- **4+ GB RAM**
- **1 GB free disk space**
- **High-speed Internet connection**

---

## Troubleshooting

### "Node.js is not installed or not in PATH"

**Solution 1:** Install Node.js manually
1. Download from https://nodejs.org/
2. Install with default settings
3. Restart Command Prompt
4. Try again

**Solution 2:** Add Node.js to PATH manually
1. Open **System Properties** (Win+Pause/Break)
2. Click **"Environment Variables"**
3. Look for `C:\Program Files\nodejs` in PATH
4. If missing, add it and restart

### "PHP not found" warning

**Solution:**
- Relay server won't work without PHP
- Download from: https://windows.php.net/download/
- Extract to `C:\Program Files\PHP`
- Add to PATH via System Properties
- Restart Command Prompt

### "npm install" fails

**Solution 1:** Clear npm cache
```cmd
npm cache clean --force
npm install
```

**Solution 2:** Use legacy peer deps flag
```cmd
npm install --legacy-peer-deps
```

**Solution 3:** Delete node_modules and try again
```cmd
rmdir node_modules /s /q
npm install
```

### Ports already in use

If you get **"EADDRINUSE"** errors:

**Port 5000 (Backend) in use:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Port 5173 (Frontend) in use:**
```cmd
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Port 8000 (Relay) in use:**
```cmd
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Frontend not loading

**Solution 1:** Clear browser cache
- Press **Ctrl+Shift+Del** in browser
- Clear all browsing data
- Refresh page

**Solution 2:** Try different port
Edit `frontend/vite.config.js`:
```javascript
export default {
  server: {
    port: 5174  // Change from 5173
  }
}
```

### Cannot connect to API

**Solution 1:** Check backend is running
- Look for Command Prompt window titled "Backend API"
- Should show "Server running on port 5000"

**Solution 2:** Check firewall
- Windows Firewall might block ports
- Open Windows Firewall settings
- Allow Node.js through firewall

### "Access Denied" when running setup.bat

**Solution:**
- Right-click `setup.bat`
- Select **"Run as administrator"**
- Click "Yes" when prompted

---

## Building the Professional Installer

### Prerequisites
- NSIS installed (https://nsis.sourceforge.io/)
- Project files in a single folder
- All dependencies available

### Step-by-Step

1. **Open NSIS MakeLevelWriter GUI**
   - Windows Start Menu → NSIS → MakeLevelWriter

2. **Select `installer.nsi`**
   - File → Open → Choose installer.nsi

3. **Click "Compile"**
   - Script → Compile

4. **Wait for completion**
   - Output: "SmartSolarStation-Setup.exe"

5. **Test the installer**
   - Run SmartSolarStation-Setup.exe
   - Go through wizard
   - Verify application starts

### Customizing the Installer

Edit `installer.nsi` to change:

**Logo/Icon (line ~130):**
```nsi
DisplayIcon "$INSTDIR\frontend\public\favicon.ico"
```

**Installation Path (line ~13):**
```nsi
!define INSTALLDIR "$PROGRAMFILES\SmartSolarStation"
```

**Shortcuts (line ~180):**
```nsi
CreateShortCut "$SMPROGRAMS\Smart Solar Charging Station\Start Application.lnk" ...
```

**Node.js Version (line ~16):**
```nsi
!define NODEJS_URL "https://nodejs.org/dist/v20.9.0/node-v20.9.0-x64.msi"
```

---

## Creating Shortcuts Manually

If you want to create your own shortcuts without the installer:

### Start Application Shortcut

1. Right-click on Desktop
2. Select "New" → "Shortcut"
3. Enter target: `C:\path\to\project\start.bat`
4. Name it: "Start Solar Station"
5. Click "Finish"

### Open Dashboard Shortcut

1. Right-click on Desktop
2. Select "New" → "Shortcut"
3. Enter target: `http://localhost:5173`
4. Name it: "Solar Station Dashboard"
5. Click "Finish"

---

## Command Line Usage

For advanced users, you can start services individually:

### Backend only
```cmd
cd backend
npm start
```

### Frontend only
```cmd
cd frontend
npm run dev
```

### Relay server only
```cmd
cd Connector\relay_server
php -S 127.0.0.1:8000
```

---

## Production Deployment on Windows

For production Windows servers:

1. **Install on Windows Server**
   - Run setup.bat as Administrator
   - Verify all services start correctly

2. **Create Windows Service** (optional)
   - Use NSSM: https://nssm.cc/download
   - Allows services to auto-start on boot

3. **Set up Firewall Rules**
   - Allow ports 5000, 5173, 8000 through Windows Firewall
   - Or restrict to local network only

4. **Enable HTTPS** (optional)
   - Use Cloudflare Tunnel for public access
   - See COMPLETE_INTEGRATION.md for details

---

## Uninstalling

### If using NSIS installer
- Go to: **Control Panel** → **Programs** → **Programs and Features**
- Find "Smart Solar Charging Station"
- Click "Uninstall"

### If using setup.bat
- Manually delete the project folder
- Delete shortcuts from Start Menu and Desktop

---

## Support & Documentation

For more details, see:
- **COMPLETE_INTEGRATION.md** - Full API documentation
- **README.md** - Project overview
- **ESP32_INTEGRATION.md** - Hardware integration guide

---

## Windows Batch File (.bat) Reference

For Windows users unfamiliar with batch files:

| Command | Purpose |
|---------|---------|
| `@echo off` | Don't display commands |
| `cd folder` | Change directory |
| `npm install` | Install npm packages |
| `npm start` | Start Node.js server |
| `start "Title" cmd.exe /k` | Open new window with command |
| `timeout /t 5` | Wait 5 seconds |
| `pause` | Wait for user to press key |

### Create your own batch file

1. Open Notepad
2. Enter commands (one per line)
3. Save as `myfile.bat`
4. Double-click to run

Example:
```batch
@echo off
echo Starting services...
cd backend
npm start
```

---

## Setting up Automatic Startup (Windows)

To auto-start the application when Windows boots:

1. Press **Win+R**
2. Type: `shell:startup`
3. Drag `start.bat` into the folder
4. System will now start services on boot

---

Last Updated: April 2026
Version: 1.0.0
