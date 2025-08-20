import axios from 'axios';

// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://boyzeta-backend.vercel.app/api'  // Production backend
  : 'http://localhost:3000/api';              // Local development

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const companiesApi = {
  getAll: (params?: any) => api.get('/companies', { params }),
  getById: (id: string) => api.get(`/companies/${id}`),
  create: (data: any) => api.post('/companies', data),
  update: (id: string, data: any) => api.put(`/companies/${id}`, data),
  delete: (id: string) => api.delete(`/companies/${id}`),
  findByBarcode: (barcode: string) => api.get(`/companies/barcode/${barcode}`),
};

export const bulkUploadApi = {
  upload: (data: any) => api.post('/bulk-upload', data),
};

export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  register: (userData: any) => api.post('/auth/register', userData),
  getUsers: () => api.get('/auth/users'),
  updateUser: (id: string, data: any) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/auth/users/${id}`),
};

export default api;
