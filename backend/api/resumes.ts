import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { connectDB, Resume } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function verifyToken(token: string): string | null {
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

function getAuthHeader(req: VercelRequest): string | null {
  return req.headers.authorization?.split(' ')[1] || null;
}

async function getAllResumes(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();

    const token = getAuthHeader(req);
    const userId = token ? verifyToken(token) : null;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const resumes = await Resume.find({ userId });
    res.json({ success: true, resumes });
  } catch (error: any) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function createResume(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();

    const token = getAuthHeader(req);
    const userId = token ? verifyToken(token) : null;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, template } = req.body;

    const resume = await Resume.create({
      userId,
      title: title || 'My Resume',
      template: template || 'modern'
    });

    res.status(201).json({ success: true, resume });
  } catch (error: any) {
    console.error('Create resume error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateResume(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();

    const token = getAuthHeader(req);
    const userId = token ? verifyToken(token) : null;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;
    const updates = req.body;

    const resume = await Resume.findByIdAndUpdate(id, updates, { new: true });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ success: true, resume });
  } catch (error: any) {
    console.error('Update resume error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteResume(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();

    const token = getAuthHeader(req);
    const userId = token ? verifyToken(token) : null;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;

    await Resume.findByIdAndDelete(id);
    res.json({ success: true, message: 'Resume deleted' });
  } catch (error: any) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getResume(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();

    const token = getAuthHeader(req);
    const userId = token ? verifyToken(token) : null;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;

    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ success: true, resume });
  } catch (error: any) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: error.message });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, query } = req;
  const action = query.action as string;
  const id = query.id as string;

  if (action === 'list' || (!action && method === 'GET' && !id)) {
    return getAllResumes(req, res);
  } else if (action === 'create' || method === 'POST') {
    return createResume(req, res);
  } else if (action === 'update' || method === 'PUT') {
    return updateResume(req, res);
  } else if (action === 'delete' || method === 'DELETE') {
    return deleteResume(req, res);
  } else if (id && method === 'GET') {
    return getResume(req, res);
  }

  res.status(404).json({ error: 'Action not found' });
}
