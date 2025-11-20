import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-builder';

let isConnected: boolean | mongoose.Connection = false;

export async function connectDB() {
  // If already connected, return immediately
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return isConnected;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      w: 'majority',
    });

    isConnected = conn.connection;
    console.log('✅ MongoDB Connected successfully');
    return isConnected;
  } catch (error: any) {
    console.error('❌ MongoDB Connection Error:', error.message);
    isConnected = false;
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
}

// Close connection function (for cleanup)
export async function closeDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('✅ MongoDB Disconnected');
  }
}

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Resume Schema
const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },
  template: { type: String, default: 'modern' },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  summary: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
