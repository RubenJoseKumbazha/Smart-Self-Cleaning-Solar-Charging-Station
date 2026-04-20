#!/bin/bash

# Smart Solar Charging Station - Stop Script
# Stops all running services

# Color codes
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}Stopping all services...${NC}"
echo ""

STOPPED=0

# Kill Relay Server
if [ -f .relay.pid ]; then
    RELAY_PID=$(cat .relay.pid)
    if kill -0 $RELAY_PID 2>/dev/null; then
        echo "Stopping Relay Server (PID: $RELAY_PID)..."
        kill $RELAY_PID
        ((STOPPED++))
    fi
    rm -f .relay.pid
fi

# Kill Backend
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo "Stopping Backend API (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        ((STOPPED++))
    fi
    rm -f .backend.pid
fi

# Kill Frontend
if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "Stopping Frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        ((STOPPED++))
    fi
    rm -f .frontend.pid
fi

if [ $STOPPED -eq 0 ]; then
    echo -e "${RED}No running services found${NC}"
    echo ""
    echo "Kill manually with:"
    echo "  killall node     # Kill all Node.js processes"
    echo "  killall php      # Kill all PHP processes"
else
    echo ""
    echo -e "${GREEN}Stopped $STOPPED service(s)${NC}"
    sleep 2
    
    echo ""
    echo "Verifying processes..."
    sleep 1
    
    # Force kill if still running
    pkill -9 -f "npm run dev" 2>/dev/null || true
    pkill -9 -f "npm start" 2>/dev/null || true
    pkill -9 -f "php -S" 2>/dev/null || true
    
    echo -e "${GREEN}All services stopped.${NC}"
fi

echo ""

# Check if any services are still running
RUNNING=0
for port in 8000 5000 5173; do
    if lsof -ti:$port &>/dev/null; then
        echo -e "${RED}⚠${NC}  Port $port is still in use"
        RUNNING=1
    fi
done

[ $RUNNING -eq 0 ] && echo "All ports are free" && exit 0 || exit 1
