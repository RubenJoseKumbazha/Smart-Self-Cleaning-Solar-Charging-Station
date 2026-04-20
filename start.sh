#!/bin/bash

# Smart Solar Charging Station - Linux/macOS Startup Script
# Starts all services: Backend (Node.js), Frontend (React), and Relay Server (PHP)

cd "$(dirname "$0")"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}=========================================================="
echo "  Smart Solar Charging Station - System Startup"
echo "==========================================================${NC}"
echo ""

# Check Node.js
echo -e "${BLUE}[1/3] Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}ERROR: Node.js is not installed${NC}"
    echo "Install with:"
    echo "  Ubuntu/Debian: sudo apt install nodejs npm"
    echo "  macOS:         brew install node"
    echo "  Fedora:        sudo dnf install nodejs npm"
    echo ""
    exit 1
fi
echo -e "${GREEN}[OK] Node.js is installed${NC}"
node --version

# Check PHP
echo ""
echo -e "${BLUE}[2/3] Checking PHP installation...${NC}"
if command -v php &> /dev/null; then
    echo -e "${GREEN}[OK] PHP is installed${NC}"
    php --version | head -n 1
    PHP_AVAILABLE=true
else
    echo -e "${YELLOW}[WARNING] PHP not found - Relay server will not start${NC}"
    echo "Install with:"
    echo "  Ubuntu/Debian: sudo apt install php"
    echo "  macOS:         brew install php"
    echo "  Fedora:        sudo dnf install php"
    PHP_AVAILABLE=false
fi

# Check dependencies
echo ""
echo -e "${BLUE}[3/3] Checking npm dependencies...${NC}"
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing missing dependencies (this may take a moment)...${NC}"
    
    if [ ! -d "backend/node_modules" ]; then
        echo "Installing backend dependencies..."
        cd backend
        npm install --legacy-peer-deps > /dev/null 2>&1
        cd ..
    fi
    
    if [ ! -d "frontend/node_modules" ]; then
        echo "Installing frontend dependencies..."
        cd frontend
        npm install --legacy-peer-deps > /dev/null 2>&1
        cd ..
    fi
else
    echo -e "${GREEN}[OK] All dependencies installed${NC}"
fi

# Create logs directory
mkdir -p logs

echo ""
echo -e "${CYAN}=========================================================="
echo "  Starting Services..."
echo "==========================================================${NC}"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    
    [ ! -z "$RELAY_PID" ] && kill $RELAY_PID 2>/dev/null || true
    [ ! -z "$BACKEND_PID" ] && kill $BACKEND_PID 2>/dev/null || true
    [ ! -z "$FRONTEND_PID" ] && kill $FRONTEND_PID 2>/dev/null || true
    
    rm -f .relay.pid .backend.pid .frontend.pid
    
    echo -e "${YELLOW}All services stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Start Relay Server (PHP)
if [ "$PHP_AVAILABLE" = true ]; then
    echo -e "${BLUE}Starting Relay Server (PHP) on port 8000...${NC}"
    cd Connector/relay_server
    php -S 127.0.0.1:8000 > ../../logs/relay.log 2>&1 &
    RELAY_PID=$!
    cd ../..
    echo -e "${GREEN}✓ Relay Server started (PID: $RELAY_PID)${NC}"
    sleep 1
fi

# Start Backend API (Node.js)
echo -e "${BLUE}Starting Backend API (Node.js) on port 5000...${NC}"
cd backend
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo -e "${GREEN}✓ Backend API started (PID: $BACKEND_PID)${NC}"
sleep 2

# Start Frontend Dashboard (React)
echo -e "${BLUE}Starting Frontend Dashboard (React) on port 5173...${NC}"
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo -e "${GREEN}✓ Frontend Dashboard started (PID: $FRONTEND_PID)${NC}"
sleep 2

echo ""
echo -e "${GREEN}=========================================================="
echo "  All Services Started Successfully!"
echo "==========================================================${NC}"
echo ""
echo -e "${CYAN}Access the system:${NC}"
echo -e "  ${BLUE}Frontend Dashboard:${NC} http://localhost:5173"
echo -e "  ${BLUE}Backend API:${NC}        http://localhost:5000/api"
[ "$PHP_AVAILABLE" = true ] && echo -e "  ${BLUE}Relay Server:${NC}       http://localhost:8000"
echo ""
echo -e "${CYAN}Process IDs:${NC}"
[ "$PHP_AVAILABLE" = true ] && echo -e "  ${BLUE}Relay Server:${NC} $RELAY_PID"
echo -e "  ${BLUE}Backend API:${NC}  $BACKEND_PID"
echo -e "  ${BLUE}Frontend:${NC}     $FRONTEND_PID"
echo ""
echo -e "${CYAN}View logs:${NC}"
echo "  tail -f logs/backend.log"
echo "  tail -f logs/frontend.log"
[ "$PHP_AVAILABLE" = true ] && echo "  tail -f logs/relay.log"
echo ""
echo -e "${CYAN}To stop services:${NC}"
echo "  Press Ctrl+C here, or run: ./stop.sh"
echo ""

# Try to open browser
if command -v xdg-open &> /dev/null; then
    sleep 3
    xdg-open "http://localhost:5173" &> /dev/null &
elif command -v open &> /dev/null; then
    sleep 3
    open "http://localhost:5173" &> /dev/null &
fi

# Save PIDs for stop script
echo "$RELAY_PID" > .relay.pid 2>/dev/null || true
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
