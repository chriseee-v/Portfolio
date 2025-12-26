import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
})

export function setAuthToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function removeAuthToken() {
  delete api.defaults.headers.common['Authorization']
}

// Projects
export const projectsApi = {
  getAll: () => api.get('/api/admin/projects'),
  getOne: (id: number) => api.get(`/api/admin/projects/${id}`),
  create: (data: any) => api.post('/api/admin/projects', data),
  update: (id: number, data: any) => api.put(`/api/admin/projects/${id}`, data),
  delete: (id: number) => api.delete(`/api/admin/projects/${id}`),
}

// Experiences
export const experiencesApi = {
  getAll: () => api.get('/api/admin/experiences'),
  getOne: (id: number) => api.get(`/api/admin/experiences/${id}`),
  create: (data: any) => api.post('/api/admin/experiences', data),
  update: (id: number, data: any) => api.put(`/api/admin/experiences/${id}`, data),
  delete: (id: number) => api.delete(`/api/admin/experiences/${id}`),
}

// Blogs
export const blogsApi = {
  getAll: () => api.get('/api/admin/blogs'),
  getOne: (id: number) => api.get(`/api/admin/blogs/${id}`),
  create: (data: any) => api.post('/api/admin/blogs', data),
  update: (id: number, data: any) => api.put(`/api/admin/blogs/${id}`, data),
  delete: (id: number) => api.delete(`/api/admin/blogs/${id}`),
}

// Tech Topics
export const techTopicsApi = {
  getAll: () => api.get('/api/admin/tech-topics'),
  getOne: (id: number) => api.get(`/api/admin/tech-topics/${id}`),
  create: (data: any) => api.post('/api/admin/tech-topics', data),
  update: (id: number, data: any) => api.put(`/api/admin/tech-topics/${id}`, data),
  delete: (id: number) => api.delete(`/api/admin/tech-topics/${id}`),
}

export default api

