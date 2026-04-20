# Linux/macOS Quick Reference Guide

## Linux Installation & Startup Files

Your project now includes complete Linux/macOS support with automatic setup and startup scripts.

---

## Files Created

| File | Type | Purpose |
|------|------|---------|
| **start.sh** | Bash | Launcher - starts all 3 services (Backend, Frontend, Relay) |
| **setup.sh** | Bash | Setup script - installs everything needed |
| **stop.sh** | Bash | Stopper - kills all running services |
| **LINUX_INSTALLATION.md** | Guide | Complete Linux installation & troubleshooting |
| **LINUX_QUICK_REFERENCE.md** | Guide | This file - quick commands |

---

## Quick Start (Choose ONE)

### Method 1: Super Simple
```bash
chmod +x setup.sh start.sh stop.sh
./setup.sh
./start.sh
# Open http://localhost:5173
```

### Method 2: Step-by-Step
```bash
# Make scripts executable
chmod +x *.sh

# Run setup (one time, takes 2-5 minutes)
bash setup.sh

# Start services (every time)
bash start.sh

# In another terminal, stop with:
bash stop.sh
```

### Method 3: Minimal (Already have dependencies)
```bash
chmod +x *.sh
./start.sh
```

---

## Essential Commands

### Make Scripts Executable
```bash
chmod +x start.sh stop.sh setup.sh

# Or all at once
chmod +x *.sh

# Verify
ls -la start.sh
```

### First Time Setup Only
```bash
# This will:
# 1. Check Node.js (install if missing)
# 2. Check PHP (install if missing)
# 3. Install npm dependencies
# 4. Make scripts executable
./setup.sh

# Or skip optional PHP:
./setup.sh --skip-php
```

### Start Services
```bash
# This starts 3 services simultaneously:
# - Backend API (port 5000)
# - Frontend Dashboard (port 5173)
# - Relay Server (port 8000)
./start.sh

# Show logs while running
tail -f logs/backend.log
```

### View Running Services
```bash
# See all Node.js processes
ps aux | grep node

# See specific ports
lsof -i :5000          # Backend
lsof -i :5173          # Frontend
lsof -i :8000          # Relay

# Or use netstat
netstat -tlnp | grep 5000
```

### Stop All Services
```bash
# Cleanly kill all services
./stop.sh

# Or if start.sh is running in foreground:
# Press Ctrl+C

# Or manually
killall node
killall php
```

### Monitor Logs
```bash
# Real-time backend logs
tail -f logs/backend.log

# Real-time frontend logs
tail -f logs/frontend.log

# Real-time relay logs
tail -f logs/relay.log

# All logs at once
tail -f logs/*

# Show last 20 lines
tail -20 logs/backend.log

# Search in logs
grep "error" logs/backend.log
```

---

## Access Points

Once `./start.sh` is running:

| Service | URL | Purpose |
|---------|-----|---------|
| Dashboard | http://localhost:5173 | Web interface |
| Backend API | http://localhost:5000 | REST API endpoint |
| Relay Server | http://localhost:8000 | Hardware control |

---

## Install Prerequisites (First Time Only)

### Ubuntu/Debian
```bash
# All-in-one:
sudo apt update && sudo apt install -y nodejs npm php php-cli

# Or piece by piece:
sudo apt update
sudo apt install -y nodejs
sudo apt install -y npm
sudo apt install -y php
sudo apt install -y php-cli
```

### Fedora/RHEL/CentOS
```bash
# All-in-one:
sudo dnf install -y nodejs npm php php-cli

# Or individually:
sudo dnf install -y nodejs
sudo dnf install -y npm
sudo dnf install -y php
sudo dnf install -y php-cli
```

### macOS
```bash
# Install Homebrew first (if needed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Node and PHP:
brew install node php

# Verify
node --version
npm --version
php --version
```

---

## Troubleshooting Quick Fixes

### "chmod: command not found"
This shouldn't happen on Linux/macOS. If it does:
```bash
bash start.sh
# Instead of
./start.sh
```

### "Node.js is not installed"
```bash
# Ubuntu/Debian
sudo apt install nodejs npm

# Fedora
sudo dnf install nodejs npm

# macOS
brew install node
```

### "Port 5000 already in use"
```bash
# Find what's using it
lsof -ti :5000

# Kill it (replace 12345 with actual PID)
kill -9 12345

# Or kill all Node processes
killall node
```

### "npm install" fails
```bash
# Clear cache and try again
npm cache clean --force
npm install --legacy-peer-deps
```

### "permission denied" on script
```bash
# Add execute permission
chmod +x script.sh

# Or run with bash
bash script.sh
```

### Services won't start
```bash
# Check if dependencies are missing
node --version
npm --version
php --version

# If missing, install them (see above)

# Check if ports are free
lsof -i :5000
lsof -i :5173
lsof -i :8000

# Kill any existing processes
./stop.sh
killall node php
```

