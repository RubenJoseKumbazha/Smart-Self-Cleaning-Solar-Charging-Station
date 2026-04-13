# Quick Start Guide

## Complete Setup (Backend + Frontend)

This guide will help you get the entire application running with the database in under 5 minutes.

### Step 1: Clone/Download Project

```bash
cd /path/to/Smart-Self-Cleaning-Solar-Charging-Station
```

### Step 2: Install Dependencies (Terminal 1)

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

cd ..
```

### Step 3: Run Backend (Terminal 1)

```bash
cd backend
npm start
```

**Expected Output:**
```
Smart Solar Bench Backend running on http://localhost:5000
API available at http://localhost:5000/api
```

### Step 4: Run Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 5: Open Application

Open `http://localhost:5173` in your browser

---

## Demo Credentials

### Admin Account (Full Access)
- **Email:** `admin@example.com`
- **Password:** `password123`
- **Access:** Dashboard + Admin Panel for managing benches and users

### User Account (Monitoring Only)
- **Email:** `manager@example.com`
- **Password:** `password123`
- **Access:** View-only monitoring dashboard

---

## What You Can Do

### As Admin:
1. **View Dashboard** - Fleet overview with real-time stats
2. **Manage Benches** - View, add, edit, delete solar benches
   - Go to: Sidebar → Admin Panel → Manage Benches
3. **Manage Users** - View, add, edit, delete user accounts
   - Go to: Sidebar → Admin Panel → Manage Users
4. **View Analytics** - Fleet performance trends
5. **Check Alerts** - System notifications
6. **Monitor Tokens** - Daily token allocation and usage
7. **Customize Theme** - Change colors (6 themes available)

### As Regular User:
1. **View Dashboard** - Monitoring-only view of benches
2. **View Details** - Click any bench for detailed metrics
3. **Check Analytics** - View fleet trends
4. **Monitor Alerts** - View system alerts
5. **Check Tokens** - Daily token tracking
6. **Customize Theme** - Change colors

---

## API Endpoints

The backend provides a REST API for all data operations:

**Base URL:** `http://localhost:5000/api`

### Benches
- `GET /benches` - List all benches
- `POST /benches` - Create new bench
- `PUT /benches/:id` - Update bench
- `DELETE /benches/:id` - Delete bench

### Users
- `GET /users` - List all users (without passwords)
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Health Check
- `GET /health` - API status

---

## Data Persistence

All data is automatically saved to JSON files:

- **Benches:** `backend/data/benches.json`
- **Users:** `backend/data/users.json`

Data persists across server restarts. Modify these files directly if needed.

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Or for port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### API Connection Errors
1. Ensure backend is running on port 5000
2. Check `frontend/.env.local` has correct `VITE_API_BASE_URL`
3. Check browser console (F12) for error details

### Data Not Saving
1. Ensure `backend/data/` directory exists
2. Check file permissions for `benches.json` and `users.json`
3. Restart backend server

### Frontend showing "Admin dashboard"
1. Use admin account: `admin@example.com`
2. Or regular user: `manager@example.com`

---

## Next Steps

1. **Explore the Admin Panel**
   - Login as admin
   - Try adding a new bench
   - Try creating a new user

2. **Test Different Features**
   - Switch between admin and user accounts
   - View bench details and control options
   - Check token tracking and analytics

3. **Customize**
   - Change application theme in Settings
   - Review and modify bench data
   - Review and modify user accounts

4. **Deploy (Optional)**
   - Build frontend: `cd frontend && npm run build`
   - Deploy `frontend/dist/` folder to web server
   - Deploy backend to Node.js hosting (Heroku, Railway, etc.)

---

## Key Features Implemented

✅ **Dual Dashboard System**
- Admin: Fleet management with CRUD operations
- User: Monitoring-only view

✅ **Database with CRUD Operations**
- Manage benches (Add, View, Edit, Delete)
- Manage users (Add, View, Edit, Delete)
- Real-time data persistence

✅ **Admin Panel Pages**
- `/admin/benches` - Bench management
- `/admin/users` - User management

✅ **Authentication**
- Login with different roles
- Session persistence

✅ **Token System**
- Daily token allocation (10 tokens/day)
- Transaction history (7-day retention)
- Visible in sidebar and dedicated page

✅ **Theme Customization**
- 6 color themes
- Dark mode toggle
- Settings page

✅ **Real-time Monitoring**
- Battery levels, solar generation
- Active sessions and revenue
- Alert notifications

---

## Support

For detailed information, see:
- [Main README](./README.md) - Comprehensive documentation
- [Backend README](./backend/README.md) - Backend API documentation
- [Frontend README](./frontend/README.md) - Frontend setup

---

**Happy monitoring! 🌞**
