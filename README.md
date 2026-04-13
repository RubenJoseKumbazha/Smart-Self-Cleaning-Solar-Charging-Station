# Smart Self-Cleaning Solar Charging Station

A production-ready IoT admin dashboard for monitoring and controlling solar-powered public charging benches. Built with React, Vite, Tailwind CSS, and Recharts for real-time data visualization and remote device management.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API & Mock Data](#api--mock-data)
- [Component Architecture](#component-architecture)
- [Usage Guide](#usage-guide)
- [Configuration](#configuration)
- [Development Workflow](#development-workflow)
- [Browser Support](#browser-support)
- [Performance](#performance)
- [Future Enhancements](#future-enhancements)

---

## Project Overview

**Smart Self-Cleaning Solar Charging Station** is a comprehensive IoT management platform designed to monitor and control multiple solar-powered public charging benches. Each bench sends telemetry data every 5 minutes via GSM (SIM800L) connectivity, providing real-time health metrics, usage statistics, and system status.

The dashboard enables facility managers to:
- Monitor solar generation and battery health
- Track sessions and revenue metrics
- Receive automated alerts for device issues
- Execute remote commands (cleaning, reboots, charging control)
- Analyze trends across the fleet

---

## Features

### Core Capabilities

✅ **Real-Time Monitoring**
- Live polling of bench data every 5 minutes
- Battery level tracking with historical charts
- Solar generation metrics and trends
- Active session counting
- Temperature monitoring

✅ **Remote Device Control**
- Force cleaning cycles
- Stop/start charging operations
- Device reboot commands
- Maintenance mode activation
- Dynamic pricing updates

✅ **Fleet Analytics**
- Sessions per day trends
- Revenue per day analytics
- Daily trend visualizations with Recharts
- Performance comparison across benches

✅ **Alert Management**
- Low battery warnings
- Offline device notifications
- High temperature alerts
- Bench-specific alert history

✅ **Token System**
- Daily token allocation (10 tokens per day)
- Token spending tracking with transaction history
- 7-day transaction history with automatic cleanup
- Countdown timer showing time until next refresh
- Token balance visibility in sidebar
- Comprehensive token dashboard with usage analytics

✅ **User Experience**
- Responsive design (mobile, tablet, desktop)
- Dark mode toggle
- Search and filter functionality
- Last-updated timestamps
- Loading skeletons and error states
- Toast notifications for actions

✅ **Data Visualization**
- Battery level trends (line chart)
- Solar generation trends (area chart)
- Session analytics (line chart)
- Revenue analytics (bar chart)

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React | 18.3.1 |
| **Build Tool** | Vite | 5.4.1 |
| **Routing** | React Router | 6.16.0 |
| **Styling** | Tailwind CSS | 3.4.4 |
| **HTTP Client** | Axios | 1.5.0 |
| **Charts** | Recharts | 2.9.0 |
| **Node Version** | 16+ | Recommended |

### Dev Dependencies
- `@vitejs/plugin-react` — Fast Refresh for React
- `autoprefixer` — CSS vendor prefixing
- `postcss` — CSS transformation
- `tailwindcss` — Utility-first CSS
- `vite` — Next-gen build tool

---

## Project Structure

```
project-root/
│
├── backend/                         # Node.js Express API Server
│   ├── server.js                    # Express server & API routes
│   ├── package.json                 # Backend dependencies
│   ├── .gitignore
│   ├── .env                         # Backend configuration (create as needed)
│   ├── data/
│   │   ├── benches.json             # Benches database (JSON file)
│   │   └── users.json               # Users database (JSON file)
│   └── README.md                    # Backend setup guide
│
├── frontend/                        # React + Vite Frontend Application
│   ├── public/
│   │   ├── index.html               # Entry HTML
│   │   ├── favicon.ico
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx           # Main app wrapper with provider
│   │   │   │   ├── Navbar.jsx           # Top navigation bar with tokens
│   │   │   │   ├── Sidebar.jsx          # Left sidebar with admin links
│   │   │   │   ├── DashboardRouter.jsx  # Role-based dashboard router
│   │   │   │   └── UpdateContext.jsx    # Global state for theme & updates
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardRouter.jsx  # Routes to UserDashboard or AdminDashboard
│   │   │   │   ├── StatCard.jsx         # KPI cards (total benches, revenue, etc)
│   │   │   │   └── BenchCard.jsx        # Bench grid card component
│   │   │   │
│   │   │   ├── charts/
│   │   │   │   ├── BatteryChart.jsx     # Battery level line chart
│   │   │   │   ├── SolarChart.jsx       # Solar generation area chart
│   │   │   │   ├── SessionsChart.jsx    # Sessions per day line chart
│   │   │   │   └── RevenueChart.jsx     # Revenue per day bar chart
│   │   │   │
│   │   │   ├── control/
│   │   │   │   ├── ControlPanel.jsx     # Remote device control panel
│   │   │   │   └── AddBenchModal.jsx    # Modal for adding new benches
│   │   │   │
│   │   │   └── common/
│   │   │       ├── Button.jsx           # Reusable button component
│   │   │       ├── Loader.jsx           # Loading spinner
│   │   │       ├── StatusBadge.jsx      # Status indicator badge
│   │   │       ├── FormInput.jsx        # Form input with validation
│   │   │       └── ProtectedRoute.jsx   # Auth-protected route wrapper
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx                # User login page
│   │   │   ├── Register.jsx             # User registration page
│   │   │   ├── UserDashboard.jsx        # User monitoring dashboard
│   │   │   ├── AdminDashboard.jsx       # Admin fleet management dashboard
│   │   │   ├── AdminBenches.jsx         # Admin: View/edit/add/delete benches
│   │   │   ├── AdminUsers.jsx           # Admin: View/edit/add/delete users
│   │   │   ├── BenchDetails.jsx         # Detail view for single bench
│   │   │   ├── Analytics.jsx            # Fleet-wide analytics
│   │   │   ├── Alerts.jsx               # Alert notifications
│   │   │   ├── Tokens.jsx               # Token dashboard and transaction history
│   │   │   └── Settings.jsx             # Theme & customization settings
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                   # Axios client & mock endpoints
│   │   │   ├── auth.js                  # Auth API calls (login, register)
│   │   │   ├── tokens.js                # Token allocation & spending logic
│   │   │   └── database.js              # Database API service (CRUD operations)
│   │   │
│   │   ├── hooks/
│   │   │   └── useFetch.js              # Data fetching with polling
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Global authentication state
│   │   │   └── TokenContext.jsx         # Global token state and operations
│   │   │
│   │   ├── config/
│   │   │   └── themes.js                # Predefined color theme configuration
│   │   │
│   │   ├── utils/
│   │   │   └── format.js                # Number, date, and currency formatters
│   │   │
│   │   ├── App.jsx                      # Root component with router
│   │   ├── main.jsx                     # React DOM entry point
│   │   ├── routes.jsx                   # Route definitions
│   │   └── index.css                    # Tailwind directives
│   │
│   ├── package.json                     # Frontend dependencies and scripts
│   ├── vite.config.js                   # Vite configuration
│   ├── tailwind.config.js               # Tailwind theme config
│   ├── postcss.config.js                # PostCSS plugins
│   ├── .env.local                       # Frontend environment variables
│   └── .gitignore                       # Git ignore rules
│
└── README.md                        # This file
```

---

## Installation

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager
- Two terminal windows (for backend and frontend)

### Steps

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Verify Installation**
   ```bash
   npm list react react-dom recharts axios react-router-dom --prefix frontend
   ```

---

## Running the Application

### Quick Start (With Backend)

#### 1. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

#### 2. Start Backend Server (Terminal 1)

```bash
cd backend
npm start
```

Server runs on `http://localhost:5000/api`

**Output:**
```
Smart Solar Bench Backend running on http://localhost:5000
API available at http://localhost:5000/api
```

#### 3. Start Frontend Dev Server (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

**Features:**
- Real-time database syncing
- Admin panel for managing benches and users
- Hot reload on file changes
- Sourcemaps for debugging

#### 4. Access the Application

Open `http://localhost:5173` in your browser

**Demo Login:**
- Admin Account: `admin@example.com` / `password123` (Full access, admin panel)
- User Account: `manager@example.com` / `password123` (Monitoring only)

---

### Backend-Free Development (Mock Mode)

If you don't want to run the backend, the app works with mock data:

```bash
cd frontend
npm run dev
```

**Limitation:** Data changes won't persist (in-memory only)

---

### Production Build

Create optimized production bundle:

```bash
npm run build
```

**Output:**
- Minified CSS: `dist/assets/index-*.css` (~5.17 KB gzipped)
- Minified JS: `dist/assets/index-*.js` (~205 KB gzipped)
- HTML entry: `dist/index.html`

### Preview Build

Preview the production build locally:

```bash
npm run preview
```

Available at `http://localhost:4173`

---

## Database & API

### Backend Database API

The application includes a **Node.js + Express backend** with RESTful endpoints for managing:
- **Benches** - Solar charging station data
- **Users** - User accounts and authentication
- **JSON file storage** - No external database required

**Backend Location:** `backend/` directory
**API Server:** `http://localhost:5000/api`

#### API Endpoints

**Benches:**
- `GET /api/benches` - List all benches
- `POST /api/benches` - Create new bench
- `PUT /api/benches/:id` - Update bench
- `DELETE /api/benches/:id` - Delete bench

**Users:**
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Admin Panel

**Admin-only pages for managing data:**

1. **Manage Benches** (`/admin/benches`)
   - View all benches in table format
   - Add new benches with location and capacity
   - Edit bench properties (battery, capacity, status, location)
   - Delete benches with confirmation
   - Real-time status and battery indicators

2. **Manage Users** (`/admin/users`)
   - View all users with roles and status
   - Add new user accounts
   - Edit user details (name, email, role, status)
   - Delete user accounts with confirmation
   - Role-based access control (admin/user)

**Access:** Login as admin (`admin@example.com`) → Sidebar shows "Admin Panel"

### Mock Data

Initial database includes:
- **4 Solar Benches:** PARK-001 to PARK-004 with realistic metrics
- **3 User Accounts:** 1 admin + 2 regular users

Data is persisted in:
- `backend/data/benches.json`
- `backend/data/users.json`

---

## API & Mock Data

### Real API vs Mock Mode

The application intelligently switches between:

**Real API Mode** (Backend running):
```bash
# Frontend connects to backend
VITE_API_BASE_URL=http://localhost:5000/api
```

**Mock Mode** (No backend):
- Falls back to mock responses
- Data not persisted across refreshes
- Useful for frontend development without backend


    "solar_watts": 12.5,
    "active_sessions": 1,
    "daily_sessions": 14,
    "temperature": 28,
    "status": "online",
    "last_cleaning": "2026-04-13T06:00:00Z"
  },
  {
    "bench_id": "PARK-002",
    "battery_percent": 62,
    "solar_watts": 8.8,
    "active_sessions": 2,
    "daily_sessions": 9,
    "temperature": 32,
    "status": "online",
    "last_cleaning": "2026-04-13T03:20:00Z"
  },
  {
    "bench_id": "PARK-003",
    "battery_percent": 19,
    "solar_watts": 3.6,
    "active_sessions": 0,
    "daily_sessions": 6,
    "temperature": 41,
    "status": "offline",
    "last_cleaning": "2026-04-12T23:45:00Z"
  },
  {
    "bench_id": "PARK-004",
    "battery_percent": 52,
    "solar_watts": 15.1,
    "active_sessions": 1,
    "daily_sessions": 11,
    "temperature": 29,
    "status": "online",
    "last_cleaning": "2026-04-13T02:10:00Z"
  }
]
```

**Response Time:** 500ms (simulated)

#### GET /bench/:id

Returns detailed metrics for a specific bench including time-series history.

**Path Parameters:**
- `id` (string) — Bench identifier (e.g., "PARK-001")

**Mock Response:**
```json
{
  "bench_id": "PARK-001",
  "battery_percent": 87,
  "solar_watts": 12.5,
  "active_sessions": 1,
  "daily_sessions": 14,
  "temperature": 28,
  "status": "online",
  "last_cleaning": "2026-04-13T06:00:00Z",
  "battery_history": [
    { "time": "55m", "value": 78.4 },
    { "time": "50m", "value": 79.2 },
    { "time": "45m", "value": 80.1 },
    { "time": "40m", "value": 81.5 },
    { "time": "35m", "value": 82.3 },
    { "time": "30m", "value": 83.7 },
    { "time": "25m", "value": 84.2 },
    { "time": "20m", "value": 85.0 },
    { "time": "15m", "value": 85.8 },
    { "time": "10m", "value": 86.3 },
    { "time": "5m", "value": 86.9 },
    { "time": "now", "value": 87.0 }
  ],
  "solar_history": [
    { "time": "55m", "value": 10.2 },
    { "time": "50m", "value": 11.0 },
    { "time": "45m", "value": 11.8 },
    { "time": "40m", "value": 12.1 },
    { "time": "35m", "value": 12.3 },
    { "time": "30m", "value": 12.5 },
    { "time": "25m", "value": 12.4 },
    { "time": "20m", "value": 12.3 },
    { "time": "15m", "value": 12.4 },
    { "time": "10m", "value": 12.5 },
    { "time": "5m", "value": 12.5 },
    { "time": "now", "value": 12.5 }
  ]
}
```

**Response Time:** 450ms (simulated)

#### POST /control/:action

Execute remote command on a bench.

**Path Parameters:**
- `action` (string) — One of: `force-clean`, `stop-charging`, `reboot`, `maintenance`, `update-price`

**Request Body:**
```json
{
  "bench_id": "PARK-001"
}
```

**Success Response (92% of requests):**
```json
{
  "status": "success",
  "message": "Action force cleaning executed for PARK-001"
}
```

**Error Response (8% failure rate simulated):**
```json
{
  "error": "Device communication failed. Try again in a moment."
}
```

**Response Time:** 700ms (simulated)

### Data Format Specification

**User Object Schema**
```javascript
{
  id: String,                 // Unique user identifier
  email: String,              // User email address
  name: String,               // User full name
  token: String               // Authentication token
}
```

**Bench Object Schema**
```javascript
{
  bench_id: String,              // Unique identifier (e.g., "PARK-001")
  battery_percent: Number,       // 0-100 (percentage)
  solar_watts: Number,           // Solar power generation in watts
  active_sessions: Number,       // Currently active charging sessions
  daily_sessions: Number,        // Sessions completed today
  temperature: Number,           // Device temperature in Celsius
  status: String,                // "online" or "offline"
  last_cleaning: ISO8601String   // Timestamp of last cleaning
}
```

**Time Series History**
```javascript
{
  time: String,        // Relative time (e.g., "55m", "50m", "5m")
  value: Number        // Metric value (battery %, watts, etc)
}
```

**Alert Object Schema**
```javascript
{
  id: String,
  type: String,                  // "Low battery", "Offline bench", etc
  bench_id: String,
  timestamp: ISO8601String,
  status: String,                // "warning", "offline", "error"
  message: String
}
```

---

## Authentication System

### How It Works

1. **AuthProvider Context**
   - Wraps entire application at root level
   - Persists user data in localStorage
   - Provides global auth state to all components

2. **Protected Routes**
   - Dashboard, Analytics, Alerts, BenchDetails routes require authentication
   - ProtectedRoute component checks authentication status
   - Unauthenticated users redirected to `/login`

3. **Auth Service**
   - Mock API with simulated delays (600-800ms)
   - Pre-populated test users
   - User registration and login workflows

### Components

#### `AuthContext.jsx`
Global context for authentication state.

```javascript
const { user, isAuthenticated, login, logout, loading } = useAuth();
```

Features:
- User object storage
- Login/logout functions
- Loading state during auth check
- localStorage persistence

#### `ProtectedRoute.jsx`
Route wrapper enforcing authentication.
- Renders Loader while checking auth
- Redirects to login if not authenticated
- Renders children if authenticated

#### `FormInput.jsx`
Reusable form input with validation errors.
- Error message display
- Disabled state support
- Dark mode support
- Styled error states

### Demo Credentials

For testing without registration:

```
Email: admin@example.com
Password: password123
```

Or register a new account:

```
Email: any@example.com
Password: any password (6+ chars)
```

### Session Management

- User data stored in localStorage as JSON
- Session persists across browser refresh
- Logout clears localStorage and redirects to login
- Token generated on successful auth (for future real API use)

---

## Token System

### Daily Token Allocation

1. **TokenProvider Context**
   - Wraps entire application after AuthProvider
   - Persists token data in localStorage
   - Provides global token state to all components

2. **Daily Reset Mechanism**
   - Users receive 10 tokens every 24 hours
   - Token allocation tracked by timestamp
   - Countdown timer shows hours/minutes until next refresh
   - Updates every 60 seconds in the UI

3. **Automatic Cleanup**
   - Transactions older than 7 days automatically removed
   - Keeps transaction history clean
   - Maintains data privacy by deleting old records

### Components

#### `TokenContext.jsx`
Global context for token state and operations.

```javascript
const { tokenData, spendToken, nextRefresh, loading } = useTokens();
```

Features:
- Token balance tracking (available, used, total)
- Transaction history with timestamps
- Automatic countdown timer refresh
- localStorage persistence

#### `tokens.js` Service
Core token management logic.

```javascript
getTokenData()           // Load from storage, check if refresh needed
resetDailyTokens()       // Allocate +10 tokens, cleanup old transactions
useToken(amount, desc)   // Spend tokens and record transaction
getNextRefreshTime()     // Calculate hours/minutes until refresh
```

### Token Dashboard (`/tokens`)

View token status and transaction history:
- **Available Tokens** — Current balance (today's allocation - spent)
- **Used Tokens** — Total spent today
- **Total Tokens** — All-time tokens allocated
- **Daily Progress** — Visual bar showing usage percentage
- **Next Refresh** — Countdown to next 24-hour reset
- **Token Benefits** — List of 4 token-spending actions
- **Transaction History** — All transactions from last 7 days

### Token Tracking

Each transaction is logged with:
- Type (credit: +10, debit: -X)
- Amount (tokens spent/allocated)
- Description (action type)
- Timestamp (date and time)

Example transactions:
```
+ 10       Daily allocation              Today 12:00 AM
- 2        Device Reboot                 Today 2:15 PM
- 1        Force Cleaning                Today 3:45 PM
+ 10       Daily allocation              Yesterday 12:00 AM
```

### Integration with Controls

Token spending tracked for:
- Force Cleaning (1 token)
- Device Reboot (2 tokens)
- Maintenance Mode (1 token)
- Data Export (3 tokens)

**Note:** Token integration with remote actions is available for future implementation.

---

## Theme System

### Global Color Themes

The dashboard includes 6 predefined color themes that can be switched from the Settings page. Each theme includes:
- Primary color for main UI elements
- Accent color for highlights
- Success, warning, and danger colors for status indicators

### Available Themes

| Theme | Primary | Accent | Use Case |
|-------|---------|--------|----------|
| **Slate** | `#1e293b` | `#0f766e` | Default, professional |
| **Ocean Blue** | `#1e40af` | `#0284c7` | Tech-focused, calm |
| **Purple Storm** | `#6d28d9` | `#a855f7` | Creative, modern |
| **Emerald Green** | `#059669` | `#10b981` | Nature, eco-friendly |
| **Rose Pink** | `#be185d` | `#ec4899` | Bold, vibrant |
| **Indigo Deep** | `#4f46e5` | `#6366f1` | Tech, professional |

### Theme Implementation

**Theme Configuration** (`config/themes.js`)
```javascript
export const COLOR_THEMES = {
  slate: {
    name: 'Slate (Default)',
    primary: '#1e293b',
    accent: '#0f766e',
    warning: '#ea580c',
    success: '#16a34a',
    danger: '#dc2626',
  },
  // ... other themes
};
```

**Theme State** (UpdateContext.jsx)
- Managed globally via React Context
- CSS custom properties applied to document root
- Persisted to localStorage for session continuity
- Supports dark mode independently

**Theme Selection Flow**
1. User visits Settings page
2. User clicks on desired theme
3. Theme key saved to localStorage
4. CSS variables updated on document root
5. All UI elements automatically reflect new colors

### How to Add a New Theme

1. Add entry to `COLOR_THEMES` in `src/config/themes.js`
2. Include all color properties: `primary`, `accent`, `success`, `warning`, `danger`
3. Restart dev server
4. New theme appears in Settings page automatically

---



### Layout Components

#### `Layout.jsx`
Root component wrapping entire app with provider context.
- Renders Sidebar, Navbar, and route outlet
- Initializes UpdateProvider for theme and update state
- Responsive grid layout (sidebar on desktop, mobile nav)

#### `Navbar.jsx`
Fixed top navigation bar.
- Last updated timestamp
- Dark mode toggle button
- Status display

#### `Sidebar.jsx`
Fixed left sidebar (desktop) / sticky top (mobile).
- Navigation links: Dashboard, Analytics, Alerts
- Active link highlighting with React Router
- Branding and status info

#### `UpdateContext.jsx`
Global context for:
- Last data update timestamp
- Dark mode state and toggle
- Theme initialization

### Dashboard Components

#### `StatCard.jsx`
Reusable KPI display card.
```jsx
<StatCard title="Total Benches" value={4} />
<StatCard title="Revenue Today" value="$85.50" />
```

#### `BenchCard.jsx`
Grid card for bench overview with:
- Bench ID and status badge
- Battery % and Solar watts
- Active and daily session counts
- Click to navigate to detail page

### Chart Components

All charts use **Recharts** library with Tailwind styling.

#### `BatteryChart.jsx`
Line chart showing battery percentage over time (12 data points).

#### `SolarChart.jsx`
Area chart showing solar generation in watts with gradient fill.

#### `SessionsChart.jsx`
Line chart displaying sessions per day of week.

#### `RevenueChart.jsx`
Bar chart showing daily revenue trends.

### Control Components

#### `ControlPanel.jsx`
Remote device control interface.
- 5 action buttons (force clean, stop charging, reboot, maintenance, update price)
- Loading state during action
- Success/error toast notifications
- Mock API calls with error handling (8% failure rate)

### Common Components

#### `Button.jsx`
Reusable button with variants:
- `primary` — Dark slate with white text
- `secondary` — Light slate background with border

#### `StatusBadge.jsx`
Status indicator with color variants:
- `online` — Emerald/green
- `offline` — Rose/red
- `warning` — Amber/yellow

#### `Loader.jsx`
Animated loading spinner with message.

---

## Usage Guide

### Login Page (`/login`)

**Initial authentication screen.**

1. **Email & Password Input**
   - Enter your login credentials
   - Demo credentials provided on the page
   - Real-time validation

2. **Demo Credentials**
   - Email: `admin@example.com`
   - Password: `password123`

3. **Create Account Link**
   - New users can navigate to registration page
   - Smooth transitions between auth pages

### Register Page (`/register`)

**User account creation.**

1. **Form Fields**
   - Full Name
   - Email Address
   - Password
   - Confirm Password

2. **Validation**
   - Real-time error messages
   - Password confirmation matching
   - Email format validation
   - Password minimum length (6 characters)

3. **Existing Account**
   - Link to login if already registered
   - Email uniqueness checking

### Dashboard Page (`/`)

**Main interface for fleet overview.**

**Main interface for fleet overview.**

1. **Stats Section**
   - View KPI cards: Total Benches, Active Benches, Sessions Today, Revenue Today
   - Cards update automatically every 5 minutes

2. **Search & Filter**
   - Search by bench ID in real-time
   - Filters bench grid instantly

3. **Last Refresh Display**
   - Shows relative time since last data poll (e.g., "2m ago")
   - Helpful for monitoring data freshness

4. **Bench Fleet Grid**
   - 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
   - Click any card to view bench details
   - Shows battery %, solar watts, active sessions, daily sessions
   - Color-coded status badge (green/red)

### Bench Details Page (`/bench/:id`)

**Detailed view for a single bench.**

1. **Header Section**
   - Bench ID and current solar generation
   - Last cleaning timestamp
   - Status indicator

2. **Key Metrics**
   - Battery level (current %)
   - Temperature (Celsius)
   - Active sessions count
   - Last cleaning date/time

3. **Charts**
   - Battery level trend (line chart over time)
   - Solar generation trend (area chart over time)

4. **Control Panel**
   - Force Cleaning button
   - Stop Charging button
   - Reboot Device button
   - Maintenance Mode button
   - Update Price button
   - Toast notifications on success/error

### Analytics Page (`/analytics`)

**Fleet-wide performance analysis.**

- **Sessions per Day** — Line chart showing usage trends across week
- **Revenue per Day** — Bar chart showing earnings by day
- Dummy data for demonstration (can integrate real data)

### Alerts Page (`/alerts`)

**Active notification management.**

List of recent alerts with:
- Alert type (Low battery, Offline bench, High temperature)
- Associated bench ID
- Timestamp
- Status badge (warning/offline/error)
- Detailed message

### Settings Page (`/settings`)

**Customization and theme management.**

1. **Color Themes**
   - 6 predefined color sets
   - Slate (Default), Ocean Blue, Purple Storm, Emerald Green, Rose Pink, Indigo Deep
   - Click any theme to apply instantly
   - Visual color preview for each theme

2. **Theme Preview**
   - Live preview of current theme colors
   - Shows primary, accent, success, warning, and danger colors
   - Hex color codes displayed

3. **Theme Persistence**
   - Selected theme automatically saved to localStorage
   - Persists across browser sessions
   - Applied globally to entire dashboard

### Tokens Page (`/tokens`)

**Daily token allocation and usage management.**

1. **Token Dashboard**
   - View available tokens (10 per day)
   - Track used tokens
   - See total allocated tokens (all-time)
   - Check next refresh countdown

2. **Token Usage Progress**
   - Visual progress bar showing daily usage
   - Percentage of tokens consumed
   - Remaining tokens display

3. **Token Benefits**
   - Force Cleaning (1 token)
   - Device Reboot (2 tokens)
   - Maintenance Mode (1 token)
   - Data Export (3 tokens)

4. **Transaction History**
   - View all token transactions from last 7 days
   - Credit and debit tracking
   - Timestamp for each transaction
   - Old transactions (7+ days) automatically removed

---

## Configuration

### Theme Configuration

Customize predefined themes in `src/config/themes.js`:

```javascript
export const COLOR_THEMES = {
  myTheme: {
    name: 'My Custom Theme',
    primary: '#your-color',
    accent: '#your-color',
    warning: '#your-color',
    success: '#your-color',
    danger: '#your-color',
  },
};
```

Add new themes anytime — they'll automatically appear in the Settings page.

### Token Configuration

Customize token settings in `src/services/tokens.js`:

```javascript
// Daily allocation amount
const DAILY_TOKENS = 10;

// Transaction history retention (days)
const TRANSACTION_RETENTION_DAYS = 7;

// Token spending costs
const TOKEN_COSTS = {
  FORCE_CLEANING: 1,        // tokens
  DEVICE_REBOOT: 2,         // tokens
  MAINTENANCE_MODE: 1,      // tokens
  DATA_EXPORT: 3,           // tokens
};
```

Modify these constants to adjust:
- How many tokens users receive daily
- How long transaction history is kept
- Token costs for each action type

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Use production API backend
VITE_API_BASE_URL=https://api.example.com

# Use default empty (mock mode)
# VITE_API_BASE_URL=
```

If `VITE_API_BASE_URL` is set, the app will make real API calls. Otherwise, it uses mock responses.

### Tailwind Configuration

Customize theme in `tailwind.config.js`:

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 40px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
```

### Vite Configuration

Modify `vite.config.js` for custom build settings:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

---

## Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Make Changes
- Components auto-reload with HMR
- Styles update instantly
- Errors appear in browser and console

### 3. Test Changes
- Open `http://localhost:5173`
- Test responsive layout (DevTools)
- Verify dark mode toggle
- Check data polling (5-minute intervals)

### 4. Create Builds
```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### Key Hooks Used

#### `useFetch` (Custom)
Handles data fetching with auto-polling.

```javascript
const { data, loading, error, refresh, updatedAt } = useFetch(
  () => getBenches(),
  [],      // dependencies
  300000   // 5-minute polling interval
);
```

Features:
- Automatic polling at specified intervals
- Loading, error, and data states
- Refresh callback for manual refresh
- Updated timestamp tracking

#### `useState`
Manage component-level state (search input, toast visibility, etc).

#### `useEffect`
Side effects (polling setup, context updates, cleanup).

#### `useCallback`
Memoize functions to prevent unnecessary re-renders.

#### `useMemo`
Memoize computed values (filtered benches, stats calculations).

### Utility Functions

#### `format.js` Functions

```javascript
formatPercent(87)        // "87%"
formatWatts(12.5)        // "12.5 W"
formatCurrency(85.50)    // "$85.50"
formatDateTime(isoStr)   // "Apr 13, 08:14 AM"
formatRelativeTime(ts)   // "2m ago", "45s ago"
```

---

## Browser Support

| Browser | Min Version |
|---------|-----------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

Modern ES2020+ features used. Polyfills required for older browsers.

---

## Performance

### Optimization Strategies

1. **Code Splitting**
   - Vite automatic chunking for lazy-loaded routes
   - Consider dynamic imports for heavy components

2. **Image Optimization**
   - Use SVG for icons (currently in public/icons.svg)
   - Consider WebP for photos

3. **Bundle Size**
   - Current production bundle: ~366 KB (196 KB gzipped)
   - Main dependencies: React (36%), Recharts (45%), Other (19%)

4. **Data Polling**
   - Default 5-minute intervals (300,000ms)
   - Configurable per fetch hook usage

5. **Memoization**
   - React.useMemo for filtered lists and stats
   - React.useCallback for event handlers and fetch functions

### Lighthouse Metrics (Target)
- Performance: 85+
- Accessibility: 90+
- Best Practices: 85+
- SEO: 90+

---

## Future Enhancements

### Completed Features ✅
- [x] User authentication (login/register with context)
- [x] Persistent user preferences (localStorage)
- [x] Dark mode toggle
- [x] Theme customization (6 color themes)
- [x] Daily token allocation system
- [x] Transaction history with 7-day cleanup
- [x] Mock API with simulated delays
- [x] Responsive design across all devices
- [x] Alert management system

### Phase 2
- [ ] Role-based access control (RBAC)
- [ ] Token integration with remote control actions
- [ ] Export data to CSV
- [ ] Real-time WebSocket updates instead of polling
- [ ] Interactive heat map of bench locations
- [ ] Advanced filtering and sorting options
- [ ] Scheduled token-based action limits

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Push notifications for critical alerts
- [ ] Predictive analytics (ML models)
- [ ] Multi-language support (i18n)
- [ ] Advanced reporting and dashboards
- [ ] Scheduled maintenance workflows
- [ ] Real-time collaboration features
- [ ] Token marketplace for premium actions

### Technical Debt
- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Add E2E tests (Cypress or Playwright)
- [ ] Error boundary component for crash handling
- [ ] Service worker for offline support
- [ ] Performance monitoring (Sentry, LogRocket)
- [ ] Analytics integration (Google Analytics, Mixpanel)

---

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Run `npm install` to ensure all dependencies are installed.

### Issue: Styles not applying
**Solution:** Ensure `src/index.css` contains Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Issue: Dark mode not toggling
**Solution:** Check that `UpdateContext.jsx` is wrapping the app in `UpdateProvider`.

### Issue: Data not refreshing
**Solution:** Check browser console for API errors. Verify `useFetch` interval is not 0.

### Issue: Build fails
**Solution:** 
1. Clear `node_modules` and `dist/`
2. Run `npm install` again
3. Run `npm run build`

### Issue: Port 5173 already in use
**Solution:** Kill process or specify different port:
```bash
npm run dev -- --port 3000
```

---

## Hardware (Solar Bench Component)

The Smart Self-Cleaning Solar Charging Station is a compact, standalone public charging station combining solar power generation with integrated phone charging and GSM cellular connectivity. This bench uses a 12V solar panel on the umbrella canopy to charge a 12V lithium battery. 
