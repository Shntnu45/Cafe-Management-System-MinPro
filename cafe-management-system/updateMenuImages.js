import { sequelize, models } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const updateMenuImages = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    const menuItems = await models.Menu.findAll();
    
    for (const item of menuItems) {
      if (!item.image) {
        const imageUrl = `/api/menu/image/${encodeURIComponent(item.name)}`;
        await item.update({ image: imageUrl });
        console.log(`Updated image for: ${item.name}`);
      }
    }

    console.log('Menu images updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating menu images:', error);
    process.exit(1);
  }
};

updateMenuImages();