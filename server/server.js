import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import resumesRoutes from "./routes/resumes.js";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// ====== MONGO CONNECTION ======
if (!MONGODB_URI) {
  console.warn("MONGODB_URI not found in environment variables!");
} else {
  // Warn if DB name is missing
  try {
    const hasDbName = MONGODB_URI.match(/mongodb\.net\/([a-zA-Z0-9_-]+)/);
    if (!hasDbName) {
      console.warn("⚠️ WARNING: Your MongoDB URI is missing the database name.");
    }
  } catch (_) {}

  mongoose
    .connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      console.log(
        "Possible causes: wrong credentials, no DB name, or IP not whitelisted."
      );
    });

  mongoose.connection.on("connected", () =>
    console.log("Mongoose: connection established")
  );
  mongoose.connection.on("error", (err) =>
    console.error("Mongoose connection error:", err.message)
  );
  mongoose.connection.on("disconnected", () =>
    console.warn("Mongoose: disconnected")
  );
}

// ====== ROUTES ======

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumesRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// --- DEBUG ROUTES (remove in production) ---

// Echo route
app.post("/api/debug/echo", (req, res) => {
  res.json({ body: req.body });
});

// Create test user
app.post("/api/debug/create-user", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email & password required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    return res.json({
      ok: true,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Fetch user
app.get("/api/debug/user/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const user = await User.findOne({ email }).lean();
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ====== START SERVER ======
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
