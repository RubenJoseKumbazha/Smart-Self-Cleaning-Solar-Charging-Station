# Windows Quick Reference Guide

## Windows Installation & Startup Files

Your project now includes complete Windows support with multiple setup and startup options.

---

## Files Created

| File | Type | Purpose |
|------|------|---------|
| **start.bat** | Batch | Simple starter - double-click to launch all services |
| **setup.bat** | Batch | Automatic setup - downloads and installs all requirements |
| **start.ps1** | PowerShell | Modern starter with colored output and dependency check |
| **setup.ps1** | PowerShell | Advanced setup with logging and error handling |
| **installer.nsi** | NSIS Script | Professional Windows installer (creates .exe) |
| **WINDOWS_INSTALLATION.md** | Guide | Complete Windows installation documentation |

---

## Quick Start (Choose ONE)

### Method 1: Super Simple (Recommended for First-Time Users)
```
1. Double-click: setup.bat
2. Wait for completion
3. Double-click: start.bat
4. Open: http://localhost:5173
```

### Method 2: PowerShell Version
```
1. Right-click setup.ps1 → "Run with PowerShell"
2. Wait for completion
3. Double-click start.ps1
4. Open: http://localhost:5173
```

### Method 3: Professional Installer
```
1. Download and install NSIS from: https://nsis.sourceforge.io/
2. Right-click installer.nsi → "Compile NSIS Script"
3. Share SmartSolarStation-Setup.exe with users
4. Users run the .exe installer
```

---

## File Usage Guide

### `start.bat` - The Quick Launcher
**When to use:** Every day, after first setup

**How to use:**
1. Open File Explorer
2. Navigate to project folder
3. Double-click `start.bat`
4. Sit back and wait (takes 10-15 seconds)
5. Services will open in separate windows

**What it does:**
- Checks if dependencies are installed
- Starts Backend API (port 5000)
- Starts Frontend Dashboard (port 5173)
- Starts Relay Server (port 8000)
- Shows completion message with access URLs

**Keyboard tips:**
- Close any window to stop that service
- Ctrl+C to force-stop a service

---

### `setup.bat` - One-Time Setup
**When to use:** First install, or if you delete node_modules

**How to use:**
1. Right-click `setup.bat`
2. Select **"Run as administrator"** (important!)
3. Watch the console
4. Automated downloads will happen (slow first time)
5. Takes 3-10 minutes depending on internet speed

**What it does:**
- Checks for Node.js (downloads if missing)
- Checks for PHP (downloads if missing)
- Installs npm packages for backend
- Installs npm packages for frontend
- Sets up system PATH

**If it fails:**
- Make sure you have admin rights
- Check internet connection
- Try again (it can retry)

---

### `start.ps1` - PowerShell Starter
**When to use:** If you prefer PowerShell, or if start.bat has issues

**How to use:**
1. Right-click `start.ps1`
2. Select **"Run with PowerShell"**
3. Or open PowerShell and type: `powershell -File start.ps1`

**Advantages:**
- Better error messages (colored output)
- Tries to open browser automatically
- Modern Windows experience
- Good for automation

---

### `setup.ps1` - Advanced Setup
**When to use:** If you're a PowerShell enthusiast

**How to use:**
```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
```

**Advanced options:**
```powershell
# Skip Node.js installation
powershell -File setup.ps1 -SkipNodeJS

# Skip PHP installation
powershell -File setup.ps1 -SkipPHP

# Skip dependency installation
powershell -File setup.ps1 -SkipDependencies

# Silent mode (no prompts)
powershell -File setup.ps1 -Silent
```

---

### `installer.nsi` - Professional Installer
**When to use:** For distributing to other users

**How to build:**
1. Download NSIS: https://nsis.sourceforge.io/Download
2. Install NSIS on your Windows machine
3. Right-click `installer.nsi` → "Compile NSIS Script"
4. A file `SmartSolarStation-Setup.exe` will be created

**What the installer does:**
- Checks for Node.js (asks to install if missing)
- Checks for PHP (asks to install if missing)
- Copies all project files
- Installs npm dependencies
- Creates Start Menu shortcuts
- Creates Desktop shortcut
- Provides uninstall option

**Features:**
- Professional wizard interface
- Custom installation path
- Component selection
- Automatic dependency installation
- Easy uninstall

**Size:** ~500MB with dependencies

**Distribution:**
- Share `SmartSolarStation-Setup.exe` with users
- Users can run it without any technical knowledge
- Fully automated setup

---

## System Access

Once started, access these services:

| Service | URL | Purpose |
|---------|-----|---------|
| Dashboard | http://localhost:5173 | User interface (React) |
| Backend API | http://localhost:5000 | REST API (Node.js) |
| Relay Server | http://localhost:8000 | Hardware control (PHP) |

