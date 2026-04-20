# Smart Solar Charging Station - System Integration Guide

## System Overview

The system now has **fully integrated connector and website** with the following components:

### Architecture

```
                    ┌─────────────────┐
                    │   Frontend UI   │ (React + Vite)
                    │  Port: 5173     │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │                         │
                ▼                         ▼
        ┌───────────────┐      ┌──────────────────┐
        │ Control Panel │      │ Dashboard/Benches│
        │ (Relay)       │      │ Components       │
        └───────┬───────┘      └────────┬─────────┘
                │                       │
                └───────────┬───────────┘
                            │
                    ┌───────▼────────┐
                    │  Backend API   │ (Node.js/Express)
                    │  Port: 5000    │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
    ┌─────────┐    ┌──────────────┐    ┌──────────────────┐
    │ Benches │    │ Users/Auth   │    │ Relay Control    │
    │ /api    │    │ /api         │    │ /api/relay       │
    └─────────┘    └──────────────┘    └────────┬─────────┘
                                                 │
                                    ┌────────────▼─────────────┐
                                    │  PHP Relay Server        │
                                    │  Port: 8000              │
                                    │  (ESP32 communication)   │
                                    └──────────────────────────┘
```

---

## Quick Start

### 1. Start All Services

```bash
cd /path/to/Smart-Self-Cleaning-Solar-Charging-Station
./start-all.sh
```

This will start:
- **Relay Server**: http://localhost:8000 (PHP)
- **Backend API**: http://localhost:5000 (Node.js)
- **Frontend**: http://localhost:5173 (React)

### 2. Stop All Services

```bash
./stop.sh
```

This will cleanly shutdown all running services and free up ports.

---

## Features

### Relay Control System

The relay control is now **fully integrated** between the frontend and backend:

#### Frontend (React Component)
- **Location**: `frontend/src/components/control/ControlPanel.jsx`
- **Features**:
  - Real-time relay state display
  - ON/OFF buttons for direct control
  - Toggle button for quick switching
  - Visual indicator (green=ON, gray=OFF)
  - Error handling and toast notifications

#### Backend API Endpoints
- **Service**: Node.js/Express on port 5000
- **Base URL**: `http://localhost:5000/api/relay`

**Endpoints**:

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| GET | `/relay/state` | Get current relay state | - | `{state, value, timestamp}` |
| POST | `/relay/state` | Set relay state | `{state: "ON"\|"OFF"}` | `{state, value, timestamp, message}` |
| POST | `/relay/toggle` | Toggle relay state | - | `{state, value, timestamp, message}` |

**Example API Calls**:

```bash
# Get relay state
curl http://localhost:5000/api/relay/state

# Set relay ON
curl -X POST http://localhost:5000/api/relay/state \
  -H "Content-Type: application/json" \
  -d '{"state":"ON"}'

# Toggle relay
curl -X POST http://localhost:5000/api/relay/toggle
```

#### Relay Server (PHP)
- **Location**: `Connector/relay_server/`
- **Port**: 8000
- **Purpose**: Direct communication with ESP32 devices
- **Storage**: `state.txt` file

**Legacy Endpoints** (for ESP32):

| Endpoint | Purpose |
|----------|---------|
| `/getRelay.php` | Get relay state (returns 0 or 1) |
| `/setRelay.php?state=X` | Set relay state (0=OFF, 1=ON) |
| `/` | Control dashboard (HTML UI) |

---

## API Integration

### Backend Database
- **Location**: `backend/data/`
- **Files**:
  - `benches.json` - Solar bench configuration and data
  - `users.json` - User accounts and authentication

### Relay State Management
- **File**: `Connector/relay_server/state.txt`
- **Format**: Single character: `0` (OFF) or `1` (ON)
- **Access**: Backend reads/writes directly to this file for unified state management

### Frontend Configuration
- **API Base URL**: Configured via Vite environment variables
- **Default**: `http://localhost:5000` (development)
- **Location**: `frontend/` (check `.env` files)

---

## Component Breakdown

### Frontend Structure

```
frontend/src/
├── components/
│   ├── control/
│   │   ├── ControlPanel.jsx  ← Relay control (UPDATED)
│   │   └── AddBenchModal.jsx
│   ├── dashboard/
│   │   ├── BenchCard.jsx
│   │   ├── DashboardRouter.jsx
│   │   └── OverviewGrid.jsx
│   ├── charts/
│   │   ├── BatteryChart.jsx
│   │   ├── RevenueChart.jsx
│   │   ├── SessionsChart.jsx
│   │   └── SolarChart.jsx
│   └── ...
├── services/
│   ├── api.js  ← API functions (UPDATED with relay endpoints)
│   ├── auth.js
│   ├── database.js
│   └── tokens.js
├── pages/
│   ├── AdminDashboard.jsx
│   ├── AdminBenches.jsx
│   └── ...
└── ...
```

### Backend Structure

