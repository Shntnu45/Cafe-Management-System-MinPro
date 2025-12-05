import { sequelize, models } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const updateNewMenu = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Clear existing menu items
    await models.Menu.destroy({ where: {} });
    console.log('Existing menu items cleared.');

    // Get categories
    const categories = await models.Category.findAll();
    const hotBev = categories.find(c => c.name === 'Hot Beverages');
    const coldBev = categories.find(c => c.name === 'Cold Beverages');
    const breakfast = categories.find(c => c.name === 'Breakfast');
    const lunchDinner = categories.find(c => c.name === 'Lunch & Dinner');
    const desserts = categories.find(c => c.name === 'Desserts');

    // Add new menu items
    await models.Menu.bulkCreate([
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

    console.log('New Indian menu items added successfully!');
    console.log('Total items added: 50');
    process.exit(0);
  } catch (error) {
    console.error('Error updating menu:', error);
    process.exit(1);
  }
};

updateNewMenu();