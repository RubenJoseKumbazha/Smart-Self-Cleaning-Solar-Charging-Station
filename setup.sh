#!/bin/bash

# Smart Solar Charging Station - Linux/macOS Setup Script
# Checks for required software and installs dependencies automatically

set -e

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
echo "  Smart Solar Charging Station - Linux/macOS Setup"
echo "==========================================================${NC}"
echo ""

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS_TYPE="Linux"
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS_NAME=$NAME
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS_TYPE="macOS"
    OS_NAME="macOS"
else
    OS_TYPE="Unknown"
fi

echo -e "${BLUE}Detected OS:${NC} $OS_TYPE ($OS_NAME)"
echo ""

# ========== NODE.JS CHECK ==========
echo -e "${BLUE}[STEP 1/4] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}[OK] Node.js is installed: $NODE_VERSION${NC}"
else
    echo -e "${YELLOW}[INSTALL] Node.js not found${NC}"
    
    if [[ "$OS_TYPE" == "Linux" ]]; then
        if command -v apt-get &> /dev/null; then
            echo "Installing Node.js..."
            sudo apt-get update -qq
            sudo apt-get install -y nodejs npm > /dev/null 2>&1
        elif command -v dnf &> /dev/null; then
            echo "Installing Node.js..."
            sudo dnf install -y nodejs npm > /dev/null 2>&1
        elif command -v yum &> /dev/null; then
            echo "Installing Node.js..."
            sudo yum install -y nodejs npm > /dev/null 2>&1
        fi
    elif [[ "$OS_TYPE" == "macOS" ]]; then
        if command -v brew &> /dev/null; then
            echo "Installing Node.js..."
            brew install node > /dev/null 2>&1
        else
            echo -e "${RED}ERROR: Homebrew not found. Install from: https://brew.sh/${NC}"
            exit 1
        fi
    fi
    
    if command -v node &> /dev/null; then
        echo -e "${GREEN}[OK] Node.js installed successfully${NC}"
        node --version
    else
        echo -e "${RED}[ERROR] Failed to install Node.js${NC}"
        exit 1
    fi
fi

# ========== PHP CHECK ==========
echo ""
echo -e "${BLUE}[STEP 2/4] Checking PHP...${NC}"
if command -v php &> /dev/null; then
    PHP_VERSION=$(php --version | head -n 1)
    echo -e "${GREEN}[OK] PHP is installed${NC}"
    echo "    $PHP_VERSION"
    PHP_AVAILABLE=true
else
    echo -e "${YELLOW}[OPTIONAL] PHP not found - Relay server will not work${NC}"
    
    if [ "$1" != "--skip-php" ]; then
        read -p "Install PHP? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if [[ "$OS_TYPE" == "Linux" ]]; then
                if command -v apt-get &> /dev/null; then
                    echo "Installing PHP..."
                    sudo apt-get install -y php php-cli > /dev/null 2>&1
                elif command -v dnf &> /dev/null; then
                    echo "Installing PHP..."
                    sudo dnf install -y php php-cli > /dev/null 2>&1
                elif command -v yum &> /dev/null; then
                    echo "Installing PHP..."
                    sudo yum install -y php php-cli > /dev/null 2>&1
                fi
            elif [[ "$OS_TYPE" == "macOS" ]]; then
                if command -v brew &> /dev/null; then
                    echo "Installing PHP..."
                    brew install php > /dev/null 2>&1
                fi
            fi
            
            if command -v php &> /dev/null; then
                echo -e "${GREEN}[OK] PHP installed successfully${NC}"
                PHP_AVAILABLE=true
            else
                echo -e "${YELLOW}[WARNING] Could not install PHP${NC}"
                PHP_AVAILABLE=false
            fi
        else
            echo -e "${YELLOW}[SKIPPED] PHP installation skipped${NC}"
            PHP_AVAILABLE=false
        fi
    fi
fi

# ========== BACKEND DEPENDENCIES ==========
echo ""
echo -e "${BLUE}[STEP 3/4] Installing Backend Dependencies...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages for backend..."
    npm install --legacy-peer-deps > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}[OK] Backend dependencies installed${NC}"
    else
        echo -e "${RED}[ERROR] Failed to install backend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}[OK] Backend dependencies already installed${NC}"
fi
cd ..

# ========== FRONTEND DEPENDENCIES ==========
echo ""
echo -e "${BLUE}[STEP 4/4] Installing Frontend Dependencies...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages for frontend..."
    npm install --legacy-peer-deps > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}[OK] Frontend dependencies installed${NC}"
    else
        echo -e "${RED}[ERROR] Failed to install frontend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}[OK] Frontend dependencies already installed${NC}"
fi
cd ..

# ========== MAKE SCRIPTS EXECUTABLE ==========
echo ""
echo -e "${BLUE}Making scripts executable...${NC}"
chmod +x start.sh stop.sh setup.sh 2>/dev/null || true
echo -e "${GREEN}[OK] Scripts are executable${NC}"

# ========== SUCCESS ==========
echo ""
echo -e "${GREEN}=========================================================="
echo "  Setup Complete! System Ready to Start"
echo "==========================================================${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo "1. Run: ${BLUE}./start.sh${NC}"
echo "2. Or:  ${BLUE}bash start.sh${NC}"
echo "3. Open: ${BLUE}http://localhost:5173${NC}"
echo ""
echo -e "${CYAN}Services will run on:${NC}"
echo "  ${BLUE}Frontend Dashboard:${NC} http://localhost:5173"
echo "  ${BLUE}Backend API:${NC}        http://localhost:5000"
if [ "$PHP_AVAILABLE" = true ]; then
    echo "  ${BLUE}Relay Server:${NC}       http://localhost:8000"
fi
echo ""
echo -e "${CYAN}For help, see:${NC}"
echo "  - README.md"
echo "  - LINUX_INSTALLATION.md"
echo "  - LINUX_QUICK_REFERENCE.md"
echo ""

exit 0
