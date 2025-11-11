import { models, sequelize } from './models/index.js';

const seedData = async () => {
  try {
    await sequelize.sync({ force: false });

    // Create categories
    const categories = await models.Category.bulkCreate([
      {
        name: 'Hot Beverages',
        description: 'Warm and comforting drinks to start your day',
        isActive: true
      },
      {
        name: 'Cold Beverages',
        description: 'Refreshing cold drinks and smoothies',
        isActive: true
      },
      {
        name: 'Breakfast',
        description: 'Delicious breakfast items to fuel your morning',
        isActive: true
      },
      {
        name: 'Snacks',
        description: 'Light bites and appetizers',
        isActive: true
      },
      {
        name: 'Desserts',
        description: 'Sweet treats to end your meal',
        isActive: true
      }
    ], { ignoreDuplicates: true });

    console.log('Categories created successfully');

    // Get category IDs
    const hotBeverages = await models.Category.findOne({ where: { name: 'Hot Beverages' } });
    const coldBeverages = await models.Category.findOne({ where: { name: 'Cold Beverages' } });
    const breakfast = await models.Category.findOne({ where: { name: 'Breakfast' } });
    const snacks = await models.Category.findOne({ where: { name: 'Snacks' } });
    const desserts = await models.Category.findOne({ where: { name: 'Desserts' } });

    // Create sample menu items
    const menuItems = await models.Menu.bulkCreate([
      // Hot Beverages
      {
        name: 'Cappuccino',
        description: 'Rich espresso with steamed milk and foam',
        price: 120.00,
        categoryId: hotBeverages.id,
        image: '/src/assets/cappuccino.jpg',
        isVegetarian: true,
        isAvailable: true,
        preparationTime: 5
      },
      {
        name: 'Americano',
        description: 'Bold espresso with hot water',
        price: 100.00,
        categoryId: hotBeverages.id,
        image: '/src/assets/americano.jpg',
        isVegetarian: true,
        isAvailable: true,
        preparationTime: 3
      },
      {
        name: 'Espresso',
        description: 'Strong and concentrated coffee shot',
        price: 80.00,
        categoryId: hotBeverages.id,
        image: '/src/assets/espresso.jpg',
        isVegetarian: true,
        isAvailable: true,
        preparationTime: 2
      },
      // Cold Beverages
      {
        name: 'Iced Coffee',
        description: 'Chilled coffee with ice and milk',
        price: 110.00,
        categoryId: coldBeverages.id,
        image: '/src/assets/cafeCofee.jpg',
        isVegetarian: true,
        isAvailable: true,
        preparationTime: 5
      },
      // Breakfast
      {
        name: 'Classic Burger',
        description: 'Juicy beef patty with lettuce, tomato, and cheese',
        price: 250.00,
        categoryId: breakfast.id,
        image: '/src/assets/burger1.jpg',
        isVegetarian: false,
        isAvailable: true,
        preparationTime: 15
      },
      {
        name: 'Veggie Burger',
        description: 'Plant-based patty with fresh vegetables',
        price: 220.00,
        categoryId: breakfast.id,
        image: '/src/assets/burger2.jpg',
        isVegetarian: true,
        isAvailable: true,
        preparationTime: 12
      }
    ], { ignoreDuplicates: true });

    console.log('Menu items created successfully');
    console.log('Seed data completed!');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData().then(() => process.exit(0));
}

export default seedData;