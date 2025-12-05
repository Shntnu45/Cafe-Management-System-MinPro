import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  tableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tables',
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  specialInstructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  orderType: {
    type: DataTypes.ENUM('dine-in', 'takeaway'),
    defaultValue: 'dine-in'
  },
  estimatedPreparationTime: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true
});

export default Order;