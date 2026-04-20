#!/bin/bash

# Smart Solar Charging Station - Stop All Services

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}==>${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   Smart Solar Charging Station - Service Shutdown              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

print_status "Stopping all services..."
echo ""

# Kill services by port
services=("8000:Relay" "5000:Backend" "5173:Frontend")
for service in "${services[@]}"; do
    PORT="${service%:*}"
    NAME="${service#*:}"
    PID=$(lsof -ti:$PORT 2>/dev/null)
    if [ ! -z "$PID" ]; then
        kill -9 $PID 2>/dev/null
        print_success "Stopped $NAME (Port $PORT, PID: $PID)"
    fi
done

# Kill any remaining npm processes
pkill -f "npm run dev" 2>/dev/null && print_success "Stopped npm dev processes"
pkill -f "npm start" 2>/dev/null && print_success "Stopped npm start processes"

# Kill any remaining PHP processes
pkill -f "php -S 0.0.0.0:8000" 2>/dev/null && print_success "Stopped PHP relay server"

echo ""
print_status "Cleaning up temporary files..."
rm -f /tmp/relay_server.log /tmp/backend_server.log /tmp/frontend_server.log /tmp/npm_install.log
print_success "Temporary files cleaned"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
print_success "All services stopped successfully"
echo "╚════════════════════════════════════════════════════════════════╝"
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
