import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Menu = sequelize.define('Menu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isVegetarian: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  preparationTime: {
    type: DataTypes.INTEGER,
    defaultValue: 15
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'menu_items',
  timestamps: true
});

export default Menu;