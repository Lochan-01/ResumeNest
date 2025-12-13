import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import resumesRoutes from "./routes/resumes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// ====== MIDDLEWARE ======
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // restrict in production
  })
);
app.use(express.json());

// ====== MONGO CONNECTION ======
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
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

// ====== ROUTES ======
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumesRoutes);

// Health check (keep this)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ====== START SERVER ======
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