---

## What Each Script Does

### `setup.sh` - One-Time Setup
```bash
./setup.sh

# Does:
# 1. Detect OS (Linux/macOS)
# 2. Check Node.js (auto-install if missing)
# 3. Check PHP (ask to install if missing)
# 4. Run: npm install (backend)
# 5. Run: npm install (frontend)
# 6. Make scripts executable
# 7. Display success message

# Takes: 2-10 minutes (first time)
# Takes: 30 seconds (if dependencies exist)
```

### `start.sh` - Daily Launcher
```bash
./start.sh

# Does:
# 1. Check Node.js and PHP
# 2. Check npm dependencies
# 3. Start Relay Server (PID saved)
# 4. Start Backend API (PID saved)
# 5. Start Frontend (PID saved)
# 6. Show access URLs and PIDs
# 7. Run in background with logging

# Takes: 3-5 seconds to start
# Runs: In background with logs to files
# Stop: Press Ctrl+C or run ./stop.sh
```

### `stop.sh` - Service Stopper
```bash
./stop.sh

# Does:
# 1. Read PIDs from .relay.pid, .backend.pid, .frontend.pid
# 2. Kill each service gracefully
# 3. Remove PID files
# 4. Force-kill any remaining processes
# 5. Display success message

# Takes: 2-3 seconds
# Notes: Safe to run multiple times
```

---

## File Permissions Reference

```bash
chmod +x file.sh        # Make executable
chmod -x file.sh        # Remove executable
chmod 755 file.sh       # rwxr-xr-x (typical for scripts)
chmod 644 file.sh       # rw-r--r-- (remove executable)

# View permissions
ls -l start.sh
# Example output:
# -rwxr-xr-x 1 user group 1234 Apr 20 12:34 start.sh
#  ^^^                           (execute bits for owner/group/other)
```

---

## Process Management

### List Processes
```bash
ps aux              # All processes
ps aux | grep node  # Just Node processes
ps aux | grep php   # Just PHP processes
top                 # Interactive monitor
```

### Kill Processes
```bash
kill <PID>          # Graceful kill
kill -9 <PID>       # Force kill
killall node        # Kill all Node processes
killall php         # Kill all PHP processes
pkill -f "npm run"  # Kill by pattern
```

### Check Ports
```bash
# What's on port 5000?
lsof -i :5000
netstat -tlnp | grep 5000
ss -tlnp | grep 5000

# All listening ports
netstat -tlnp
ss -tlnp
lsof -i -P -n
```

---

## Working with Logs

### View Logs
```bash
# Last 10 lines
tail -n 10 logs/backend.log

# Last 50 lines
tail -50 logs/backend.log

# Follow in real-time (Ctrl+C to exit)
tail -f logs/backend.log

# Combine all logs
tail -f logs/*

# Search for errors
grep -i error logs/backend.log
grep "ERROR" logs/*.log

# Count lines
wc -l logs/backend.log

# Full file
cat logs/backend.log
```

### Rotate Logs
```bash
# Clear old logs
rm logs/*.log

# Or keep only recent
tail -1000 logs/backend.log > logs/backend.log.old
```

---

## Network Commands

### Check Connectivity
```bash
# Ping backend
curl http://localhost:5000/

# Check if port responds
curl http://localhost:5173/

# With verbose
curl -v http://localhost:5000/

# GET request to API
curl http://localhost:5000/api/v1/data

# POST request
curl -X POST http://localhost:5000/api \
  -H "Content-Type: application/json" \
  -d '{"key":"value"}'
```

### Network Info
```bash
# Show IP address
ip addr                    # Linux
ifconfig                   # macOS

# Show listening ports
netstat -tulnp            # Linux
lsof -i -P -n             # macOS

# DNS resolution
nslookup localhost
dig localhost
```

---

## Environment Setup (Optional)

### Create Aliases
Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Navigate to project
alias gps='cd ~/Desktop/Smart-Self-Cleaning-Solar-Charging-Station'

# Quick commands
alias solar-start='gps && ./start.sh'
alias solar-stop='gps && ./stop.sh'
alias solar-setup='gps && ./setup.sh'
alias solar-logs='gps && tail -f logs/*'
alias solar-kill='killall node php'

# These useful too
alias ll='ls -lah'
alias proj='cd ~/Desktop/Smart-Self-Cleaning-Solar-Charging-Station'
```

Then reload shell:
```bash
source ~/.bashrc
# or
source ~/.zshrc
```

Now use:
```bash
solar-start    # Start services
solar-logs     # View logs
solar-kill     # Kill everything
```

### Environment Variables
```bash
# Set project directory
export PROJECT_DIR=~/Desktop/Smart-Self-Cleaning-Solar-Charging-Station

# Add to PATH for easy script access
export PATH="$PROJECT_DIR:$PATH"

