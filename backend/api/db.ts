import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-builder';

let isConnected: boolean | mongoose.Connection = false;
let connectionAttempts = 0;
const MAX_RETRIES = 3;

// Log connection details (sanitize password)
function logConnectionInfo() {
  const sanitized = mongoUri.replace(/:[^:@]+@/, ':****@');
  console.log('🔌 MongoDB URI:', sanitized);
  console.log('📍 Environment:', process.env.NODE_ENV);
}

export async function connectDB() {
  // If already connected, return immediately
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return isConnected;
  }

  connectionAttempts++;
  console.log(`\n🔄 MongoDB Connection Attempt ${connectionAttempts}/${MAX_RETRIES}...`);
  logConnectionInfo();

  try {
    if (!mongoUri.includes('mongodb')) {
      throw new Error('Invalid MongoDB URI - must start with mongodb:// or mongodb+srv://');
    }

    console.log('⏳ Attempting connection...');
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,    // 10 seconds to select server
      socketTimeoutMS: 45000,              // 45 seconds for socket operations
      family: 4,                           // Use IPv4
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 10000,             // 10 seconds to establish connection
    });

    isConnected = conn.connection;
    connectionAttempts = 0; // Reset on success
    console.log('✅ MongoDB Connected successfully!');
    console.log('📊 Database:', mongoose.connection.db?.databaseName);
    console.log('🏠 Host:', mongoUri.includes('localhost') ? 'Localhost' : 'MongoDB Atlas');
    return isConnected;
  } catch (error: any) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Details:', error.reason || error.message);

    isConnected = false;

    // Provide helpful suggestions
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Hint: Cannot reach MongoDB. Check if:');
      console.error('   - MongoDB Atlas: IP whitelist allows 0.0.0.0/0');
      console.error('   - Local MongoDB: mongod service is running');
    } else if (error.message.includes('authentication failed')) {
      console.error('💡 Hint: Check username and password in MONGODB_URI');
    } else if (error.message.includes('Invalid record')) {
      console.error('💡 Hint: Check cluster name in connection string');
    }

    // Retry logic
    if (connectionAttempts < MAX_RETRIES) {
      console.log(`⏳ Retrying in 2 seconds... (${connectionAttempts}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return connectDB();
    }

    throw new Error(`MongoDB connection failed after ${MAX_RETRIES} attempts: ${error.message}`);
  }
}

// Close connection function (for cleanup)
export async function closeDB() {
  try {
    if (isConnected || mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      isConnected = false;
      console.log('✅ MongoDB Disconnected');
    }
  } catch (error: any) {
    console.error('Error disconnecting:', error.message);
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
