import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus, 
  updateOrderItemStatus 
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/:id', protect, getOrderById);

router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.put('/items/:itemId/status', protect, authorize('admin'), updateOrderItemStatus);

export default router;