// Utility to initialize mock data for testing
export const initializeMockData = () => {
  // Initialize mock users if they don't exist
  if (!localStorage.getItem('mockUsers')) {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '+91-9876543210', role: 'customer' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+91-9876543211', role: 'customer' },
      { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', phone: '+91-9876543212', role: 'customer' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', phone: '+91-9876543213', role: 'customer' },
      { id: 5, name: 'David Brown', email: 'david.brown@example.com', phone: '+91-9876543214', role: 'customer' },
      { id: 6, name: 'Emily Davis', email: 'emily.davis@example.com', phone: '+91-9876543215', role: 'customer' },
      { id: 7, name: 'Alex Miller', email: 'alex.miller@example.com', phone: '+91-9876543216', role: 'customer' },
      { id: 8, name: 'Lisa Garcia', email: 'lisa.garcia@example.com', phone: '+91-9876543217', role: 'customer' },
      { id: 9, name: 'Tom Anderson', email: 'tom.anderson@example.com', phone: '+91-9876543218', role: 'customer' },
      { id: 10, name: 'Maria Rodriguez', email: 'maria.rodriguez@example.com', phone: '+91-9876543219', role: 'customer' }
    ];
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  }

  // Initialize mock orders with different users if they don't exist
  if (!localStorage.getItem('mockOrders')) {
    const now = Date.now();
    const mockOrders = [
      { id: 1, orderNumber: 'ORD001', userId: 1, tableId: 1, totalAmount: 450.00, status: 'confirmed', orderType: 'dine-in', createdAt: new Date(now - 30 * 60 * 1000).toISOString() },
      { id: 2, orderNumber: 'ORD002', userId: 2, tableId: 2, totalAmount: 320.00, status: 'confirmed', orderType: 'dine-in', createdAt: new Date(now - 45 * 60 * 1000).toISOString() },
      { id: 3, orderNumber: 'ORD003', userId: 3, tableId: 3, totalAmount: 275.00, status: 'confirmed', orderType: 'takeaway', createdAt: new Date(now - 60 * 60 * 1000).toISOString() },
      { id: 4, orderNumber: 'ORD004', userId: 4, tableId: 4, totalAmount: 180.00, status: 'confirmed', orderType: 'dine-in', createdAt: new Date(now - 90 * 60 * 1000).toISOString() },
      { id: 5, orderNumber: 'ORD005', userId: 5, tableId: 5, totalAmount: 520.00, status: 'confirmed', orderType: 'dine-in', createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString() },
      { id: 6, orderNumber: 'ORD006', userId: 6, tableId: 6, totalAmount: 395.00, status: 'confirmed', orderType: 'takeaway', createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString() },
      { id: 7, orderNumber: 'ORD007', userId: 7, tableId: 7, totalAmount: 240.00, status: 'confirmed', orderType: 'dine-in', createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString() },
      { id: 8, orderNumber: 'ORD008', userId: 8, tableId: 8, totalAmount: 680.00, status: 'confirmed', orderType: 'dine-in', createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString() },
      { id: 9, orderNumber: 'ORD009', userId: 9, tableId: 9, totalAmount: 155.00, status: 'confirmed', orderType: 'takeaway', createdAt: new Date(now - 6 * 60 * 60 * 1000).toISOString() },
      { id: 10, orderNumber: 'ORD010', userId: 10, tableId: 10, totalAmount: 420.00, status: 'confirmed', orderType: 'dine-in', createdAt: new Date(now - 7 * 60 * 60 * 1000).toISOString() },
      { id: 11, orderNumber: 'ORD011', userId: 1, tableId: 1, totalAmount: 180.00, status: 'pending', orderType: 'dine-in', createdAt: new Date(now - 15 * 60 * 1000).toISOString() }
    ];
    localStorage.setItem('mockOrders', JSON.stringify(mockOrders));
  }

  // Initialize mock payments with different statuses if they don't exist
  if (!localStorage.getItem('mockPayments')) {
    const now = Date.now();
    const methods = ['upi', 'card', 'netbanking', 'pay_at_counter', 'cash'];
    const statuses = ['completed', 'done', 'unpaid', 'pending', 'requested'];
    
    const mockPayments = [
      { id: 1, orderId: 1, userId: 1, amount: 450.00, paymentMethod: 'upi', paymentStatus: 'completed', transactionId: 'TXN1001', paymentDate: new Date(now - 30 * 60 * 1000).toISOString(), createdAt: new Date(now - 30 * 60 * 1000).toISOString() },
      { id: 2, orderId: 2, userId: 2, amount: 320.00, paymentMethod: 'pay_at_counter', paymentStatus: 'unpaid', transactionId: null, paymentDate: null, createdAt: new Date(now - 45 * 60 * 1000).toISOString() },
      { id: 3, orderId: 3, userId: 3, amount: 275.00, paymentMethod: 'card', paymentStatus: 'done', transactionId: 'TXN1003', paymentDate: new Date(now - 60 * 60 * 1000).toISOString(), createdAt: new Date(now - 60 * 60 * 1000).toISOString() },
      { id: 4, orderId: 4, userId: 4, amount: 180.00, paymentMethod: 'netbanking', paymentStatus: 'pending', transactionId: 'TXN1004', paymentDate: null, createdAt: new Date(now - 90 * 60 * 1000).toISOString() },
      { id: 5, orderId: 5, userId: 5, amount: 520.00, paymentMethod: 'upi', paymentStatus: 'requested', transactionId: 'TXN1005', paymentDate: null, createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString() },
      { id: 6, orderId: 6, userId: 6, amount: 395.00, paymentMethod: 'card', paymentStatus: 'completed', transactionId: 'TXN1006', paymentDate: new Date(now - 3 * 60 * 60 * 1000).toISOString(), createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString() },
      { id: 7, orderId: 7, userId: 7, amount: 240.00, paymentMethod: 'pay_at_counter', paymentStatus: 'unpaid', transactionId: null, paymentDate: null, createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString() },
      { id: 8, orderId: 8, userId: 8, amount: 680.00, paymentMethod: 'netbanking', paymentStatus: 'done', transactionId: 'TXN1008', paymentDate: new Date(now - 5 * 60 * 60 * 1000).toISOString(), createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString() },
      { id: 9, orderId: 9, userId: 9, amount: 155.00, paymentMethod: 'upi', paymentStatus: 'pending', transactionId: 'TXN1009', paymentDate: null, createdAt: new Date(now - 6 * 60 * 60 * 1000).toISOString() },
      { id: 10, orderId: 10, userId: 10, amount: 420.00, paymentMethod: 'cash', paymentStatus: 'completed', transactionId: null, paymentDate: new Date(now - 7 * 60 * 60 * 1000).toISOString(), createdAt: new Date(now - 7 * 60 * 60 * 1000).toISOString() },
      { id: 11, orderId: 11, userId: 1, amount: 180.00, paymentMethod: 'pay_at_counter', paymentStatus: 'unpaid', transactionId: null, paymentDate: null, createdAt: new Date(now - 15 * 60 * 1000).toISOString() }
    ];
    localStorage.setItem('mockPayments', JSON.stringify(mockPayments));
  }
};

export const clearMockData = () => {
  localStorage.removeItem('mockUsers');
  localStorage.removeItem('mockOrders');
  localStorage.removeItem('mockPayments');
};