import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach JWT token on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('dubkami_token');
    if (token) {
      config.headers.Authorization = `******;
    }
  }
  return config;
});

export default api;
