import sequelize from '../config/database.js';
import User from './User.js';
import Category from './Category.js';
import Menu from './Menu.js';
import Table from './Table.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Payment from './Payment.js';

// Initialize models
const models = {
  User,
  Category,
  Menu,
  Table,
  Order,
  OrderItem,
  Payment,
  Sequelize: sequelize.Sequelize
};

// Define associations
const setupAssociations = () => {
  // User associations
  User.hasMany(Order, { foreignKey: 'userId' });
  User.hasMany(Payment, { foreignKey: 'userId' });

  // Category associations
  Category.hasMany(Menu, { foreignKey: 'categoryId' });

  // Menu associations
  Menu.belongsTo(Category, { foreignKey: 'categoryId' });
  Menu.hasMany(OrderItem, { foreignKey: 'menuItemId' });

  // Table associations
  Table.hasMany(Order, { foreignKey: 'tableId' });
  Table.belongsTo(User, { foreignKey: 'occupiedBy', as: 'occupiedByUser' });

  // Order associations
  Order.belongsTo(User, { foreignKey: 'userId' });
  Order.belongsTo(Table, { foreignKey: 'tableId' });
  Order.hasMany(OrderItem, { foreignKey: 'orderId' });
  Order.hasOne(Payment, { foreignKey: 'orderId' });

  // OrderItem associations
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
  OrderItem.belongsTo(Menu, { foreignKey: 'menuItemId' });

  // Payment associations
  Payment.belongsTo(User, { foreignKey: 'userId' });
  Payment.belongsTo(Order, { foreignKey: 'orderId' });
};

export { sequelize, models, setupAssociations };