# Smart Solar Bench - Backend Database API

A Node.js + Express backend API for managing solar benches and users in the Smart Solar Bench Dashboard.

## Features

- **RESTful API** for managing benches and users
- **JSON file-based storage** (no external database required)
- **CRUD operations** for benches and users
- **CORS enabled** for frontend integration
- **Real-time data persistence**

## Project Structure

```
backend/
├── server.js              # Express server and API endpoints
├── package.json           # Dependencies configuration
├── data/
│   ├── benches.json       # Benches database
│   └── users.json         # Users database
└── README.md              # This file
```

## Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Running the Server

### Development Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Benches

**Get all benches**
```
GET /api/benches
```

**Get single bench**
```
GET /api/benches/:id
```

**Create new bench**
```
POST /api/benches
Body: {
  bench_id: string (required),
  location: string (required),
  latitude: number (required),
  longitude: number (required),
  battery_percent: number (0-100),
  panel_capacity: number
}
```

**Update bench**
```
PUT /api/benches/:id
Body: { field: value }
```

**Delete bench**
```
DELETE /api/benches/:id
```

### Users

**Get all users** (passwords excluded)
```
GET /api/users
```

**Get single user**
```
GET /api/users/:id
```

**Create new user**
```
POST /api/users
Body: {
  name: string (required),
  email: string (required),
  password: string (required, min 6 chars),
  role: "admin" | "user",
  status: "active" | "inactive"
}
```

**Update user**
```
PUT /api/users/:id
Body: { field: value }
```

**Delete user**
```
DELETE /api/users/:id
```

### Health Check

**Server status**
```
GET /api/health
```

Returns: `{ status: "ok", message: "..." }`

## Database Schema

### Benches Collection
```json
{
  "id": string (timestamp-based ID),
  "bench_id": string (e.g., "PARK-001"),
  "location": string,
  "latitude": number,
  "longitude": number,
  "battery_percent": number (0-100),
  "solar_watts": number,
  "active_sessions": number,
  "daily_sessions": number,
  "temperature": number,
  "status": "online" | "offline",
  "last_cleaning": ISO datetime string,
  "panel_capacity": number,
  "created_at": ISO datetime string,
  "updated_at": ISO datetime string
}
```

### Users Collection
```json
{
  "id": string (timestamp-based ID),
  "email": string (unique),
  "password": string (plain text in demo, should be hashed in production),
  "name": string,
  "role": "admin" | "user",
  "status": "active" | "inactive",
  "created_at": ISO datetime string,
  "updated_at": ISO datetime string
}
```

## Frontend Configuration

To connect the frontend to this backend, set the environment variable in `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

The frontend will automatically use this URL for all API calls.

## Running Both Frontend and Backend

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

## Admin Features

Once logged in as an admin (`admin@example.com` / `password123`), access:

- **Manage Benches** (`/admin/benches`) - View, add, edit, delete benches
- **Manage Users** (`/admin/users`) - View, add, edit, delete users

## Demo Accounts

### Admin (Full Access)
- Email: `admin@example.com`
- Password: `password123`
- Can access all features including admin panel

### Regular Users (Monitoring Only)
- Email: `manager@example.com` or `user@example.com`
- Password: `password123`
- View-only access to benches

## Notes

- **Data Persistence**: All data is stored in JSON files in the `data/` directory
- **No Database Required**: Uses file-based storage for simplicity
- **Production Upgrade**: For production, migrate to MongoDB, PostgreSQL, or similar
- **Security**: Plain text passwords in demo - must be hashed in production
- **CORS Enabled**: API accepts requests from any origin (configure as needed)

## Future Improvements

- [ ] User authentication with JWT tokens
- [ ] Password hashing and salting
- [ ] Database migration (MongoDB/PostgreSQL)
- [ ] Input validation and sanitization
- [ ] Error logging and monitoring
- [ ] Rate limiting
- [ ] API documentation (Swagger)
- [ ] Unit tests
- [ ] Backup and restore functionality

## Troubleshooting

**Port already in use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**CORS errors**
- Ensure `VITE_API_BASE_URL` in frontend matches your backend URL
- Verify CORS middleware is enabled in `server.js`

**Data not updating**
- Check `backend/data/` directory exists and files are readable
- Verify file permissions for `benches.json` and `users.json`

## Support

For issues or questions, check:
1. Backend server is running on port 5000
2. Frontend `.env.local` has correct `VITE_API_BASE_URL`
3. JSON data files exist in `backend/data/`
4. Check browser console for API error messages
