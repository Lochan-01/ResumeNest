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
