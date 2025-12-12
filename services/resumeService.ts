import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:5000/api/resumes';

export const resumeService = {
  save: async (title: string, data: any) => {
    const token = authService.getToken();
    const response = await axios.post(API_URL, { title, data }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  list: async () => {
    const token = authService.getToken();
    const response = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  },

  get: async (id: string) => {
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  },

  update: async (id: string, title: string, data: any) => {
    const token = authService.getToken();
    const response = await axios.put(`${API_URL}/${id}`, { title, data }, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  },

  delete: async (id: string) => {
    const token = authService.getToken();
    const response = await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  }
};
