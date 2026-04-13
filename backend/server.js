import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database file paths
const benchesPath = path.join(__dirname, 'data', 'benches.json');
const usersPath = path.join(__dirname, 'data', 'users.json');

// Utility functions for file operations
const readFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
};

const writeFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
};

// ============ BENCHES ROUTES ============

// Get all benches
app.get('/api/benches', (req, res) => {
  const benches = readFile(benchesPath);
  res.json(benches);
});

// Get single bench by ID
app.get('/api/benches/:id', (req, res) => {
  const benches = readFile(benchesPath);
  const bench = benches.find(b => b.id === req.params.id);
  if (!bench) {
    return res.status(404).json({ error: 'Bench not found' });
  }
  res.json(bench);
});

// Create new bench
app.post('/api/benches', (req, res) => {
  const benches = readFile(benchesPath);
  const newBench = {
    id: Date.now().toString(),
    ...req.body,
    battery_percent: parseInt(req.body.battery_percent) || 50,
    solar_watts: 0,
    active_sessions: 0,
    daily_sessions: 0,
    temperature: 20,
    status: 'online',
    last_cleaning: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  benches.push(newBench);
  if (writeFile(benchesPath, benches)) {
    res.status(201).json(newBench);
  } else {
    res.status(500).json({ error: 'Failed to create bench' });
  }
});

// Update bench
app.put('/api/benches/:id', (req, res) => {
  const benches = readFile(benchesPath);
  const benchIndex = benches.findIndex(b => b.id === req.params.id);
  
  if (benchIndex === -1) {
    return res.status(404).json({ error: 'Bench not found' });
  }

  benches[benchIndex] = {
    ...benches[benchIndex],
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  if (writeFile(benchesPath, benches)) {
    res.json(benches[benchIndex]);
  } else {
    res.status(500).json({ error: 'Failed to update bench' });
  }
});

// Delete bench
app.delete('/api/benches/:id', (req, res) => {
  const benches = readFile(benchesPath);
  const benchIndex = benches.findIndex(b => b.id === req.params.id);
  
  if (benchIndex === -1) {
    return res.status(404).json({ error: 'Bench not found' });
  }

  const deleted = benches.splice(benchIndex, 1);
  
  if (writeFile(benchesPath, benches)) {
    res.json({ message: 'Bench deleted', deleted: deleted[0] });
  } else {
    res.status(500).json({ error: 'Failed to delete bench' });
  }
});

// ============ USERS ROUTES ============

// Get all users
app.get('/api/users', (req, res) => {
  const users = readFile(usersPath);
  // Don't send passwords in list
  const safeUsers = users.map(({ password, ...user }) => user);
  res.json(safeUsers);
});

// Get single user by ID
app.get('/api/users/:id', (req, res) => {
  const users = readFile(usersPath);
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

// Create new user
app.post('/api/users', (req, res) => {
  const users = readFile(usersPath);
  
  // Check if email already exists
  if (users.some(u => u.email === req.body.email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    ...req.body,
    role: req.body.role || 'user',
    status: req.body.status || 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  users.push(newUser);
  if (writeFile(usersPath, users)) {
    const { password, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  } else {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const users = readFile(usersPath);
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  if (writeFile(usersPath, users)) {
    const { password, ...safeUser } = users[userIndex];
    res.json(safeUser);
  } else {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const users = readFile(usersPath);
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const deletedUser = users.splice(userIndex, 1)[0];
  
  if (writeFile(usersPath, users)) {
    const { password, ...safeUser } = deletedUser;
    res.json({ message: 'User deleted', deleted: safeUser });
  } else {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Solar Bench API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Smart Solar Bench Backend running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
