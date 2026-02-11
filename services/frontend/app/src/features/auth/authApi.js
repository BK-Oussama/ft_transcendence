import { apiRequest } from '../../services/apiBase';

export const loginUser = (credentials) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};