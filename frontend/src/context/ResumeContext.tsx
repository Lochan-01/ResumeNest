import React, { createContext, useContext, ReactNode } from 'react'

export interface Resume {
  id: string
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
  createdAt: string
  updatedAt: string
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

interface ResumeContextType {
  resume: Resume | null
  setResume: (resume: Resume) => void
  updateResume: (updates: Partial<Resume>) => void
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resume, setResumeState] = React.useState<Resume | null>(null)

  const setResume = (newResume: Resume) => {
    setResumeState(newResume)
  }

  const updateResume = (updates: Partial<Resume>) => {
    setResumeState(prev => (prev ? { ...prev, ...updates } : null))
  }

  return (
    <ResumeContext.Provider value={{ resume, setResume, updateResume }}>
      {children}
    </ResumeContext.Provider>
  )
}

export const useResume = () => {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within ResumeProvider')
  }
  return context
}
