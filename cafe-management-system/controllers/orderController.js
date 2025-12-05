import { models } from '../models/index.js';
import { formatResponse, generateOrderNumber, paginate } from '../utils/helpers.js';

export const createOrder = async (req, res) => {
  try {
    console.log('Create order request body:', req.body);
    console.log('User from request:', req.user);
    const { tableId, tableNumber, items, specialInstructions, orderType, totalAmount, customerName } = req.body;
    
    // Handle table assignment
    let validatedTableId = null;
    
    if (tableId) {
      const table = await models.Table.findByPk(tableId);
      if (!table) {
        return res.status(404).json(
          formatResponse(false, 'Table not found')
        );
      }
      validatedTableId = tableId;
    } else if (tableNumber && orderType === 'dine-in') {
      // Find table by table number
      const table = await models.Table.findOne({ where: { tableNumber: tableNumber } });
      if (table) {
        validatedTableId = table.id;
      }
    }
    
    // If no table found but database requires one, use first available table
    if (!validatedTableId) {
      const defaultTable = await models.Table.findOne();
      if (defaultTable) {
        validatedTableId = defaultTable.id;
      }
    }

    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItemId = item.menuItemId || item.menuId;
      const menuItem = await models.Menu.findByPk(menuItemId);
      
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json(
          formatResponse(false, `Menu item with ID ${menuItemId} is not available`)
        );
      }

      const itemTotal = menuItem.price * item.quantity;
      calculatedTotal += itemTotal;

      orderItems.push({
        menuItemId: menuItemId,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        totalPrice: itemTotal,
        specialInstructions: item.specialInstructions
      });
    }

    // Use provided total or calculated total
    const finalTotal = totalAmount || calculatedTotal;

    if (orderItems.length === 0) {
      return res.status(400).json(
        formatResponse(false, 'Order must contain at least one item')
      );
    }

    let maxTime = 0;
    for (const item of orderItems) {
      const menuItem = await models.Menu.findByPk(item.menuItemId);
      if (menuItem && menuItem.preparationTime > maxTime) {
        maxTime = menuItem.preparationTime;
      }
    }
    const estimatedPreparationTime = maxTime > 0 ? maxTime + 10 : 15;

    const order = await models.Order.create({
      orderNumber: generateOrderNumber(),
      userId: req.user.id,
      tableId: validatedTableId,
      totalAmount: finalTotal,
      specialInstructions: `${specialInstructions || ''}${customerName ? ` | Customer: ${customerName}` : ''}${tableNumber ? ` | Table: ${tableNumber}` : ''}`.trim(),
      orderType: orderType || 'takeaway',
      estimatedPreparationTime
    });

    for (const item of orderItems) {
      await models.OrderItem.create({
        ...item,
        orderId: order.id
      });
    }

    const completeOrder = await models.Order.findByPk(order.id, {
      include: [
        {
          model: models.OrderItem,
          include: [models.Menu]
        },
        {
          model: models.Table,
          required: false
        }
      ]
    });

    res.status(201).json(
      formatResponse(true, 'Order created successfully', { order: completeOrder })
    );
  } catch (error) {
    console.error('Create order error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json(
      formatResponse(false, `Server error while creating order: ${error.message}`)
    );
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const { limit: queryLimit, offset } = paginate(parseInt(page), parseInt(limit));

    const whereCondition = { userId: req.user.id };
    if (status) whereCondition.status = status;

    const orders = await models.Order.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: models.OrderItem,
          include: [models.Menu]
        },
        models.Table,
        models.Payment
      ],
      limit: queryLimit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(
      formatResponse(true, 'Orders retrieved successfully', {
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
    console.error('Get user orders error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching orders')
    );
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await models.Order.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: models.OrderItem,
          include: [models.Menu]
        },
        models.Table,
        models.Payment,
        {
          model: models.User,
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    if (!order) {
      return res.status(404).json(
        formatResponse(false, 'Order not found')
      );
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(
        formatResponse(false, 'Not authorized to access this order')
      );
    }

    res.status(200).json(
      formatResponse(true, 'Order retrieved successfully', { order })
    );
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching order')
    );
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, tableId } = req.query;
    const { limit: queryLimit, offset } = paginate(parseInt(page), parseInt(limit));

    const whereCondition = {};
    if (status) whereCondition.status = status;
    if (tableId) whereCondition.tableId = tableId;

    const orders = await models.Order.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: models.OrderItem,
          include: [models.Menu]
        },
        models.Table,
        models.Payment,
        {
          model: models.User,
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      limit: queryLimit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(
      formatResponse(true, 'Orders retrieved successfully', {
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
    console.error('Get all orders error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching orders')
    );
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await models.Order.findByPk(req.params.id, {
      include: [models.OrderItem]
    });

    if (!order) {
      return res.status(404).json(
        formatResponse(false, 'Order not found')
      );
    }

    if (status === 'completed') {
      order.completedAt = new Date();
      
      const table = await models.Table.findByPk(order.tableId);
      if (table) {
        table.status = 'available';
        table.occupiedBy = null;
        await table.save();
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json(
      formatResponse(true, 'Order status updated successfully', { order })
    );
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while updating order status')
    );
  }
};

export const updateOrderItemStatus = async (req, res) => {
  try {
    const { itemStatus } = req.body;
    const orderItem = await models.OrderItem.findByPk(req.params.itemId);

    if (!orderItem) {
      return res.status(404).json(
        formatResponse(false, 'Order item not found')
      );
    }

    orderItem.itemStatus = itemStatus;
    await orderItem.save();

    res.status(200).json(
      formatResponse(true, 'Order item status updated successfully', { orderItem })
    );
  } catch (error) {
    console.error('Update order item status error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while updating order item status')
    );
  }
};