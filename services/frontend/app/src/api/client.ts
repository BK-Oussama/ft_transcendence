import axios from 'axios';

// This is the ONLY place in the whole project 
// where the Gateway URL is defined.
const api = axios.create({
  baseURL: 'https://localhost/api', 
  withCredentials: true, // Crucial: This tells the browser to send JWT cookies!
});

export default api;