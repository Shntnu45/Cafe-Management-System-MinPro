import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import menuRoutes from './routes/menu.js';
import tableRoutes from './routes/tables.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';

import { sequelize, models, setupAssociations } from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve static files (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
      tables: '/api/tables',
      uploads: '/uploads'
    }
  });
});

// Serve default menu images
app.get('/api/menu/image/:itemName', (req, res) => {
  const { itemName } = req.params;
  const imageMap = {
    // Hot Beverages
    'Masala Chai': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
    'Adrak Chai': 'https://images.unsplash.com/photo-1597318181409-cf85b0c7740d?w=400&h=300&fit=crop',
    'Elaichi Chai': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
    'Filter Coffee': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
    'Hot Chocolate': 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop',
    'Badam Milk (Hot)': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
    'Green Tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    'Lemon Tea (Hot)': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    'Black Coffee': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
    'Turmeric Latte (Haldi Doodh)': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
    
    // Cold Beverages
    'Sweet Lassi': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
    'Masala Chaas': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
    'Cold Coffee': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    'Fresh Lime Soda (Sweet/Salt)': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
    'Mango Shake': 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop',
    'Banana Shake': 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop',
    'Rose Milk': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
    'Iced Tea (Lemon)': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    'Iced Coffee': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    'Watermelon Juice': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
    
    // Breakfast
    'Aloo Paratha': 'https://images.unsplash.com/photo-1574653853027-5d3ba0c95f5d?w=400&h=300&fit=crop',
    'Masala Dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
    'Idli Sambar (2 pcs)': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
    'Poha': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
    'Upma': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
    'Chole Bhature': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    'Veg Sandwich (Grilled)': 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=400&h=300&fit=crop',
    'Paneer Paratha': 'https://images.unsplash.com/photo-1574653853027-5d3ba0c95f5d?w=400&h=300&fit=crop',
    'Poori Bhaji': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    'Sabudana Khichdi': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
    
    // Lunch & Dinner
    'Paneer Butter Masala with Naan': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'Veg Biryani': 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400&h=300&fit=crop',
    'Dal Tadka with Jeera Rice': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'Veg Thali (Full)': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'Chole Kulche': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    'Veg Fried Rice': 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400&h=300&fit=crop',
    'Hakka Noodles (Veg)': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'Palak Paneer with Roti': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'Rajma Chawal': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'Paneer Tikka': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
    
    // Desserts
    'Gulab Jamun (2 pcs)': 'https://images.unsplash.com/photo-1571167530149-c72f2dbf7e98?w=400&h=300&fit=crop',
    'Rasmalai (2 pcs)': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    'Kaju Katli (2 pcs)': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
    'Gajar Halwa': 'https://images.unsplash.com/photo-1571167530149-c72f2dbf7e98?w=400&h=300&fit=crop',
    'Kulfi (Malai)': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
    'Jalebi (100g)': 'https://images.unsplash.com/photo-1571167530149-c72f2dbf7e98?w=400&h=300&fit=crop',
    'Rabri': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    'Basundi': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    'Sandesh': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
    'Badam Kheer': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
  };
  
  const imageUrl = imageMap[itemName] || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop';
  res.redirect(imageUrl);
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
        // Hot Beverages
        { name: 'Masala Chai', price: 20, categoryId: hotBev.id, preparationTime: 5, image: '/api/menu/image/Masala Chai', description: 'Traditional spiced tea with aromatic spices' },
        { name: 'Adrak Chai', price: 25, categoryId: hotBev.id, preparationTime: 5, image: '/api/menu/image/Adrak Chai', description: 'Ginger-infused tea for a warming experience' },
        { name: 'Elaichi Chai', price: 25, categoryId: hotBev.id, preparationTime: 5, image: '/api/menu/image/Elaichi Chai', description: 'Cardamom-flavored tea with rich aroma' },
        { name: 'Filter Coffee', price: 40, categoryId: hotBev.id, preparationTime: 7, image: '/api/menu/image/Filter Coffee', description: 'South Indian style filter coffee' },
        { name: 'Hot Chocolate', price: 90, categoryId: hotBev.id, preparationTime: 8, image: '/api/menu/image/Hot Chocolate', description: 'Rich and creamy hot chocolate' },
        { name: 'Badam Milk (Hot)', price: 70, categoryId: hotBev.id, preparationTime: 10, image: '/api/menu/image/Badam Milk (Hot)', description: 'Warm almond milk with nuts' },
        { name: 'Green Tea', price: 40, categoryId: hotBev.id, preparationTime: 5, image: '/api/menu/image/Green Tea', description: 'Healthy antioxidant-rich green tea' },
        { name: 'Lemon Tea (Hot)', price: 35, categoryId: hotBev.id, preparationTime: 5, image: '/api/menu/image/Lemon Tea (Hot)', description: 'Refreshing lemon-infused tea' },
        { name: 'Black Coffee', price: 45, categoryId: hotBev.id, preparationTime: 5, image: '/api/menu/image/Black Coffee', description: 'Strong black coffee for coffee lovers' },
        { name: 'Turmeric Latte (Haldi Doodh)', price: 55, categoryId: hotBev.id, preparationTime: 8, image: '/api/menu/image/Turmeric Latte (Haldi Doodh)', description: 'Healthy turmeric milk with spices' },
        
        // Cold Beverages
        { name: 'Sweet Lassi', price: 60, categoryId: coldBev.id, preparationTime: 5, image: '/api/menu/image/Sweet Lassi', description: 'Traditional yogurt-based sweet drink' },
        { name: 'Masala Chaas', price: 35, categoryId: coldBev.id, preparationTime: 5, image: '/api/menu/image/Masala Chaas', description: 'Spiced buttermilk with herbs' },
        { name: 'Cold Coffee', price: 90, categoryId: coldBev.id, preparationTime: 7, image: '/api/menu/image/Cold Coffee', description: 'Chilled coffee with ice cream' },
        { name: 'Fresh Lime Soda (Sweet/Salt)', price: 45, categoryId: coldBev.id, preparationTime: 5, image: '/api/menu/image/Fresh Lime Soda (Sweet/Salt)', description: 'Refreshing lime soda with choice of sweet or salt' },
        { name: 'Mango Shake', price: 80, categoryId: coldBev.id, preparationTime: 7, image: '/api/menu/image/Mango Shake', description: 'Thick mango shake with fresh mangoes' },
        { name: 'Banana Shake', price: 70, categoryId: coldBev.id, preparationTime: 7, image: '/api/menu/image/Banana Shake', description: 'Creamy banana shake with milk' },
        { name: 'Rose Milk', price: 50, categoryId: coldBev.id, preparationTime: 5, image: '/api/menu/image/Rose Milk', description: 'Rose-flavored milk with aromatic essence' },
        { name: 'Iced Tea (Lemon)', price: 70, categoryId: coldBev.id, preparationTime: 5, image: '/api/menu/image/Iced Tea (Lemon)', description: 'Chilled lemon tea with ice' },
        { name: 'Iced Coffee', price: 95, categoryId: coldBev.id, preparationTime: 7, image: '/api/menu/image/Iced Coffee', description: 'Cold brew coffee with ice' },
        { name: 'Watermelon Juice', price: 70, categoryId: coldBev.id, preparationTime: 5, image: '/api/menu/image/Watermelon Juice', description: 'Fresh watermelon juice' },
        
        // Breakfast
        { name: 'Aloo Paratha', price: 60, categoryId: breakfast.id, preparationTime: 15, image: '/api/menu/image/Aloo Paratha', description: 'Stuffed potato paratha with butter' },
        { name: 'Masala Dosa', price: 80, categoryId: breakfast.id, preparationTime: 20, image: '/api/menu/image/Masala Dosa', description: 'Crispy dosa with spiced potato filling' },
        { name: 'Idli Sambar (2 pcs)', price: 45, categoryId: breakfast.id, preparationTime: 10, image: '/api/menu/image/Idli Sambar (2 pcs)', description: 'Steamed rice cakes with sambar and chutney' },
        { name: 'Poha', price: 40, categoryId: breakfast.id, preparationTime: 12, image: '/api/menu/image/Poha', description: 'Flattened rice with vegetables and spices' },
        { name: 'Upma', price: 45, categoryId: breakfast.id, preparationTime: 15, image: '/api/menu/image/Upma', description: 'Semolina porridge with vegetables' },
        { name: 'Chole Bhature', price: 90, categoryId: breakfast.id, preparationTime: 20, image: '/api/menu/image/Chole Bhature', description: 'Spicy chickpeas with fried bread' },
        { name: 'Veg Sandwich (Grilled)', price: 70, categoryId: breakfast.id, preparationTime: 10, image: '/api/menu/image/Veg Sandwich (Grilled)', description: 'Grilled sandwich with fresh vegetables' },
        { name: 'Paneer Paratha', price: 75, categoryId: breakfast.id, preparationTime: 15, image: '/api/menu/image/Paneer Paratha', description: 'Stuffed cottage cheese paratha' },
        { name: 'Poori Bhaji', price: 65, categoryId: breakfast.id, preparationTime: 15, image: '/api/menu/image/Poori Bhaji', description: 'Fried bread with spiced potato curry' },
        { name: 'Sabudana Khichdi', price: 55, categoryId: breakfast.id, preparationTime: 15, image: '/api/menu/image/Sabudana Khichdi', description: 'Tapioca pearls with peanuts and spices' },
        
        // Lunch & Dinner
        { name: 'Paneer Butter Masala with Naan', price: 170, categoryId: lunchDinner.id, preparationTime: 25, image: '/api/menu/image/Paneer Butter Masala with Naan', description: 'Creamy paneer curry with soft naan bread' },
        { name: 'Veg Biryani', price: 150, categoryId: lunchDinner.id, preparationTime: 30, image: '/api/menu/image/Veg Biryani', description: 'Aromatic rice with mixed vegetables and spices' },
        { name: 'Dal Tadka with Jeera Rice', price: 130, categoryId: lunchDinner.id, preparationTime: 20, image: '/api/menu/image/Dal Tadka with Jeera Rice', description: 'Tempered lentils with cumin rice' },
        { name: 'Veg Thali (Full)', price: 180, categoryId: lunchDinner.id, preparationTime: 25, image: '/api/menu/image/Veg Thali (Full)', description: 'Complete meal with variety of dishes' },
        { name: 'Chole Kulche', price: 90, categoryId: lunchDinner.id, preparationTime: 20, image: '/api/menu/image/Chole Kulche', description: 'Spicy chickpeas with soft kulcha bread' },
        { name: 'Veg Fried Rice', price: 120, categoryId: lunchDinner.id, preparationTime: 15, image: '/api/menu/image/Veg Fried Rice', description: 'Stir-fried rice with mixed vegetables' },
        { name: 'Hakka Noodles (Veg)', price: 130, categoryId: lunchDinner.id, preparationTime: 15, image: '/api/menu/image/Hakka Noodles (Veg)', description: 'Indo-Chinese style vegetable noodles' },
        { name: 'Palak Paneer with Roti', price: 160, categoryId: lunchDinner.id, preparationTime: 20, image: '/api/menu/image/Palak Paneer with Roti', description: 'Spinach curry with cottage cheese and roti' },
        { name: 'Rajma Chawal', price: 110, categoryId: lunchDinner.id, preparationTime: 20, image: '/api/menu/image/Rajma Chawal', description: 'Kidney bean curry with steamed rice' },
        { name: 'Paneer Tikka', price: 150, categoryId: lunchDinner.id, preparationTime: 20, image: '/api/menu/image/Paneer Tikka', description: 'Grilled cottage cheese with spices' },
        
        // Desserts
        { name: 'Gulab Jamun (2 pcs)', price: 40, categoryId: desserts.id, preparationTime: 5, image: '/api/menu/image/Gulab Jamun (2 pcs)', description: 'Sweet milk dumplings in sugar syrup' },
        { name: 'Rasmalai (2 pcs)', price: 70, categoryId: desserts.id, preparationTime: 5, image: '/api/menu/image/Rasmalai (2 pcs)', description: 'Soft cottage cheese balls in sweet milk' },
        { name: 'Kaju Katli (2 pcs)', price: 60, categoryId: desserts.id, preparationTime: 5, image: '/api/menu/image/Kaju Katli (2 pcs)', description: 'Diamond-shaped cashew sweets' },
        { name: 'Gajar Halwa', price: 80, categoryId: desserts.id, preparationTime: 10, image: '/api/menu/image/Gajar Halwa', description: 'Carrot pudding with nuts and milk' },
        { name: 'Kulfi (Malai)', price: 50, categoryId: desserts.id, preparationTime: 5, image: '/api/menu/image/Kulfi (Malai)', description: 'Traditional Indian ice cream' },
        { name: 'Jalebi (100g)', price: 40, categoryId: desserts.id, preparationTime: 5, image: '/api/menu/image/Jalebi (100g)', description: 'Crispy sweet spirals in sugar syrup' },
        { name: 'Rabri', price: 90, categoryId: desserts.id, preparationTime: 10, image: '/api/menu/image/Rabri', description: 'Thick sweetened milk with nuts' },
        { name: 'Basundi', price: 100, categoryId: desserts.id, preparationTime: 10, image: '/api/menu/image/Basundi', description: 'Gujarati sweet thickened milk dessert' },
        { name: 'Sandesh', price: 60, categoryId: desserts.id, preparationTime: 5, image: '/api/menu/image/Sandesh', description: 'Bengali cottage cheese sweet' },
        { name: 'Badam Kheer', price: 80, categoryId: desserts.id, preparationTime: 15, image: '/api/menu/image/Badam Kheer', description: 'Almond rice pudding with cardamom' }
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