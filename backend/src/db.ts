import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-builder'
    console.log('📡 Connecting to MongoDB...')
    await mongoose.connect(mongoUri)
    console.log('✅ MongoDB connected successfully')
  } catch (error: any) {
    console.warn('⚠️  MongoDB connection warning:', error.message)
    console.log('ℹ️  Server will run without database')
  }
}

export default connectDB
