# Linux/macOS Installation & Startup Guide

## Quick Start for Linux/macOS Users

### Option 1: Automatic Setup (Easiest)

```bash
# 1. Make setup script executable
chmod +x setup.sh start.sh

# 2. Run the setup script
./setup.sh

# 3. Start the application
./start.sh

# 4. Open browser to http://localhost:5173
```

The setup script will automatically:
- Check for Node.js and install if needed
- Check for PHP and install if needed
- Download and install npm dependencies
- Make all scripts executable
- Show success message with access URLs

### Option 2: Manual Setup (For Developers)

```bash
# Install Node.js
# Ubuntu/Debian:
sudo apt update && sudo apt install nodejs npm

# Fedora:
sudo dnf install nodejs npm

# macOS:
brew install node

# Install PHP (optional, for Relay server)
# Ubuntu/Debian:
sudo apt install php

# Fedora:
sudo dnf install php

# Fedora:
brew install php

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Start services
./start.sh
```

### Option 3: Install from Distribution Packages Only

If you prefer using only your OS package manager:

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install nodejs npm php php-cli
chmod +x *.sh
./start.sh
```

**Fedora:**
```bash
sudo dnf install nodejs npm php php-cli
chmod +x *.sh
./start.sh
```

**macOS (with Homebrew):**
```bash
brew install node php
chmod +x *.sh
./start.sh
```

---

## Files Overview

| File | Purpose | Usage |
|------|---------|-------|
| `setup.sh` | Automatic setup script | Run once to install everything |
| `start.sh` | Start all services | Run after setup to start system |
| `stop.sh` | Stop all services | Run to stop running services |
| `start-all.sh` | Alternative startup | Same as start.sh |

---

## System Requirements

### Minimum
- **Ubuntu 18.04+, Debian 10+, Fedora 30+, or macOS 10.12+**
- **2 GB RAM**
- **500 MB free disk space**
- **Internet connection** (for initial setup)

### Recommended
- **Ubuntu 20.04+, Debian 11+, Fedora 35+, or macOS 12+**
- **4+ GB RAM**
- **1 GB free disk space**
- **High-speed Internet connection**

---

## Detailed Setup Instructions

### Step 1: Check Your System

```bash
# Check OS
uname -a

# Check if Node.js is installed
node --version

# Check if npm is installed
npm --version

# Check if PHP is installed
php --version
```

### Step 2: Install Prerequisites

#### For Ubuntu/Debian:
```bash
# Update package list
sudo apt update

# Install Node.js and npm
sudo apt install -y nodejs npm

# Install PHP (optional)
sudo apt install -y php php-cli

# Install Git (if needed)
sudo apt install -y git
```

#### For Fedora/RHEL/CentOS:
```bash
# Install Node.js and npm
sudo dnf install -y nodejs npm

# Install PHP (optional)
sudo dnf install -y php php-cli

# Install Git (if needed)
sudo dnf install -y git
```

#### For macOS:
```bash
# Install Homebrew if not present
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install PHP (optional)
brew install php

# Install Git (if needed)
brew install git
```

### Step 3: Set Permissions

```bash
# Make scripts executable
chmod +x setup.sh start.sh stop.sh

# Verify
ls -la *.sh
```

### Step 4: Run Setup

```bash
# Option A: Automatic
./setup.sh

# Option B: Automatic (skip PHP)
./setup.sh --skip-php

# Option C: Manual setup
npm install --legacy-peer-deps
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Step 5: Start Services

```bash
# Start all services
./start.sh

# Or
bash start.sh

# Or (if first method fails)
bash -x start.sh
```

The services will start in the background with output logged to:
- `logs/backend.log`
- `logs/frontend.log`
- `logs/relay.log` (if PHP is installed)

### Step 6: Access the Application

Open your browser to:
- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Relay Server**: http://localhost:8000 (if PHP is installed)

### Step 7: Stop Services

```bash
# Stop all services
./stop.sh

# Or press Ctrl+C if start.sh is running in foreground
```

---

## Command Reference

### Essential Commands

```bash
# Make scripts executable
chmod +x *.sh

# Run setup (one time)
./setup.sh

# Start services
./start.sh

# Stop services
./stop.sh

# View logs in real-time
tail -f logs/backend.log
tail -f logs/frontend.log
tail -f logs/relay.log

# Find process using a port
lsof -ti:5000              # Backend port
lsof -ti:5173              # Frontend port
lsof -ti:8000              # Relay port

# Kill a process by PID
kill -9 <PID>

# Kill all Node processes
killall node

# Kill all PHP processes
killall php
```

