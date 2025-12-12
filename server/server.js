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

// MongoDB Connection
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      console.log('Note: Make sure to update MONGODB_URI in server/.env with your actual MongoDB Atlas connection string');
    });
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});
