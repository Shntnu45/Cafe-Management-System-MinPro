import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    console.log('Register response:', response.data);
    
    // Handle the nested data structure from formatResponse
    const data = response.data.data || response.data;
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('loggedInUser', JSON.stringify(data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    // Map frontend role to backend role for API call
    const apiCredentials = {
      ...credentials,
      role: credentials.role === 'user' ? 'customer' : credentials.role
    };
    
    const response = await api.post('/auth/login', apiCredentials);
    console.log('Login response:', response.data);
    
    // Handle the nested data structure from formatResponse
    const data = response.data.data || response.data;
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('loggedInUser', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
  },

  verifyRole: async (requiredRole) => {
    const response = await api.post('/auth/verify-role', { requiredRole });
    return response.data;
  }
};