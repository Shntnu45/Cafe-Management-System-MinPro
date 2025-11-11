import { models } from '../models/index.js';
import { formatResponse, paginate } from '../utils/helpers.js';

export const createPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, notes } = req.body;

    const order = await models.Order.findOne({
      where: { 
        id: orderId,
        userId: req.user.id 
      }
    });

    if (!order) {
      return res.status(404).json(
        formatResponse(false, 'Order not found')
      );
    }

    const existingPayment = await models.Payment.findOne({ where: { orderId } });
    if (existingPayment) {
      return res.status(400).json(
        formatResponse(false, 'Payment already exists for this order')
      );
    }

    // Determine payment status based on method
    let paymentStatus = 'completed';
    let paymentDate = new Date();
    
    if (paymentMethod === 'pay_at_counter') {
      paymentStatus = 'unpaid';
      paymentDate = null;
    }

    const payment = await models.Payment.create({
      orderId,
      userId: req.user.id,
      amount: order.totalAmount,
      paymentMethod,
      paymentStatus,
      paymentDate,
      transactionId: paymentMethod !== 'pay_at_counter' ? `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}` : null,
      notes
    });

    if (order.status === 'pending') {
      order.status = 'confirmed';
      await order.save();
    }

    res.status(201).json(
      formatResponse(true, 'Payment created successfully', { payment })
    );
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while creating payment')
    );
  }
};

export const getPaymentByOrderId = async (req, res) => {
  try {
    const payment = await models.Payment.findOne({
      where: { orderId: req.params.orderId },
      include: [
        {
          model: models.Order,
          include: [models.OrderItem]
        },
        {
          model: models.User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!payment) {
      return res.status(404).json(
        formatResponse(false, 'Payment not found')
      );
    }

    if (payment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(
        formatResponse(false, 'Not authorized to access this payment')
      );
    }

    res.status(200).json(
      formatResponse(true, 'Payment retrieved successfully', { payment })
    );
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching payment')
    );
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, paymentStatus } = req.query;
    const { limit: queryLimit, offset } = paginate(parseInt(page), parseInt(limit));

    const whereCondition = {};
    if (paymentStatus) whereCondition.paymentStatus = paymentStatus;

    const payments = await models.Payment.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: models.Order,
          include: [models.Table]
        },
        {
          model: models.User,
          attributes: ['id', 'name', 'email']
        }
      ],
      limit: queryLimit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(
      formatResponse(true, 'Payments retrieved successfully', {
        payments: payments.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: payments.count,
          pages: Math.ceil(payments.count / limit)
        }
      })
    );
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching payments')
    );
  }
};

export const getUserPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { limit: queryLimit, offset } = paginate(parseInt(page), parseInt(limit));

    const payments = await models.Payment.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          model: models.Order,
          include: [models.Table]
        }
      ],
      limit: queryLimit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(
      formatResponse(true, 'User payments retrieved successfully', {
        payments: payments.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: payments.count,
          pages: Math.ceil(payments.count / limit)
        }
      })
    );
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching user payments')
    );
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, notes } = req.body;
    const payment = await models.Payment.findByPk(req.params.id, {
      include: [{
        model: models.Order,
        include: [{
          model: models.User,
          attributes: ['id', 'name', 'email']
        }]
      }]
    });

    if (!payment) {
      return res.status(404).json(
        formatResponse(false, 'Payment not found')
      );
    }

    payment.paymentStatus = paymentStatus;
    if (notes) payment.notes = notes;
    
    // Set payment date when status changes to completed or done
    if ((paymentStatus === 'completed' || paymentStatus === 'done') && !payment.paymentDate) {
      payment.paymentDate = new Date();
    }
    
    await payment.save();

    res.status(200).json(
      formatResponse(true, 'Payment status updated successfully', { payment })
    );
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while updating payment status')
    );
  }
};

export const getOrdersWithPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, paymentStatus } = req.query;
    const { limit: queryLimit, offset } = paginate(parseInt(page), parseInt(limit));

    const whereCondition = {};
    if (paymentStatus) {
      whereCondition['$Payment.paymentStatus$'] = paymentStatus;
    }

    const orders = await models.Order.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: models.OrderItem,
          include: [models.Menu]
        },
        {
          model: models.Payment,
          required: true
        },
        {
          model: models.User,
          attributes: ['id', 'name', 'email', 'phone']
        },
        models.Table
      ],
      limit: queryLimit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(
      formatResponse(true, 'Orders with payments retrieved successfully', {
        orders: orders.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: orders.count,
          pages: Math.ceil(orders.count / limit)
        }
      })
    );
  } catch (error) {
    console.error('Get orders with payments error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching orders with payments')
    );
  }
};