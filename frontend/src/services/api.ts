import axios from 'axios';
import { Company, CompanyFormData, ApiResponse, BulkUploadResponse, User, LoginResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  // Login
  login: async (email: string, password: string) => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  // Register new user (super admin only)
  register: async (userData: { username: string; email: string; password: string; role?: string }) => {
    const response = await api.post<LoginResponse>('/auth/register', userData);
    return response.data;
  },

  // Get all users (super admin only)
  getUsers: async () => {
    const response = await api.get<ApiResponse<User[]>>('/auth/users');
    return response.data;
  },

  // Update user (super admin only)
  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await api.put<ApiResponse<User>>(`/auth/users/${id}`, userData);
    return response.data;
  },

  // Delete user (super admin only)
  deleteUser: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/auth/users/${id}`);
    return response.data;
  },
};

// Companies API
export const companiesApi = {
  // Get all companies with pagination and search
  getAll: async (page = 1, limit = 20, search = '') => {
    const response = await api.get<ApiResponse<Company[]>>('/companies', {
      params: { page, limit, search },
    });
    return response.data;
  },

  // Get company by ID
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Company>>(`/companies/${id}`);
    return response.data;
  },

  // Create new company
  create: async (companyData: CompanyFormData) => {
    const response = await api.post<ApiResponse<Company>>('/companies', companyData);
    return response.data;
  },

  // Update company
  update: async (id: string, companyData: Partial<CompanyFormData>) => {
    const response = await api.put<ApiResponse<Company>>(`/companies/${id}`, companyData);
    return response.data;
  },

  // Delete company
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/companies/${id}`);
    return response.data;
  },

  // Find company by barcode
  findByBarcode: async (barcode: string) => {
    const response = await api.get<ApiResponse<Company>>(`/companies/barcode/${barcode}`);
    return response.data;
  },
};

// Bulk Upload API
export const bulkUploadApi = {
  // Upload CSV data
  upload: async (companies: CompanyFormData[]) => {
    const response = await api.post<BulkUploadResponse>('/bulk-upload', { companies });
    return response.data;
  },
};

export default api;
