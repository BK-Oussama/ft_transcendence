import axios from 'axios';

// This is the ONLY place in the whole project 
// where the Gateway URL is defined.
// Use a separate axios instance for refresh requests to avoid interceptor loops
const refreshApi = axios.create({ baseURL: 'https://localhost/api', withCredentials: true });

const api = axios.create({ baseURL: 'https://localhost/api', withCredentials: true });

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;