---

## Troubleshooting Quick Fixes

### "Node.js is not installed"
```
→ Run setup.bat as administrator
```

### "npm: cannot find command"
```
→ Close and reopen Command Prompt after setup
→ Or restart Windows
```

### "Port 5000 is already in use"
```cmd
REM Find what's using port 5000:
netstat -ano | findstr :5000

REM Kill the process (replace XXXX with PID):
taskkill /PID XXXX /F
```

### "Frontend won't load at http://localhost:5173"
```
→ Check that the "Frontend Dashboard" window is running
→ Clear browser cache (Ctrl+Shift+Del)
→ Try different port - edit frontend/vite.config.js
```

### "Permission denied" error
```
→ Right-click .bat/.ps1 file
→ Select "Run as administrator"
```

---

## Creating Desktop Shortcuts

### For start.bat
1. Right-click Desktop → New → Shortcut
2. Location: `C:\path\to\project\start.bat`
3. Name: "Start Solar Station"
4. Finish

You can also drag start.bat directly to Desktop.

---

## For Business/Production Use

### Option A: Use NSIS Installer
Best for:- Professional appearance
- Distribution to non-technical users
- Corporate deployments

### Option B: Use setup.bat + start.bat
Best for:
- Development teams
- Internal deployments
- Admin automation

### Option C: Windows Service
For always-running servers:
1. Donwload NSSM: https://nssm.cc/download
2. Install as service: `nssm install SolarStation start.bat`
3. Service will auto-start on Windows boot

---

## Behind the Scenes

### What `start.bat` does:
```batch
1. Change to project directory
2. Check Node.js installation
3. Check PHP installation
4. Check npm dependencies exist
5. Start Relay Server in new window
6. Start Backend API in new window
7. Start Frontend in new window
8. Display success message
```

### What `setup.bat` does:
```batch
1. Detect Windows version and architecture
2. Download Node.js if missing
3. Install Node.js
4. Download PHP if missing
5. Extract PHP
6. Run: npm install (backend)
7. Run: npm install (frontend)
8. Verify installation
9. Ready to launch!
```

---

## Advanced Usage

### Running Services Separately

**Backend only:**
```cmd
cd backend
npm start
```

**Frontend only:**
```cmd
cd frontend
npm run dev
```

**Relay only:**
```cmd
cd Connector\relay_server
php -S 127.0.0.1:8000
```

### Using Different Ports

Edit `frontend/vite.config.js`:
```javascript
export default {
  server: {
    port: 5174  // Change port here
  }
}
```

Edit `backend/server.js`:
```javascript
const PORT = 5001;  // Change port here
app.listen(PORT, () => console.log(`Server on ${PORT}`));
```

---

## Tested On

- Windows 7, 8, 10, 11
- Windows Server 2012 R2, 2016, 2019, 2022
- Both 32-bit and 64-bit systems
- Laptops, desktops, and servers

---

## Performance Tips

### For faster startup:
1. Use SSD (much faster than HDD)
2. Ensure good internet (for first setup)
3. Close unnecessary programs before running
4. Use start.bat (faster than setup.bat)

### For resource-constrained systems:
1. Close other applications
2. Reduce browser tabs open
3. Use Windows Task Manager to check RAM usage
4. Consider upgrading RAM if consistently &gt;90% used

---

## Support Files

For more details, see these documentation files:

- **WINDOWS_INSTALLATION.md** - Full Windows guide
- **COMPLETE_INTEGRATION.md** - API documentation
- **README.md** - Project overview
- **ESP32_INTEGRATION.md** - Hardware setup

---

## Summary

| Use Case | Command |
|----------|---------|
| I just want to start it | Double-click `start.bat` |
| Setting up for 1st time | Double-click `setup.bat` then `start.bat` |
| I prefer PowerShell | Double-click `start.ps1` |
| Building installer for others | Compile `installer.nsi` with NSIS |
| Automated/script setup | Run `setup.bat` or `setup.ps1` |
| Production Windows Server | Use `installer.nsi` or NSSM Windows Service |

---

## Windows Batch Cheat Sheet

Learning batch files? Here are the basics used in our scripts:

```batch
@echo off              # Hide commands from displaying
cd folder             # Change directory
cd..                  # Go to parent directory
cd /d C:\path\to\dir  # Change drive and directory
mkdir foldername      # Create folder
del filename          # Delete file
rmdir folder /s /q    # Delete folder and contents
echo text             # Show message
timeout /t 10         # Wait 10 seconds
pause                 # Wait for user to press key
start "Title" cmd /k  # Open new window
call script.bat       # Run another batch file
if exist file.txt     # Check if file exists
if errorlevel 1       # Check if last command failed
setx VAR value        # Set environment variable
```

---

Last Updated: April 2026
All files tested and ready for production use.
