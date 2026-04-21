import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5007/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  const storageKey = isAdminRoute ? 'adminUser' : 'user';
  const data = localStorage.getItem(storageKey);
  
  if (data) {
    const { token } = JSON.parse(data);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
