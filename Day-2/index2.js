// index.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'change_this_secret_in_.env';

app.use(cors());
app.use(express.json());

/* ------------- In-memory users ------------- */
const users = [
  { id: 1, username: 'alice', name: 'Alice', email: 'alice@example.com', address: '123 A St' },
  { id: 2, username: 'bob', name: 'Bob', email: 'bob@example.com', address: '456 B Ave' },
  { id: 3, username: 'charlie', name: 'Charlie', email: 'charlie@example.com', address: '789 C Rd' }
];

/* ------------- Auth helpers + middleware ------------- */
function generateToken(payload, opts = { expiresIn: '1h' }) {
  return jwt.sign(payload, SECRET, opts);
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No Authorization header provided' });

  const token = (typeof authHeader === 'string' && authHeader.startsWith('Bearer '))
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) return res.status(401).json({ message: 'Token missing or malformed' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // should contain at least { id, username, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', error: err.message });
    }
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
}

/* ------------- Auth endpoints (login) ------------- */
/**
 * Login endpoint for demo:
 * Send { "id": 1, "username": "alice", "role": "user" } in body to get a token.
 * In real app verify credentials against DB.
 */
app.post('/login', (req, res) => {
  const { id, username, role } = req.body;
  if (!id || !username) return res.status(400).json({ message: 'id and username required' });

  const payload = { id, username, role: role || 'user' }; // include user id in token
  const token = generateToken(payload, { expiresIn: '2h' });
  return res.json({ token });
});

/* ------------- Public endpoints ------------- */
app.get('/users', (req, res) => res.json(users));
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const u = users.find(x => x.id === id);
  if (!u) return res.status(404).json({ message: 'User not found' });
  res.json(u);
});

/* ------------- Create user ------------- */
app.post('/users', (req, res) => {
  const { id, username, name, email, address } = req.body;
  if (!id || !username || !name) return res.status(400).json({ message: 'id, username and name required' });
  if (users.some(u => u.id === id)) return res.status(409).json({ message: 'User id already exists' });
  if (users.some(u => u.username === username)) return res.status(409).json({ message: 'Username already exists' });

  const newUser = { id, username, name, email: email || null, address: address || null };
  users.push(newUser);
  res.status(201).json({ message: 'User created', user: newUser });
});

/* ------------- Update user (partial) ------------- */
/**
 * PATCH /users/:id
 * - Protected: only the owner (req.user.id === :id) OR role 'admin' can update
 * - Allows partial update of fields: id, username, name, email, address, etc.
 * - If id is changed, we ensure new id is unique.
 * - IMPORTANT: If the user changes their id, their existing token will still contain the old id.
 *   They should re-login to get a token with the new id.
 */
app.patch('/users/:id', authMiddleware, (req, res) => {
  const targetId = Number(req.params.id);
  const updater = req.user; // from token

  // authorization: owner or admin
  if (!(updater.role === 'admin' || updater.id === targetId)) {
    return res.status(403).json({ message: 'Forbidden: you can only update your own profile' });
  }

  const userIndex = users.findIndex(u => u.id === targetId);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  const allowedFields = ['id', 'username', 'name', 'email', 'address'];
  const updates = req.body;

  // If client wants to change id, check uniqueness
  if (updates.id !== undefined) {
    const newId = Number(updates.id);
    if (Number.isNaN(newId)) return res.status(400).json({ message: 'id must be a number' });
    if (users.some(u => u.id === newId && u.id !== targetId)) {
      return res.status(409).json({ message: 'New id already in use' });
    }
    users[userIndex].id = newId;
  }

  // Apply other allowed updates
  for (const key of Object.keys(updates)) {
    if (!allowedFields.includes(key)) continue;
    if (key === 'id') continue; // already handled
    if (key === 'username') {
      // prevent username collision
      if (users.some(u => u.username === updates.username && u.id !== users[userIndex].id)) {
        return res.status(409).json({ message: 'Username already in use' });
      }
    }
    users[userIndex][key] = updates[key];
  }

  const updatedUser = users[userIndex];

  // If the caller updated their own id, note that their token is stale.
  const note = (updater.id !== updatedUser.id && updater.id === targetId)
    ? 'Your id was changed — please re-login to obtain a token with the new id.'
    : undefined;

  return res.json({ message: 'User updated', user: updatedUser, note });
});

/* ------------- Replace user (full replace) ------------- */
/**
 * Optional: PUT /users/:id to fully replace a user object.
 * Implement similarly to PATCH but require the full user object in body.
 */
app.put('/users/:id', authMiddleware, (req, res) => {
  const targetId = Number(req.params.id);
  const updater = req.user;
  if (!(updater.role === 'admin' || updater.id === targetId)) {
    return res.status(403).json({ message: 'Forbidden: you can only replace your own profile' });
  }
  const userIndex = users.findIndex(u => u.id === targetId);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  const { id, username, name, email, address } = req.body;
  if (!id || !username || !name) return res.status(400).json({ message: 'id, username, name are required' });

  // check unique id/username if changed
  if (id !== targetId && users.some(u => u.id === id)) return res.status(409).json({ message: 'id already exists' });
  if (users.some(u => u.username === username && u.id !== targetId)) return res.status(409).json({ message: 'username already exists' });

  users[userIndex] = { id, username, name, email: email || null, address: address || null };

  const note = (updater.id !== id && updater.id === targetId)
    ? 'Your id was changed — please re-login to obtain a token with the new id.'
    : undefined;

  return res.json({ message: 'User replaced', user: users[userIndex], note });
});

/* ------------- Delete user(s) ------------- */
app.delete('/users/:id', authMiddleware, (req, res) => {
  const targetId = Number(req.params.id);
  const updater = req.user;

  // Only admin or owner can delete
  if (!(updater.role === 'admin' || updater.id === targetId)) {
    return res.status(403).json({ message: 'Forbidden: you can only delete your own account' });
  }

  const idx = users.findIndex(u => u.id === targetId);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });

  const removed = users.splice(idx, 1)[0];
  return res.json({ message: 'User deleted', user: removed });
});

app.delete('/users', authMiddleware, (req, res) => {
  // Only admin can delete all users
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: only admin can delete all users' });
  users.length = 0;
  return res.json({ message: 'All users deleted' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
