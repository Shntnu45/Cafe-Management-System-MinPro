import { models } from './models/index.js';

const menuData = {
  'Coffee': [
    { name: 'Cappuccino', description: 'Rich espresso with steamed milk foam', price: 99, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop' },
    { name: 'Americano', description: 'Bold espresso with hot water', price: 89, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop' },
    { name: 'Espresso', description: 'Pure concentrated coffee shot', price: 79, image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop' },
    { name: 'Latte', description: 'Smooth espresso with steamed milk', price: 109, image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&h=300&fit=crop' },
    { name: 'Mocha', description: 'Chocolate flavored coffee delight', price: 129, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop' },
    { name: 'Cold Brew', description: 'Smooth cold extracted coffee', price: 119, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
    { name: 'Macchiato', description: 'Espresso with a dollop of foam', price: 139, image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400&h=300&fit=crop' },
    { name: 'Flat White', description: 'Double shot with microfoam milk', price: 149, image: 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=400&h=300&fit=crop' }
  ],
  'Main Course': [
    { name: 'Paneer Butter Masala', description: 'Creamy tomato curry with paneer', price: 199, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop' },
    { name: 'Veg Biryani', description: 'Aromatic basmati rice with vegetables', price: 179, image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400&h=300&fit=crop' },
    { name: 'Dal Tadka', description: 'Tempered yellow lentils', price: 149, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
    { name: 'Aloo Gobi', description: 'Spiced potato and cauliflower curry', price: 139, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
    { name: 'Palak Paneer', description: 'Spinach curry with cottage cheese', price: 189, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
    { name: 'Chole Bhature', description: 'Spicy chickpeas with fried bread', price: 159, image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop' },
    { name: 'Rajma Rice', description: 'Kidney bean curry with rice', price: 169, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
    { name: 'Kadai Paneer', description: 'Paneer cooked in kadai with spices', price: 209, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop' }
  ],
  'Snacks': [
    { name: 'Samosa', description: 'Crispy pastry with spiced filling', price: 29, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
    { name: 'Pakora', description: 'Deep fried vegetable fritters', price: 49, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop' },
    { name: 'Dhokla', description: 'Steamed gram flour cake', price: 59, image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop' },
    { name: 'Vada Pav', description: 'Mumbai style burger with potato patty', price: 39, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop' },
    { name: 'Pani Puri', description: 'Crispy shells with flavored water', price: 49, image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop' },
    { name: 'Bhel Puri', description: 'Puffed rice with chutneys', price: 59, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
    { name: 'Aloo Tikki', description: 'Spiced potato patties', price: 69, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop' },
    { name: 'Dahi Puri', description: 'Crispy shells with yogurt', price: 79, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' }
  ],
  'Breakfast': [
    { name: 'Masala Dosa', description: 'Crispy crepe with spiced potato filling', price: 89, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop' },
    { name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup', price: 69, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop' },
    { name: 'Upma', description: 'Semolina porridge with vegetables', price: 59, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop' },
    { name: 'Poha', description: 'Flattened rice with spices', price: 49, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop' },
    { name: 'Paratha', description: 'Stuffed flatbread with butter', price: 79, image: 'https://images.unsplash.com/photo-1574653853027-5d3ba0c95f5d?w=400&h=300&fit=crop' },
    { name: 'Uttapam', description: 'Thick pancake with vegetables', price: 99, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop' },
    { name: 'Medu Vada', description: 'Crispy lentil donuts', price: 79, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop' },
    { name: 'Rava Dosa', description: 'Crispy semolina crepe', price: 109, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop' }
  ],
  'Desserts': [
    { name: 'Gulab Jamun', description: 'Sweet milk dumplings in syrup', price: 69, image: 'https://images.unsplash.com/photo-1571167530149-c72f2dbf7e98?w=400&h=300&fit=crop' },
    { name: 'Rasgulla', description: 'Spongy cottage cheese balls', price: 59, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop' },
    { name: 'Kheer', description: 'Rice pudding with nuts', price: 79, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop' },
    { name: 'Jalebi', description: 'Crispy spirals in sugar syrup', price: 49, image: 'https://images.unsplash.com/photo-1571167530149-c72f2dbf7e98?w=400&h=300&fit=crop' },
    { name: 'Kulfi', description: 'Traditional Indian ice cream', price: 89, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },
    { name: 'Laddu', description: 'Sweet gram flour balls', price: 39, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop' },
    { name: 'Ras Malai', description: 'Cottage cheese in sweet milk', price: 99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop' },
    { name: 'Gajar Halwa', description: 'Carrot pudding with nuts', price: 89, image: 'https://images.unsplash.com/photo-1571167530149-c72f2dbf7e98?w=400&h=300&fit=crop' }
  ],
  'Beverages': [
    { name: 'Masala Chai', description: 'Spiced Indian tea', price: 29, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop' },
    { name: 'Lassi', description: 'Yogurt based drink', price: 69, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop' },
    { name: 'Fresh Lime Water', description: 'Refreshing lime drink', price: 39, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop' },
    { name: 'Coconut Water', description: 'Natural coconut water', price: 49, image: 'https://images.unsplash.com/photo-1447875569765-2b3db822bec9?w=400&h=300&fit=crop' },
    { name: 'Buttermilk', description: 'Spiced yogurt drink', price: 39, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop' },
    { name: 'Aam Panna', description: 'Raw mango drink', price: 59, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop' },
    { name: 'Thandai', description: 'Spiced milk drink', price: 79, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop' },
    { name: 'Jaljeera', description: 'Cumin flavored drink', price: 49, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop' }
  ]
};

async function seedMenuItems() {
  try {
    console.log('Starting menu seeding...');
    
    for (const [categoryName, items] of Object.entries(menuData)) {
      // Find or create category
      let category = await models.Category.findOne({ where: { name: categoryName } });
      
      if (!category) {
        category = await models.Category.create({
          name: categoryName,
          description: `Delicious ${categoryName.toLowerCase()} items`,
          isActive: true
        });
        console.log(`Created category: ${categoryName}`);
      }
      
      // Add items to category
      for (const item of items) {
        const existingItem = await models.Menu.findOne({
          where: { name: item.name, categoryId: category.id }
        });
        
        if (!existingItem) {
          await models.Menu.create({
            ...item,
            categoryId: category.id,
            isVegetarian: true,
            isAvailable: true
          });
          console.log(`Added item: ${item.name} to ${categoryName}`);
        }
      }
    }
    
    console.log('Menu seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding menu items:', error);
  }
}

seedMenuItems();