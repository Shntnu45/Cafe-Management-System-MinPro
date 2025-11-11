import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Payment = sequelize.define('Payment', {
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'upi', 'netbanking', 'pay_at_counter'),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'unpaid', 'requested', 'done'),
    defaultValue: 'pending'
  },
  transactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true
});

export default Payment;