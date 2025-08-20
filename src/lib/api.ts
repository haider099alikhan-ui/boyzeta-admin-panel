import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000',
  timeout: 10000,
});

// Request interceptor to add admin key header
api.interceptors.request.use((config) => {
  const adminKey = typeof window !== 'undefined' 
    ? localStorage.getItem('admin-key') || process.env.NEXT_PUBLIC_ADMIN_KEY
    : process.env.NEXT_PUBLIC_ADMIN_KEY;
  
  if (adminKey) {
    config.headers['x-admin-key'] = adminKey;
  }
  
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin-key');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  products: '/api/products',
  product: (id: string) => `/api/products/${id}`,
  search: (query: string) => `/api/products?search=${encodeURIComponent(query)}`,
  stats: '/api/products/stats',
  barcodeSearch: (barcode: string) => `/api/products/search/barcode/${barcode}`,
};

export default api;
