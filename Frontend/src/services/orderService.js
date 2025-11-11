import api from './api';
import { initializeMockData } from '../utils/mockDataHelper';

export const orderService = {
  getAllOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      
      const ordersWithUsers = mockOrders.map(order => {
        const user = mockUsers.find(u => u.id === order.userId);
        return { ...order, User: user };
      });
      
      return { data: { orders: ordersWithUsers } };
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders/create', orderData);
      return response.data;
    } catch (error) {
      const mockOrder = {
        id: Date.now(),
        orderNumber: `ORD${String(Date.now()).slice(-6)}`,
        userId: JSON.parse(localStorage.getItem('loggedInUser'))?.id || 1,
        totalAmount: orderData.totalAmount,
        status: 'pending',
        orderType: orderData.orderType,
        createdAt: new Date().toISOString()
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      existingOrders.push(mockOrder);
      localStorage.setItem('mockOrders', JSON.stringify(existingOrders));
      
      return { data: { order: mockOrder } };
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.put(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      const existingOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      const orderIndex = existingOrders.findIndex(o => o.id === id);
      
      if (orderIndex !== -1) {
        existingOrders[orderIndex].status = status;
        localStorage.setItem('mockOrders', JSON.stringify(existingOrders));
        return { data: { order: existingOrders[orderIndex] } };
      }
      
      throw error;
    }
  },

  getUserOrders: async () => {
    try {
      const response = await api.get('/orders/my-orders');
      return response.data;
    } catch (error) {
      const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const userOrders = mockOrders.filter(order => order.userId === currentUser?.id);
      
      return { data: { orders: userOrders } };
    }
  }
};