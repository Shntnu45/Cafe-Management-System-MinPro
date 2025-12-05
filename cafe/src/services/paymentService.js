import api from './api';
import { initializeMockData } from '../utils/mockDataHelper';

export const paymentService = {
  getAllPayments: async () => {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (error) {
      // Return mock data if server is not available
      const mockPayments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      
      const paymentsWithUsers = mockPayments.map(payment => {
        const user = mockUsers.find(u => u.id === payment.userId);
        return { ...payment, User: user };
      });
      
      return { data: { payments: paymentsWithUsers } };
    }
  },

  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/create', paymentData);
      return response.data;
    } catch (error) {
      // Create mock payment if server is not available
      const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const mockPayment = {
        id: Date.now(),
        orderId: paymentData.orderId,
        userId: currentUser?.id || 1,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        paymentStatus: paymentData.paymentMethod === 'pay_at_counter' ? 'unpaid' : 'completed',
        transactionId: paymentData.paymentMethod !== 'pay_at_counter' ? `TXN${Date.now()}` : null,
        paymentDate: paymentData.paymentMethod !== 'pay_at_counter' ? new Date().toISOString() : null,
        createdAt: new Date().toISOString()
      };
      
      const existingPayments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
      existingPayments.push(mockPayment);
      localStorage.setItem('mockPayments', JSON.stringify(existingPayments));
      
      return { data: { payment: mockPayment } };
    }
  },

  updatePaymentStatus: async (paymentId, statusData) => {
    try {
      const response = await api.put(`/payments/${paymentId}/status`, statusData);
      return response.data;
    } catch (error) {
      // Update payment status and sync with orders
      const existingPayments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
      const paymentIndex = existingPayments.findIndex(p => p.id == paymentId);
      
      if (paymentIndex !== -1) {
        existingPayments[paymentIndex] = {
          ...existingPayments[paymentIndex],
          paymentStatus: statusData.paymentStatus,
          notes: statusData.notes || existingPayments[paymentIndex].notes,
          paymentDate: (statusData.paymentStatus === 'completed' || statusData.paymentStatus === 'done') 
            ? new Date().toISOString() : existingPayments[paymentIndex].paymentDate
        };
        localStorage.setItem('mockPayments', JSON.stringify(existingPayments));
        
        // Sync order status when payment is completed
        if (statusData.paymentStatus === 'completed' || statusData.paymentStatus === 'done') {
          const orders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
          const orderIndex = orders.findIndex(o => o.id === existingPayments[paymentIndex].orderId);
          if (orderIndex !== -1 && orders[orderIndex].status === 'pending') {
            orders[orderIndex].status = 'confirmed';
            localStorage.setItem('mockOrders', JSON.stringify(orders));
          }
        }
        
        return { data: { payment: existingPayments[paymentIndex] } };
      }
      
      throw error;
    }
  },

  getOrdersWithPayments: async () => {
    try {
      const response = await api.get('/payments/orders');
      return response.data;
    } catch (error) {
      // Return all orders with their payment status
      const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      const mockPayments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      
      const ordersWithPayments = mockOrders.map(order => {
        let payment = mockPayments.find(p => p.orderId === order.id);
        const user = mockUsers.find(u => u.id === order.userId) || {
          id: order.userId || 1,
          name: 'Guest User',
          email: 'guest@example.com',
          phone: '+91-9876543210'
        };
        
        // Create payment record for orders without payments
        if (!payment) {
          payment = {
            id: Date.now() + Math.random(),
            orderId: order.id,
            userId: order.userId,
            amount: order.totalAmount,
            paymentMethod: 'pay_at_counter',
            paymentStatus: 'unpaid',
            transactionId: null,
            paymentDate: null,
            createdAt: order.createdAt
          };
          
          // Store new payment record
          mockPayments.push(payment);
          localStorage.setItem('mockPayments', JSON.stringify(mockPayments));
        }
        
        return { 
          ...order, 
          Payment: payment,
          User: user,
          Table: order.Table || { tableNumber: order.tableId || 1 }
        };
      });
      
      return { data: { orders: ordersWithPayments } };
    }
  },

  getUserPayments: async () => {
    try {
      const response = await api.get('/payments/user');
      return response.data;
    } catch (error) {
      // Return mock user payments if server is not available
      const mockPayments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const userPayments = mockPayments.filter(payment => payment.userId === currentUser?.id);
      
      return { data: { payments: userPayments } };
    }
  }
};