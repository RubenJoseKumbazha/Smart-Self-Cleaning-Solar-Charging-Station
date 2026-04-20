#!/bin/bash

# Smart Solar Charging Station - Complete System Startup
# Starts: Relay Server (port 8000), Backend (port 5000), Frontend (port 5173)

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONNECTOR_DIR="$PROJECT_DIR/Connector/relay_server"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}==>${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${YELLOW}ℹ${NC} $1"; }

# Cleanup function
cleanup() {
    print_status "Shutting down services..."
    kill $RELAY_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait 2>/dev/null
    print_success "All services stopped"
    exit 0
}

main() {
    clear
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║   Smart Self-Cleaning Solar Charging Station                   ║"
    echo "║   System Startup                                               ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""

    # Verify prerequisites
    print_status "Checking prerequisites..."
    command -v php &>/dev/null || { print_error "PHP not found"; exit 1; }
    command -v node &>/dev/null || { print_error "Node.js not found"; exit 1; }
    command -v npm &>/dev/null || { print_error "npm not found"; exit 1; }
    print_success "All prerequisites available"
    echo ""

    # Kill any existing processes on ports
    lsof -ti:8000 &>/dev/null && kill -9 $(lsof -ti:8000) 2>/dev/null
    lsof -ti:5000 &>/dev/null && kill -9 $(lsof -ti:5000) 2>/dev/null
    lsof -ti:5173 &>/dev/null && kill -9 $(lsof -ti:5173) 2>/dev/null
    sleep 1

    # Initialize relay state
    [ ! -f "$CONNECTOR_DIR/state.txt" ] && echo "0" > "$CONNECTOR_DIR/state.txt"

    # Start Relay Server
    print_status "Starting Relay Server (Port 8000)..."
    php -S 0.0.0.0:8000 -t "$CONNECTOR_DIR" > /tmp/relay_server.log 2>&1 &
    RELAY_PID=$!
    sleep 2
    kill -0 $RELAY_PID 2>/dev/null && print_success "Relay Server started (PID: $RELAY_PID)" || { print_error "Failed"; cat /tmp/relay_server.log; exit 1; }

    # Start Backend
    print_status "Starting Backend (Port 5000)..."
    [ ! -d "$BACKEND_DIR/node_modules" ] && (cd "$BACKEND_DIR" && npm install > /tmp/npm_install.log 2>&1)
    cd "$BACKEND_DIR" && npm start > /tmp/backend_server.log 2>&1 &
    BACKEND_PID=$!
    sleep 3
    kill -0 $BACKEND_PID 2>/dev/null && print_success "Backend started (PID: $BACKEND_PID)" || { print_error "Failed"; cat /tmp/backend_server.log; kill $RELAY_PID; exit 1; }

    # Start Frontend
    print_status "Starting Frontend (Port 5173)..."
    [ ! -d "$FRONTEND_DIR/node_modules" ] && (cd "$FRONTEND_DIR" && npm install > /tmp/npm_install.log 2>&1)
    cd "$FRONTEND_DIR" && npm run dev > /tmp/frontend_server.log 2>&1 &
    FRONTEND_PID=$!
    sleep 3
    kill -0 $FRONTEND_PID 2>/dev/null && print_success "Frontend started (PID: $FRONTEND_PID)" || { print_error "Failed"; cat /tmp/frontend_server.log; kill $RELAY_PID $BACKEND_PID; exit 1; }

    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    print_success "All services running!"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📱 Services:"
    echo "  • Relay:    http://localhost:8000     (PID: $RELAY_PID)"
    echo "  • Backend:  http://localhost:5000/api (PID: $BACKEND_PID)"
    echo "  • Frontend: http://localhost:5173     (PID: $FRONTEND_PID)"
    echo ""
    echo "🔐 Demo: admin@example.com / password123"
    echo ""
    echo "📋 Logs: /tmp/{relay_server,backend_server,frontend_server}.log"
    echo ""

    # Monitor processes
    trap cleanup SIGINT SIGTERM
    print_status "Running (Press Ctrl+C to stop)..."
    while kill -0 $RELAY_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null; do sleep 1; done
    print_error "A service died. Run ./stop.sh to cleanup"
}

main "$@"
