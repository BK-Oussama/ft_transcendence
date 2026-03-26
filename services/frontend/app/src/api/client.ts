// export const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  baseUrl: string = 'https://localhost/api'
): Promise<T> {
  const token = localStorage.getItem('access_token');

  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      // only set Content-Type for JSON, not FormData
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}