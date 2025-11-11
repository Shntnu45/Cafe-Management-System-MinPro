import { models } from './models/index.js';

async function removeMainCourse() {
  try {
    console.log('Removing Main Course category and all its items...');
    
    const category = await models.Category.findOne({ where: { name: 'Main Course' } });
    
    if (category) {
      await models.Menu.destroy({ where: { categoryId: category.id } });
      console.log('Deleted all Main Course menu items');
      
      await category.destroy();
      console.log('Deleted Main Course category');
    } else {
      console.log('Main Course category not found');
    }
    
    console.log('Main Course removal completed!');
  } catch (error) {
    console.error('Error removing Main Course:', error);
  }
}

removeMainCourse();