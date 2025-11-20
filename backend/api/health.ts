import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Try to connect to MongoDB
    await connectDB();
    
    res.status(200).json({
      status: 'OK',
      message: 'Server and database are running',
      timestamp: new Date().toISOString(),
      mongodb: 'Connected'
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
