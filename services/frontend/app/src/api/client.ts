import axios from 'axios';

// This is the ONLY place in the whole project 
// where the Gateway URL is defined.
const api = axios.create({
  baseURL: 'https://localhost/api', 
  withCredentials: true, // Crucial: This tells the browser to send JWT cookies!
});

api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post('/auth/refresh');
        
        const { accessToken } = res.data;

        localStorage.setItem("access_token", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem("access_token");
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