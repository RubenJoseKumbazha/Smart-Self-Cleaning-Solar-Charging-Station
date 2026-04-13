const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUsers = [
  { id: '1', email: 'admin@example.com', password: 'password123', name: 'Admin User', role: 'admin' },
  { id: '2', email: 'manager@example.com', password: 'password123', name: 'Manager User', role: 'user' },
  { id: '3', email: 'user@example.com', password: 'password123', name: 'Demo User', role: 'user' },
];

export async function loginUser(email, password) {
  await delay(600);

  const user = mockUsers.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    token: `token_${user.id}_${Date.now()}`,
  };
}

export async function registerUser(name, email, password) {
  await delay(800);

  const exists = mockUsers.some((u) => u.email === email);
  if (exists) {
    throw new Error('Email already registered');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const newUser = {
    id: String(mockUsers.length + 1),
    email,
    password,
    name,
    role: 'user',
  };

  mockUsers.push(newUser);

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    token: `token_${newUser.id}_${Date.now()}`,
  };
}
