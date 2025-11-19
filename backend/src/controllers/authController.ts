import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import User from '../models/User'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    const hashedPassword = await bcryptjs.hash(password, 10)
    const user = new User({
      email,
      password: hashedPassword,
      name,
    })

    await user.save()

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, email: user.email, name: user.name },
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email, name: user.name },
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
