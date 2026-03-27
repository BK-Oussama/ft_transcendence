import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost/api',
  withCredentials: true, // sends the httpOnly refreshToken cookie
});

// ── Request interceptor ────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor ───────────────────────────────────────────────────
// Use a separate axios instance for the refresh call so it doesn't loop back
// through this interceptor and trigger another 401 → refresh cycle.
const refreshApi = axios.create({
  baseURL: 'https://localhost/api',
  withCredentials: true,
});

let isRefreshing = false;
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh if the failing request IS the refresh endpoint
    if (original.url?.includes('/auth/refresh')) {
      localStorage.removeItem('access_token');
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue the request until the ongoing refresh finishes
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const res = await refreshApi.post<{ accessToken?: string; access_token?: string }>('/auth/refresh');
      const newToken = res.data.accessToken ?? res.data.access_token ?? '';
      localStorage.setItem('access_token', newToken);
      processQueue(null, newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original); // retry the original failed request
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem('access_token');
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
