import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

export const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8); 
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `ORD${timestamp}${random}`;
};

export const formatResponse = (success, message, data = null) => {
  return {
    success,
    message,
    data
  };
};

export const paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};