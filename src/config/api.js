import axios from 'axios';

// Configuración para Railway o desarrollo local
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Debug: Ver qué URL se está usando
console.log('🔧 API_BASE_URL:', API_BASE_URL);
console.log('🔧 VITE_API_BASE_URL from env:', import.meta.env.VITE_API_BASE_URL);

export { API_BASE_URL };

export const http = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000, // Aumentado para conexiones a Railway
  withCredentials: false, // Railway maneja CORS diferente
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

http.interceptors.request.use((config) => {
  const userToken = localStorage.getItem('token');
  const adminToken = localStorage.getItem('admin_token');
  if (config.url?.startsWith('/admin/')) {
    if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }
  return config;
});

http.interceptors.response.use(
  r => r,
  (error) => {
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  }
);

export default http;
