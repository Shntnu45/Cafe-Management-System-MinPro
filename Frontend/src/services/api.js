import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  let token = localStorage.getItem('token');
  
  // Check for different possible token storage keys
  if (!token) {
    token = localStorage.getItem('authToken');
  }
  
  // Try to get token from user object if stored there
  if (!token) {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        token = userData.token;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }
  
  console.log('Token found:', !!token, 'Token value:', token?.substring(0, 20) + '...');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;