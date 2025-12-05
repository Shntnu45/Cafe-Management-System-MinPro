import api from './api';

// Helper function to handle API errors
const handleApiError = (error, operation) => {
  console.error(`${operation} error:`, error);
  
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.data?.error || `${operation} failed`;
    throw new Error(message);
  } else if (error.request) {
    // Request was made but no response received
    throw new Error('Server is not responding. Please check your connection.');
  } else {
    // Something else happened
    throw new Error(error.message || `${operation} failed`);
  }
};

export const menuService = {
  // Categories
  getCategories: async () => {
    try {
      const response = await api.get('/menu/categories');
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/menu/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  },

  // Menu Items
  getAllMenus: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams({
        includeUnavailable: 'true',
        ...params
      }).toString();
      const response = await api.get(`/menu/items?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get all menus error:', error);
      throw error;
    }
  },

  createMenu: async (menuData) => {
    try {
      console.log('Creating menu with data:', menuData);
      const response = await api.post('/menu/items', menuData);
      return response.data;
    } catch (error) {
      console.error('Create menu error:', error);
      throw error;
    }
  },

  updateMenu: async (id, menuData) => {
    try {
      console.log('Updating menu item:', id, 'with data:', menuData);
      const response = await api.put(`/menu/items/${id}`, menuData);
      return response.data;
    } catch (error) {
      console.error('Update menu error:', error);
      throw error;
    }
  },

  deleteMenu: async (id) => {
    try {
      const response = await api.delete(`/menu/items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete menu error:', error);
      throw error;
    }
  },

  getCategoriesWithMenus: async () => {
    try {
      const response = await api.get('/menu/categories-with-menus');
      return response.data;
    } catch (error) {
      console.error('Get categories with menus error:', error);
      throw error;
    }
  },

  getMenuById: async (id) => {
    try {
      const response = await api.get(`/menu/items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get menu by ID error:', error);
      throw error;
    }
  }
};