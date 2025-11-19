// Shared types between frontend and backend

export interface Resume {
  id: string
  userId: string
  title: string
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  summary: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  template: 'modern' | 'classic' | 'minimal'
  createdAt: Date
  updatedAt: Date
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
}

export interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface SuggestionRequest {
  section: string
  content: string
}

export interface SuggestionResponse {
  suggestions: string[]
}
