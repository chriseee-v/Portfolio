import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
})

export interface Project {
  id: number
  title: string
  role: string
  year: string
  stack: string[]
  category: string
  description: string
  github_url?: string
  live_url?: string
  image_url?: string
  published: boolean
}

export interface Experience {
  id: number
  year: string
  title: string
  company: string
  description: string
  technologies: string[]
  highlight: boolean
}

export interface Blog {
  id: number
  title: string
  date: string
  read_time: string
  tags: string[]
  summary: string
  content?: string
  image_url?: string
  published: boolean
}

export const portfolioApi = {
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/api/projects')
    return response.data.data
  },
  
  getExperiences: async (): Promise<Experience[]> => {
    const response = await api.get('/api/experiences')
    return response.data.data
  },
  
  getBlogs: async (): Promise<Blog[]> => {
    const response = await api.get('/api/blogs')
    return response.data.data
  },
}

export default api

