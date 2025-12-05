import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('loggedInUser');
    
    if (token && storedUser) {
      const userData = JSON.parse(storedUser);
      loadUserData(userData.email || userData.id);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // Save current user data before switching
    if (user) {
      saveUserData(user.email || user.id);
    }
    
    const response = await authService.login(credentials);
    const userData = { name: response.user.name, role: response.user.role, email: response.user.email };
    
    // Load new user's data
    loadUserData(userData.email || userData.id);
    setUser(userData);
    return response;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const saveUserData = (userId) => {
    const userData = {
      cart: localStorage.getItem('cart'),
      selectedTable: localStorage.getItem('selectedTable'),
      paymentRequests: localStorage.getItem('paymentRequests')
    };
    localStorage.setItem(`userData_${userId}`, JSON.stringify(userData));
  };

  const loadUserData = (userId) => {
    // Clear current data first
    localStorage.removeItem('cart');
    localStorage.removeItem('selectedTable');
    localStorage.removeItem('paymentRequests');
    
    // Load user-specific data
    const userData = localStorage.getItem(`userData_${userId}`);
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.cart) localStorage.setItem('cart', parsedData.cart);
      if (parsedData.selectedTable) localStorage.setItem('selectedTable', parsedData.selectedTable);
      if (parsedData.paymentRequests) localStorage.setItem('paymentRequests', parsedData.paymentRequests);
    }
  };

  const logout = () => {
    // Save current user data before logout
    if (user) {
      saveUserData(user.email || user.id);
    }
    
    // Clear current session data
    localStorage.removeItem('cart');
    localStorage.removeItem('selectedTable');
    localStorage.removeItem('paymentRequests');
    
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};