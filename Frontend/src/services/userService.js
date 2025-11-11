import api from './api';

export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateUserProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  }
};