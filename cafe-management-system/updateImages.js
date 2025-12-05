import { models } from './models/index.js';

const accurateImages = {
  // Coffee Items
  'Cappuccino': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
  'Americano': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
  'Espresso': 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
  'Latte': 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&h=300&fit=crop',
  'Mocha': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
  'Cold Brew': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
  'Macchiato': 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400&h=300&fit=crop',
  'Flat White': 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=400&h=300&fit=crop',
  
  // Snacks Items
  'Samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
  'Pakora': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
  'Dhokla': 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop',
  'Vada Pav': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
  'Pani Puri': 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop',
  'Bhel Puri': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
  'Aloo Tikki': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
  'Dahi Puri': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
  
  // Breakfast Items
  'Masala Dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
  'Idli Sambar': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
  'Upma': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
  'Poha': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
  'Paratha': 'https://images.unsplash.com/photo-1574653853027-5d3ba0c95f5d?w=400&h=300&fit=crop',
  'Uttapam': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
  'Medu Vada': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
  'Rava Dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
  
  // Desserts Items
  'Gulab Jamun': 'https://images.unsplash.com/photo-1571167530149-c72f2dbf7e98?w=400&h=300&fit=crop',
  'Rasgulla': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
  'Kheer': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
  'Jalebi': 'https://images.unsplash.com/photo-1571167530149-c72f2dbf7e98?w=400&h=300&fit=crop',
  'Kulfi': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
  'Laddu': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
  'Ras Malai': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
  'Gajar Halwa': 'https://images.unsplash.com/photo-1571167530149-c72f2dbf7e98?w=400&h=300&fit=crop',
  
  // Beverages Items
  'Masala Chai': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
  'Lassi': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
  'Fresh Lime Water': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
  'Coconut Water': 'https://images.unsplash.com/photo-1447875569765-2b3db822bec9?w=400&h=300&fit=crop',
  'Buttermilk': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
  'Aam Panna': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
  'Thandai': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
  'Jaljeera': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop'
};

async function updateImages() {
  try {
    console.log('Updating menu item images...');
    
    for (const [itemName, imageUrl] of Object.entries(accurateImages)) {
      const item = await models.Menu.findOne({ where: { name: itemName } });
      if (item) {
        await item.update({ image: imageUrl });
        console.log(`Updated image for: ${itemName}`);
      }
    }
    
    console.log('Image update completed!');
  } catch (error) {
    console.error('Error updating images:', error);
  }
}

updateImages();