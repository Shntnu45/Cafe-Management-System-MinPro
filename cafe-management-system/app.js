import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import menuRoutes from './routes/menu.js';
import tableRoutes from './routes/tables.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';

import { sequelize, models, setupAssociations } from './models/index.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration for different environments
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://cafe-management-frontend-9k0e.onrender.com', process.env.FRONTEND_URL] 
    : ['http://localhost:5173', 'http://localhost:5000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cafe Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      menu: '/api/menu',
      auth: '/api/auth',
      tables: '/api/tables'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cafe Management System API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    setupAssociations();
    console.log(' Database associations setup successfully.');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false });
      console.log('Database synchronized successfully.');
    } else {
      await sequelize.sync();
      console.log('Database synchronized successfully.');
    }

    await createDefaultData();
    
  } catch (error) {
    console.error(' Unable to connect to the database:', error);
    process.exit(1);
  }
};

const createDefaultData = async () => {
  try {
    const User = models.User;
    const Category = models.Category;
    const Menu = models.Menu;
    const Table = models.Table;
    
    // Create default admin user
    const adminUser = await User.findOne({ where: { email: 'admin@cafe.com' } });
    if (!adminUser) {
      await User.create({
        name: 'Cafe Administrator',
        email: 'admin@cafe.com',
        password: 'admin123',
        phone: '+1234567890',
        role: 'admin'
      });
      console.log(' Default admin user created: admin@cafe.com / admin123');
    }

    // Create default customer user
    const customerUser = await User.findOne({ where: { email: 'customer@cafe.com' } });
    if (!customerUser) {
      await User.create({
        name: 'John Customer',
        email: 'customer@cafe.com',
        password: 'customer123',
        phone: '+0987654321',
        role: 'customer'
      });
      console.log('Default customer user created: customer@cafe.com / customer123');
    }

    // Create default categories
    const categoriesCount = await Category.count();
    if (categoriesCount === 0) {
      const categories = await Category.bulkCreate([
        { name: 'Hot Beverages', description: 'Warm and comforting drinks' },
        { name: 'Cold Beverages', description: 'Refreshing cold drinks' },
        { name: 'Breakfast', description: 'Morning delights' },
        { name: 'Lunch & Dinner', description: 'Main course meals' },
        { name: 'Desserts', description: 'Sweet treats' }
      ]);
      console.log('Default categories created');
    }

    // Create default menu items
    const menuCount = await Menu.count();
    if (menuCount === 0) {
      const categories = await Category.findAll();
      const hotBev = categories.find(c => c.name === 'Hot Beverages');
      const coldBev = categories.find(c => c.name === 'Cold Beverages');
      const breakfast = categories.find(c => c.name === 'Breakfast');
      const lunchDinner = categories.find(c => c.name === 'Lunch & Dinner');
      const desserts = categories.find(c => c.name === 'Desserts');

      await Menu.bulkCreate([
        { name: 'Espresso', price: 3.50, categoryId: hotBev.id, preparationTime: 5 },
        { name: 'Cappuccino', price: 4.50, categoryId: hotBev.id, preparationTime: 7 },
        { name: 'Latte', price: 4.75, categoryId: hotBev.id, preparationTime: 8 },
        { name: 'Iced Coffee', price: 4.25, categoryId: coldBev.id, preparationTime: 5 },
        { name: 'Fresh Orange Juice', price: 3.75, categoryId: coldBev.id, preparationTime: 3 },
        { name: 'Pancakes', price: 8.50, categoryId: breakfast.id, preparationTime: 15 },
        { name: 'Omelette', price: 7.25, categoryId: breakfast.id, preparationTime: 12 },
        { name: 'Club Sandwich', price: 9.75, categoryId: lunchDinner.id, preparationTime: 10 },
        { name: 'Caesar Salad', price: 8.25, categoryId: lunchDinner.id, preparationTime: 8 },
        { name: 'Chocolate Cake', price: 5.50, categoryId: desserts.id, preparationTime: 5 },
        { name: 'Cheesecake', price: 6.25, categoryId: desserts.id, preparationTime: 5 }
      ]);
      console.log('Default menu items created');
    }

    // Create default tables
    const tablesCount = await Table.count();
    if (tablesCount === 0) {
      await Table.bulkCreate([
        { tableNumber: 'T01', capacity: 2, location: 'Window Side' },
        { tableNumber: 'T02', capacity: 2, location: 'Window Side' },
        { tableNumber: 'T03', capacity: 4, location: 'Center' },
        { tableNumber: 'T04', capacity: 4, location: 'Center' },
        { tableNumber: 'T05', capacity: 6, location: 'Private Corner' },
        { tableNumber: 'T06', capacity: 8, location: 'Family Section' }
      ]);
      console.log('Default tables created');
    }

  } catch (error) {
    console.error('Error creating default data:', error);
  }
};

export { app, initializeDatabase };