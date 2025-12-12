import express from 'express';
import Resume from '../models/Resume.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Create a new resume
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, data } = req.body;
    if (!data) return res.status(400).json({ message: 'Resume data is required' });

    const resume = new Resume({ userId, title: title || 'Untitled Resume', data });
    await resume.save();
    res.status(201).json(resume);
  } catch (err) {
    console.error('Create resume error:', err);
    res.status(500).json({ message: 'Server error while saving resume' });
  }
});

// Get all resumes for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (err) {
    console.error('Fetch resumes error:', err);
    res.status(500).json({ message: 'Server error while fetching resumes' });
  }
});

// Get a specific resume
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const resume = await Resume.findOne({ _id: req.params.id, userId });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    console.error('Get resume error:', err);
    res.status(500).json({ message: 'Server error while getting resume' });
  }
});

// Update a resume
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, data } = req.body;
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: { title, data, updatedAt: Date.now() } },
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    console.error('Update resume error:', err);
    res.status(500).json({ message: 'Server error while updating resume' });
  }
});

// Delete a resume
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Resume.findOneAndDelete({ _id: req.params.id, userId });
    if (!result) return res.status(404).json({ message: 'Resume not found' });
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    console.error('Delete resume error:', err);
    res.status(500).json({ message: 'Server error while deleting resume' });
  }
});

export default router;