### Package Manager Commands

**Ubuntu/Debian:**
```bash
sudo apt update                 # Update package list
sudo apt install package        # Install package
sudo apt remove package         # Remove package
sudo apt upgrade                # Upgrade all packages
```

**Fedora:**
```bash
sudo dnf search package         # Search for package
sudo dnf install package        # Install package
sudo dnf remove package         # Remove package
sudo dnf upgrade                # Upgrade all packages
```

**macOS:**
```bash
brew search formula             # Search for formula
brew install formula            # Install formula
brew uninstall formula          # Uninstall formula
brew upgrade                    # Upgrade all formulas
brew update                     # Update Homebrew
```

---

## Troubleshooting

### "Command not found: ./setup.sh"

**Solution:**
```bash
# Make script executable
chmod +x setup.sh

# Run with bash explicitly
bash setup.sh
```

### "Permission denied"

**Solution:**
```bash
# Add execute permission
chmod +x script.sh

# Or run with bash/sh
bash script.sh
sh script.sh
```

### "Node.js is not installed"

**Solution 1 (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm
```

**Solution 2 (Fedora):**
```bash
sudo dnf install nodejs npm
```

**Solution 3 (macOS):**
```bash
brew install node
```

### "npm: command not found"

**Solution:**
```bash
# This usually means npm isn't in PATH
# Reinstall Node.js:

# Ubuntu/Debian
sudo apt install nodejs npm

# Fedora
sudo dnf install nodejs npm

# macOS
brew install node

# Verify installation
npm --version
```

### "Port 5000 is already in use"

**Solution 1 (Find what's using it):**
```bash
# Find process using port 5000
lsof -ti:5000

# Or
netstat -tlnp | grep 5000
ss -tlnp | grep 5000
```

**Solution 2 (Kill the process):**
```bash
# Kill by PID
kill -9 <PID>

# Or kill all Node processes
killall node
```

**Solution 3 (Use different port):**
Edit `backend/server.js`:
```javascript
const PORT = 5001;  // Change from 5000
```

### Frontend won't load at http://localhost:5173

**Solution 1:**
```bash
# Check if frontend is running
ps aux | grep "npm run dev"

# Check logs
tail -f logs/frontend.log
```

**Solution 2 (Clear browser cache):**
- Press Ctrl+Shift+Del in browser
- Clear browsing data
- Refresh page

**Solution 3 (Use different port):**
Edit `frontend/vite.config.js`:
```javascript
export default {
  server: {
    port: 5174  // Change from 5173
  }
}
```

### npm install fails

**Solution 1 (Clear npm cache):**
```bash
npm cache clean --force
npm install --legacy-peer-deps
```

**Solution 2 (Delete and reinstall):**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**Solution 3 (Update npm):**
```bash
sudo npm install -g npm@latest
npm install --legacy-peer-deps
```

### "EACCES: permission denied"

This usually means npm is trying to install globally without sudo.

**Solution:**
```bash
# Change npm default directory (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Or just use --legacy-peer-deps
npm install --legacy-peer-deps
```

### PHP not working / "PHP not found"

**Solution 1 (Install PHP):**
```bash
# Ubuntu/Debian
sudo apt install php php-cli

# Fedora
sudo dnf install php php-cli

# macOS
brew install php
```

**Solution 2 (Verify PHP):**
```bash
php --version
php -S 127.0.0.1:8000
```

### Cannot access from other machines

**Solution:**
The default setup only allows localhost. To access from other machines:

Edit `backend/server.js`:
```javascript
app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on 0.0.0.0:5000');
});
```

Edit `frontend/vite.config.js`:
```javascript
export default {
  server: {
    host: '0.0.0.0',
    port: 5173
  }
}
```

---

## Environment-Specific Instructions

### Linux Desktop (Ubuntu/Fedora/Debian)

**Best option:**
```bash
# 1. Open Terminal
Ctrl+Alt+T

# 2. Navigate to project
cd ~/Desktop/Smart-Self-Cleaning-Solar-Charging-Station

# 3. Setup
chmod +x setup.sh
./setup.sh

# 4. Start
./start.sh

