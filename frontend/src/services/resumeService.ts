import api from './api'
import { Resume } from '../context/ResumeContext'

export const resumeService = {
  getResumes: async () => {
    const response = await api.get('/resumes')
    return response.data
  },

  getResume: async (id: string) => {
    const response = await api.get(`/resumes/${id}`)
    return response.data
  },

  createResume: async (resume: Partial<Resume>) => {
    const response = await api.post('/resumes', resume)
    return response.data
  },

  updateResume: async (id: string, updates: Partial<Resume>) => {
    const response = await api.put(`/resumes/${id}`, updates)
    return response.data
  },

  deleteResume: async (id: string) => {
    await api.delete(`/resumes/${id}`)
  },

  exportPDF: async (id: string) => {
    const response = await api.get(`/resumes/${id}/export`, {
      responseType: 'blob',
    })
    return response.data
  },

  getSuggestions: async (section: string, content: string) => {
    const response = await api.post('/suggestions', { section, content })
    return response.data
  },
}

export const authService = {
  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
}
