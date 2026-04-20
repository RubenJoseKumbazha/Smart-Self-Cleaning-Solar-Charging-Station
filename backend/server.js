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

// ============ RELAY CONTROL ROUTES ============

// Relay server file path
const relayStatePath = path.join(__dirname, '..', 'Connector', 'relay_server', 'state.txt');

// Get relay state
app.get('/api/relay/state', (req, res) => {
  try {
    const state = fs.readFileSync(relayStatePath, 'utf-8').trim();
    res.json({
      state: state === '1' ? 'ON' : 'OFF',
      value: parseInt(state) || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error reading relay state:', error);
    res.status(500).json({ error: 'Failed to read relay state' });
  }
});

// Set relay state
app.post('/api/relay/state', (req, res) => {
  try {
    const { state } = req.body;
    const value = state === 'ON' || state === '1' || state === 1 ? '1' : '0';
    
    fs.writeFileSync(relayStatePath, value, 'utf-8');
    
    res.json({
      state: value === '1' ? 'ON' : 'OFF',
      value: parseInt(value),
      timestamp: new Date().toISOString(),
      message: 'Relay state updated'
    });
  } catch (error) {
    console.error('Error setting relay state:', error);
    res.status(500).json({ error: 'Failed to set relay state' });
  }
});

// Toggle relay
app.post('/api/relay/toggle', (req, res) => {
  try {
    const current = fs.readFileSync(relayStatePath, 'utf-8').trim();
    const newValue = current === '1' ? '0' : '1';
    
    fs.writeFileSync(relayStatePath, newValue, 'utf-8');
    
    res.json({
      state: newValue === '1' ? 'ON' : 'OFF',
      value: parseInt(newValue),
      timestamp: new Date().toISOString(),
      message: 'Relay toggled'
    });
  } catch (error) {
    console.error('Error toggling relay:', error);
    res.status(500).json({ error: 'Failed to toggle relay' });
  }
});

// ============ SESSIONS ROUTES (Token-Based Charging) ============

const sessionsPath = path.join(__dirname, 'data', 'sessions.json');
const TOKENS_PER_HOUR = 3;
const DEFAULT_DURATION_HOURS = 1;

// Initialize sessions file if not exists
if (!fs.existsSync(sessionsPath)) {
  fs.writeFileSync(sessionsPath, JSON.stringify([], null, 2), 'utf-8');
}

// Get bench by bench_id (instead of database id)
const getBenchByBenchId = (benchId) => {
  const benches = readFile(benchesPath);
  return benches.find(b => b.bench_id === benchId);
};

// Update bench by bench_id
const updateBenchByBenchId = (benchId, updates) => {
  const benches = readFile(benchesPath);
  const benchIndex = benches.findIndex(b => b.bench_id === benchId);
  
  if (benchIndex === -1) return false;
  
  benches[benchIndex] = {
    ...benches[benchIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  return writeFile(benchesPath, benches);
};

// Register/Update bench (from ESP32)
app.post('/api/benches-telemetry', (req, res) => {
  const { bench_id, battery_percent, solar_watts, temperature, status } = req.body;
  
  if (!bench_id) {
    return res.status(400).json({ error: 'bench_id is required' });
  }
  
  let benches = readFile(benchesPath);
  let benchIndex = benches.findIndex(b => b.bench_id === bench_id);
  
  if (benchIndex === -1) {
    // Create new bench if doesn't exist
    const newBench = {
      id: Date.now().toString(),
      bench_id,
      location: req.body.location || 'Unknown',
      latitude: req.body.latitude || 0,
      longitude: req.body.longitude || 0,
      battery_percent: battery_percent || 50,
      solar_watts: solar_watts || 0,
      temperature: temperature || 25,
      status: status || 'online',
      active_sessions: 0,
      daily_sessions: 0,
      panel_capacity: req.body.panel_capacity || 200,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    benches.push(newBench);
    writeFile(benchesPath, benches);
    return res.status(201).json({ ...newBench, message: 'Bench registered' });
  }
  
  // Update existing bench
  benches[benchIndex] = {
    ...benches[benchIndex],
    battery_percent: battery_percent !== undefined ? battery_percent : benches[benchIndex].battery_percent,
    solar_watts: solar_watts !== undefined ? solar_watts : benches[benchIndex].solar_watts,
    temperature: temperature !== undefined ? temperature : benches[benchIndex].temperature,
    status: status || benches[benchIndex].status,
    updated_at: new Date().toISOString(),
  };
  
  if (writeFile(benchesPath, benches)) {
    res.json({ ...benches[benchIndex], message: 'Bench telemetry updated' });
  } else {
    res.status(500).json({ error: 'Failed to update bench' });
  }
});

// Get bench by bench_id
app.get('/api/benches/bench/:benchId', (req, res) => {
  const bench = getBenchByBenchId(req.params.benchId);
  
  if (!bench) {
    return res.status(404).json({ error: 'Bench not found' });
  }
  
  const sessions = readFile(sessionsPath).filter(s => s.bench_id === req.params.benchId && s.status === 'active');
  
  res.json({
    ...bench,
    active_sessions: sessions.length,
    can_charge: bench.status === 'online' && sessions.length < 5, // Max 5 concurrent sessions
    available: bench.status === 'online',
  });
});

// Start charging session (with token payment)
app.post('/api/sessions/start', (req, res) => {
  const { bench_id, user_id, duration_hours = DEFAULT_DURATION_HOURS, tokens_required = TOKENS_PER_HOUR } = req.body;
  
  if (!bench_id || !user_id) {
    return res.status(400).json({ error: 'bench_id and user_id are required' });
  }
  
  // Check if bench exists and is online
  const bench = getBenchByBenchId(bench_id);
  if (!bench) {
    return res.status(400).json({ error: 'Bench not found', bench_id });
  }
  
  if (bench.status !== 'online') {
    return res.status(400).json({ 
      error: 'Bench not available', 
      bench_id, 
      status: bench.status 
    });
  }
  
  // Check if bench already has max sessions
  const sessions = readFile(sessionsPath).filter(s => s.bench_id === bench_id && s.status === 'active');
  if (sessions.length >= 5) {
    return res.status(400).json({ 
      error: 'Maximum concurrent sessions reached',
      bench_id,
      current_sessions: sessions.length
    });
  }
  
  // Check if user has enough tokens
  let users = readFile(usersPath);
  const user = users.find(u => u.id === user_id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found', user_id });
  }
  
  const userTokens = user.tokens || 0;
  if (userTokens < tokens_required) {
    return res.status(400).json({ 
      error: 'Insufficient tokens',
      user_id,
      available_tokens: userTokens,
      required_tokens: tokens_required
    });
  }
  
  // Deduct tokens from user
  const userIndex = users.findIndex(u => u.id === user_id);
  users[userIndex].tokens = (users[userIndex].tokens || 0) - tokens_required;
  
  // Store token transaction
  if (!users[userIndex].token_transactions) {
    users[userIndex].token_transactions = [];
  }
  users[userIndex].token_transactions.push({
    type: 'deduct',
    amount: tokens_required,
    reason: `Charging session at ${bench_id}`,
    timestamp: new Date().toISOString(),
  });
  
  writeFile(usersPath, users);
  
  // Create session
  let allSessions = readFile(sessionsPath);
  const sessionId = 'sess_' + Date.now();
  const startTime = new Date();
  const expiresAt = new Date(startTime.getTime() + duration_hours * 60 * 60 * 1000);
  
  const newSession = {
    session_id: sessionId,
    bench_id,
    user_id,
    started_at: startTime.toISOString(),
    expires_at: expiresAt.toISOString(),
    duration_hours,
    tokens_deducted: tokens_required,
    status: 'active',
    charging: true,
  };
  
  allSessions.push(newSession);
  writeFile(sessionsPath, allSessions);
  
  // Update bench active_sessions counter
  updateBenchByBenchId(bench_id, { 
    active_sessions: sessions.length + 1,
    daily_sessions: (bench.daily_sessions || 0) + 1,
  });
  
  res.status(200).json({
    session_id: sessionId,
    bench_id,
    user_id,
    status: 'active',
    charging: true,
    tokens_deducted: tokens_required,
    expires_at: expiresAt.toISOString(),
    message: 'Charging session started - tokens deducted'
  });
});

// End charging session
app.post('/api/sessions/end', (req, res) => {
  const { session_id, bench_id, user_id } = req.body;
  
  if (!session_id || !bench_id) {
    return res.status(400).json({ error: 'session_id and bench_id are required' });
  }
  
  let sessions = readFile(sessionsPath);
  const sessionIndex = sessions.findIndex(s => s.session_id === session_id);
  
  if (sessionIndex === -1) {
    return res.status(404).json({ error: 'Session not found', session_id });
  }
  
  const session = sessions[sessionIndex];
  const duration = Math.round((new Date() - new Date(session.started_at)) / 60000); // minutes
  
  sessions[sessionIndex] = {
    ...session,
    status: 'completed',
    charging: false,
    ended_at: new Date().toISOString(),
    duration_minutes: duration,
  };
  
  writeFile(sessionsPath, sessions);
  
  // Update bench
  const bench = getBenchByBenchId(bench_id);
  const activeSessions = sessions.filter(s => s.bench_id === bench_id && s.status === 'active').length;
  updateBenchByBenchId(bench_id, { 
    active_sessions: Math.max(0, activeSessions),
  });
  
  res.json({
    session_id,
    bench_id,
    status: 'completed',
    charging: false,
    duration_minutes: duration,
    tokens_used: session.tokens_deducted,
    message: 'Session ended'
  });
});

// Get bench sessions
app.get('/api/benches/bench/:benchId/sessions', (req, res) => {
  const sessions = readFile(sessionsPath);
  const benchSessions = sessions.filter(s => s.bench_id === req.params.benchId);
  
  res.json(benchSessions);
});

// Get active sessions for a bench
app.get('/api/benches/bench/:benchId/sessions/active', (req, res) => {
  const sessions = readFile(sessionsPath);
  const activeSessions = sessions.filter(s => s.bench_id === req.params.benchId && s.status === 'active');
  
  res.json(activeSessions);
});

// Check if bench is available for charging
app.get('/api/benches/bench/:benchId/availability', (req, res) => {
  const bench = getBenchByBenchId(req.params.benchId);
  
  if (!bench) {
    return res.status(404).json({ error: 'Bench not found' });
  }
  
  const sessions = readFile(sessionsPath).filter(s => s.bench_id === req.params.benchId && s.status === 'active');
  const maxConcurrentSessions = 5;
  
  res.json({
    bench_id: req.params.benchId,
    available: bench.status === 'online',
    can_charge: bench.status === 'online' && sessions.length < maxConcurrentSessions,
    status: bench.status,
    battery_percent: bench.battery_percent,
    active_sessions: sessions.length,
    max_concurrent_sessions: maxConcurrentSessions,
    reason: bench.status === 'offline' ? 'Bench is offline' : 
            sessions.length >= maxConcurrentSessions ? 'Maximum sessions reached' : 'Available',
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Solar Bench API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Smart Solar Bench Backend running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Relay API available at http://localhost:${PORT}/api/relay`);
});