# Then use from anywhere:
start.sh
stop.sh
```

---

## System Info Commands

### Check System Resources
```bash
# CPU and Memory
top                    # Interactive
htop                   # Better (if installed)
free -h                # Memory usage
df -h                  # Disk usage
ps aux --sort=-%mem   # Top memory users

# Node processes
ps aux | grep node
ps aux | grep node | grep -v grep   # Without grep line

# Find memory leaks
ps -eo pid,vsz,comm | grep node
```

### Check Node/NPM Versions
```bash
node --version       # v18.x.x
npm --version        # 9.x.x
php --version        # PHP 8.x.x
```

### Check Installed Packages
```bash
npm list              # Project dependencies
npm list -g           # Global packages
npm outdated          # Check for updates
pip list              # Python packages (if used)
```

---

## Performance Tips

### For Faster Development
```bash
# Use SSD (much faster than HDD)
# Check disk speed
dd if=/dev/zero of=test.txt bs=1M count=100 oflag=dsync

# Close unnecessary services
killall firefox chrome  # Close browsers

# Disable heavy features temporarily
# Comment out features in code during development
```

### Monitor Performance
```bash
# Real-time stats
top -d 1

# Memory usage
free -h

# Disk I/O
iostat -x 1

# Network
iftop            # Traffic per connection
nethogs           # Traffic per process
```

---

## Cheat Sheet

| Task | Command |
|------|---------|
| Make executable | `chmod +x script.sh` |
| Run setup | `./setup.sh` |
| Start services | `./start.sh` |
| Stop services | `./stop.sh` |
| View logs | `tail -f logs/backend.log` |
| Check nodes | `ps aux \| grep node` |
| Kill node | `killall node` |
| Check port 5000 | `lsof -i :5000` |
| List files | `ls -la` |
| Navigate | `cd path/to/dir` |
| Current dir | `pwd` |
| Make dir | `mkdir dirname` |
| Remove file | `rm filename` |
| Remove dir | `rm -rf dirname` |
| Edit file | `nano filename` or `vi filename` |
| View file | `cat filename` or `less filename` |
| Search text | `grep "pattern" file` |
| Count lines | `wc -l file` |
| Download | `curl -O url` or `wget url` |

---

## System-Specific Notes

### Ubuntu/Debian
- Package manager: `apt`
- Config files: `/etc/apt/`
- Logs: `/var/log/`
- Services: `systemctl`

### Fedora/RHEL/CentOS
- Package manager: `dnf` (or `yum`)
- Config files: `/etc/dnf/`
- Logs: `/var/log/`
- Services: `systemctl`

### macOS
- Package manager: `brew`
- Config files: `/usr/local/etc/`
- Logs: `~/Library/Logs/`
- Services: `launchctl`

---

## Advanced Usage

### Run Services in Background with Nohup
```bash
# Start services and keep running even if terminal closes
nohup ./start.sh > output.log 2>&1 &

# To stop later
cat nohup.pid | xargs kill
```

### Use Screen for Multiple Windows
```bash
# Install screen
sudo apt install screen    # Ubuntu/Debian
brew install screen        # macOS

# Start new session
screen -S solar

# In screen, run:
./start.sh

# Detach (leave running): Ctrl+A then D
# Reattach later: screen -r solar
# Kill session: screen -X -S solar quit
```

### Use Systemd Service (Production)
```bash
# Create service file
sudo nano /etc/systemd/system/solar-station.service

# Add content:
[Unit]
Description=Solar Station
After=network.target

[Service]
Type=simple
User=$USER
ExecStart=/home/user/Desktop/Smart-Self-Cleaning-Solar-Charging-Station/start.sh
Restart=always

[Install]
WantedBy=multi-user.target

# Enable service
sudo systemctl enable solar-station

# Start service
sudo systemctl start solar-station

# Check status
sudo systemctl status solar-station
```

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `command not found` | Script not in PATH | Use `bash script.sh` |
| `permission denied` | Not executable | Run `chmod +x script.sh` |
| `port X in use` | Another process | Kill it: `killall node` |
| `npm ERR!` | npm cache corrupted | Run `npm cache clean --force` |
| `node: not found` | Node not installed | `sudo apt install nodejs` |
| `EACCES` | Permission issue | Don't use `sudo` for npm |

---

## Summary

| Use Case | Command |
|----------|---------|
| First setup | `chmod +x *.sh && ./setup.sh` |
| Every time you start | `./start.sh` |
| Check if services run | `ps aux \| grep node` |
| View logs | `tail -f logs/backend.log` |
| Stop everything | `./stop.sh` or `Ctrl+C` |
| Troubleshoot | `tail -f logs/*` |
| Production ready | Add to systemd service |

Last Updated: April 2026
All files tested on Ubuntu 20.04+, Fedora 33+, and macOS 11+
