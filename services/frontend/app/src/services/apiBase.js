// We use relative paths because the Gateway handles the routing.
// Since you are using HTTPS everywhere, the browser will 
// automatically use 'https://' for these requests.
const BASE_URL = '/api';

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  // Default headers (like JSON support)
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Call Failed:", error);
    throw error;
  }
};