```
backend/
├── server.js  ← Express server (UPDATED with relay endpoints)
├── data/
│   ├── benches.json
│   └── users.json
├── package.json
└── README.md
```

---

## Testing Guide

### Test 1: Verify Services Are Running

```bash
# Check if all ports are open
netstat -tlnp 2>/dev/null | grep -E ':(8000|5000|5173)'

# Or using lsof
lsof -i :8000  # Relay Server
lsof -i :5000  # Backend
lsof -i :5173  # Frontend
```

### Test 2: Test Relay API Directly

```bash
# Get current state
curl http://localhost:5000/api/relay/state

# Set state ON
curl -X POST http://localhost:5000/api/relay/state \
  -H "Content-Type: application/json" \
  -d '{"state":"ON"}'

# Verify change
curl http://localhost:5000/api/relay/state

# Toggle
curl -X POST http://localhost:5000/api/relay/toggle
```

### Test 3: Test Relay Server Directly

```bash
# Get state from PHP server
curl http://localhost:8000/getRelay.php

# Set state from PHP server
curl "http://localhost:8000/setRelay.php?state=1"
```

### Test 4: Access Frontend

Open in browser: `http://localhost:5173`

**Demo Credentials**:
- Email: `admin@example.com`
- Password: `password123`

Navigate to: **Admin Panel** → **Control Panel** to see the relay control UI.

---

## File Cleanup

The following unnecessary files have been removed:
- ✓ `Connector/Just do this to install cloudfare/New Text Document.txt`
- ✓ `Project Cost/Project Cost.csv`

---

## Logging & Troubleshooting

### Log Files

All services write logs to `/tmp/`:

```
/tmp/relay_server.log      # PHP relay server
/tmp/backend_server.log    # Node.js backend
/tmp/frontend_server.log   # Vite frontend dev server
/tmp/npm_install.log       # Dependency installation
```

### View Logs

```bash
# View relay server logs
tail -f /tmp/relay_server.log

# View backend logs
tail -f /tmp/backend_server.log

# View frontend logs
tail -f /tmp/frontend_server.log

# View all logs
tail -f /tmp/*.log
```

### Common Issues

**Port Already In Use**
```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use stop script
./stop.sh
```

**Dependencies Not Installed**
```bash
# Install manually
cd backend && npm install
cd ../frontend && npm install
```

**Relay State File Missing**
```bash
# Initialize relay state
echo "0" > Connector/relay_server/state.txt
```

**Frontend Can't Connect to Backend**
- Check `frontend/vite.config.js` for VITE_API_BASE_URL
- Ensure backend is running on port 5000
- Check browser console (F12) for network errors

---

## Production Deployment

### For External Access (ESP32 Over Internet)

**Option 1: Cloudflare Tunnel** (Recommended)

```bash
# Install cloudflared
# See CONNECTOR_SETUP.md for detailed instructions

# Run tunnel
cloudflared tunnel run relay-tunnel
```

**Option 2: ngrok** (Quick Testing)

```bash
# Start ngrok
ngrok http 5000  # For backend
ngrok http 8000  # For relay server
```

### Environment Variables

Create `.env` files:

**backend/.env**
```
NODE_ENV=production
PORT=5000
API_URL=https://yourdomain.com/api
```

**frontend/.env.production**
```
VITE_API_BASE_URL=https://yourdomain.com/api
```

---

## Architecture Notes

### State Management Flow

```
User Action (ControlPanel)
        ↓
Frontend API Call (setRelayState)
        ↓
Backend POST /api/relay/state
        ↓
Server writes to state.txt
        ↓
Update relayState state in Frontend
        ↓
UI re-renders (Visual confirmation)
        ↓
ESP32 periodically polls PHP server
        ↓
ESP32 reads state.txt
        ↓
ESP32 controls physical relay
```

### File-Based State Storage

- **Advantage**: Simple, no database needed
- **Disadvantage**: Not suitable for high-frequency updates
- **Future**: Could migrate to database (SQLite, PostgreSQL) if needed

---

## Next Steps

1. **ESP32 Integration**: Update ESP32 firmware to use `http://localhost:8000/getRelay.php`
2. **Database Migration**: Move from JSON files to database (optional)
3. **Authentication**: Enhance JWT authentication
4. **Real-time Updates**: Implement WebSockets for live relay state updates
5. **Monitoring**: Add system health checks and monitoring endpoint

---

## Support & Documentation

- **QUICK_START.md** - Basic setup guide
- **CONNECTOR_SETUP.md** - Detailed connector configuration
- **ESP32_INTEGRATION.md** - ESP32 integration guide
- **README.md** - Project overview

---

## Summary

✅ **Connector & Website Integrated**
✅ **Relay Control via Backend API**
✅ **Frontend UI for Relay Management**
✅ **ESP32 Direct Communication Support**
✅ **Automated Start/Stop Scripts**
✅ **Complete Logging & Debugging**

**All systems operational and ready for use!**
