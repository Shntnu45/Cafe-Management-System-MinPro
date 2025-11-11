import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  menuItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'menu_items',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  specialInstructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  itemStatus: {
    type: DataTypes.ENUM('pending', 'preparing', 'ready', 'served'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'order_items',
  timestamps: true
});

export default OrderItem;