# 5. Browser automatically opens http://localhost:5173
```

### Linux Server (Headless)

```bash
# Setup via SSH
ssh user@server.ip
cd path/to/project
chmod +x setup.sh
./setup.sh

# Start services
./start.sh &
# Or with screen
screen -S solar
./start.sh
# Detach with: Ctrl+A then D

# Access from remote machine
# Browse to: http://server.ip:5173
```

### macOS

```bash
# 1. Open Terminal
# 2. Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 3. Navigate to project
cd ~/Desktop/Smart-Self-Cleaning-Solar-Charging-Station

# 4. Setup
chmod +x setup.sh
./setup.sh

# 5. Start
./start.sh

# 6. Browser automatically opens http://localhost:5173
```

### Docker (Optional)

```bash
# Build Docker image
docker build -t solar-station .

# Run container
docker run -p 5000:5000 -p 5173:5173 -p 8000:8000 solar-station

# Access: http://localhost:5173
```

---

## Production Deployment

### Option 1: Systemd Service (Linux)

Create file `/etc/systemd/system/solar-station.service`:

```ini
[Unit]
Description=Smart Solar Charging Station
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/solar-station
ExecStart=/bin/bash /var/www/solar-station/start.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable solar-station
sudo systemctl start solar-station
```

### Option 2: Supervisor (Linux)

Install supervisor:
```bash
sudo apt install supervisor
```

Create config `/etc/supervisor/conf.d/solar-station.conf`:
```ini
[program:solar-station-backend]
command=node /var/www/solar-station/backend/server.js
directory=/var/www/solar-station
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/solar-station-backend.log

[program:solar-station-frontend]
command=bash -c "cd /var/www/solar-station/frontend && npm run dev"
directory=/var/www/solar-station
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/solar-station-frontend.log
```

Enable:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

### Option 3: PM2 (Production Process Manager)

```bash
# Install PM2
sudo npm install -g pm2

# Start services
pm2 start backend/server.js --name "backend"
pm2 start "npm run dev --prefix frontend" --name "frontend"
pm2 start "php -S 0.0.0.0:8000 --chdir Connector/relay_server" --name"relay"

# Save configuration
pm2 save

# On reboot
pm2 startup
```

---

## Monitor Running Services

```bash
# View all processes
ps aux | grep node
ps aux | grep php
ps aux | grep npm

# View memory usage
top
# Or press 'M' to sort by memory

# View network connections
netstat -tlnp       # All listening ports
ss -tlnp            # Modern alternative

# Monitor logs
tail -f logs/backend.log
tail -f logs/frontend.log

# Monitor disk usage
df -h               # Disk space
du -sh *            # Directory sizes
```

---

## Cleanup & Maintenance

### Stop and Clean

```bash
# Stop services
./stop.sh

# Remove node_modules (to save space)
rm -rf backend/node_modules frontend/node_modules

# Clean logs
rm -rf logs/*

# Full cleanup
./stop.sh && rm -rf backend/node_modules frontend/node_modules logs/*
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update to latest (may break)
npm install@latest
```

### Reinstall Everything

```bash
./stop.sh
rm -rf backend/node_modules frontend/node_modules
./setup.sh
./start.sh
```

---

## Useful Aliases

Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Solar Station commands
alias solar-start='cd ~/Desktop/Smart-Self-Cleaning-Solar-Charging-Station && ./start.sh'
alias solar-stop='cd ~/Desktop/Smart-Self-Cleaning-Solar-Charging-Station && ./stop.sh'
alias solar-setup='cd ~/Desktop/Smart-Self-Cleaning-Solar-Charging-Station && ./setup.sh'
alias solar-logs='cd ~/Desktop/Smart-Self-Cleaning-Solar-Charging-Station && tail -f logs/*'
alias solar-clean='cd ~/Desktop/Smart-Self-Cleaning-Solar-Charging-Station && ./stop.sh && rm -rf backend/node_modules frontend/node_modules logs'
```

Then reload:
```bash
source ~/.bashrc
# or
source ~/.zshrc
```

Now use:
```bash
solar-start    # Start everything
solar-stop     # Stop everything
solar-logs     # View all logs
```

---

## Support & Documentation

For more details, see:
- **COMPLETE_INTEGRATION.md** - Full API documentation
- **README.md** - Project overview
- **ESP32_INTEGRATION.md** - Hardware integration guide

Last Updated: April 2026
