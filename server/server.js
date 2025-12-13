import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import resumesRoutes from './routes/resumes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with improved diagnostics
if (MONGODB_URI) {
  // Helpful check: ensure a database name is present in the URI (after the hostname)
  try {
    const uriPath = MONGODB_URI.split('.mongodb.net')[1] || '';
    if (uriPath === '/' || uriPath.trim() === '' || uriPath.startsWith('/?') || uriPath.startsWith('/?appName')) {
      console.warn('WARNING: Your MONGODB_URI appears to be missing the target database name.');
      console.warn('Example correct format: mongodb+srv://<user>:<pass>@cluster0.sbqisyq.mongodb.net/resumenest?retryWrites=true&w=majority');
    }
  } catch (e) {
    // ignore parsing errors
  }

  mongoose.connect(MONGODB_URI, {
    // Mongoose v8 uses sensible defaults; include explicit options for clarity
    serverSelectionTimeoutMS: 10000,
  }).then(() => {
    console.log('Connected to MongoDB Atlas');
  }).catch((error) => {
    console.error('MongoDB connection error:', error && error.message ? error.message : error);
    console.log('Common causes: wrong credentials, missing database name in URI, or IP not whitelisted in Atlas.');
    console.log('Please verify `server/.env` MONGODB_URI and Atlas network access settings.');
  });

  // Connection event diagnostics
  mongoose.connection.on('connected', () => console.log('Mongoose: connection established'));
  mongoose.connection.on('error', (err) => console.error('Mongoose connection error event:', err && err.message ? err.message : err));
  mongoose.connection.on('disconnected', () => console.warn('Mongoose: disconnected'));
} else {
  console.warn('MONGODB_URI not found in environment variables');
  console.log('Please update server/.env with your MongoDB Atlas connection string');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// --- DEBUG ROUTES: add for quick testing, REMOVE after debugging ---
import bcrypt from 'bcryptjs';
import User from './models/User.js'; // ← adjust path if your user model is elsewhere

// Echo route — verifies backend receives JSON
app.post('/api/debug/echo', (req, res) => {
  res.json({ body: req.body });
});

// Create test user (temporary) — hashes password and creates user
app.post('/api/debug/create-user', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email & password required' });

    // do not create duplicate for safety
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    // adjust field names to match your schema (password or passwordHash)
    const user = await User.create({ email, password: hashed });
    return res.json({ ok: true, user: { id: user._id, email: user.email } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Debug: fetch user by email (shows stored fields; do NOT leave in production)
app.get('/api/debug/user/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const user = await User.findOne({ email }).lean();
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
// --- END DEBUG ROUTES ---

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});
