#!/bin/bash

# Smart Solar Charging Station - Start Both Frontend and Backend
# This script starts both the backend API server and frontend dev server

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo "=================================="
echo "Smart Solar Charging Station"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required directories exist
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${YELLOW}Error: Backend directory not found at $BACKEND_DIR${NC}"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${YELLOW}Error: Frontend directory not found at $FRONTEND_DIR${NC}"
    exit 1
fi

# Cleanup function to stop both servers on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping servers...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    echo -e "${YELLOW}Servers stopped.${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start Backend Server
echo -e "${BLUE}Starting Backend Server...${NC}"
cd "$BACKEND_DIR"
npm start &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo "  Backend URL: http://localhost:5000"
echo "  API URL: http://localhost:5000/api"
echo ""

# Wait a moment for backend to initialize
sleep 2

# Start Frontend Dev Server
echo -e "${BLUE}Starting Frontend Dev Server...${NC}"
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "  Frontend URL: http://localhost:5173"
echo ""

echo -e "${GREEN}=================================="
echo "Both servers are running!"
echo "==================================${NC}"
echo ""
echo "Backend  → http://localhost:5000"
echo "Frontend → http://localhost:5173"
echo "API      → http://localhost:5000/api"
echo ""
echo "Demo Credentials:"
echo "  Admin User: admin@example.com / password"
echo "  Regular User: user@example.com / password"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
