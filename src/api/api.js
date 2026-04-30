import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// interceptador (MUITO IMPORTANTE)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    console.log('🔥 interceptor');
    console.log('status:', status);

    if (status === 401) {
      console.log('🔒 Token expirado - fazendo logout');

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/';
    }

    return Promise.reject(error);
  },
);
