import { Request, Response } from 'express'
import Resume from '../models/Resume'

export const getResumes = async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const resumes = await Resume.find({ userId })
    res.json({ success: true, resumes })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createResume = async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const { title, template = 'modern' } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const resume = new Resume({
      userId,
      title,
      template,
    })

    await resume.save()
    res.status(201).json({ success: true, resume })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getResume = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const resume = await Resume.findById(id)

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    if (resume.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    res.json({ success: true, resume })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateResume = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const resume = await Resume.findById(id)

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    if (resume.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    Object.assign(resume, req.body)
    await resume.save()

    res.json({ success: true, resume })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteResume = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const resume = await Resume.findById(id)

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    if (resume.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    await Resume.findByIdAndDelete(id)
    res.json({ success: true, message: 'Resume deleted' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
