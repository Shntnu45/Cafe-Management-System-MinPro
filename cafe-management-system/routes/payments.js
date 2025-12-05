import express from 'express';
import { 
  createPayment, 
  getPaymentByOrderId, 
  getAllPayments, 
  updatePaymentStatus,
  getUserPayments,
  getOrdersWithPayments
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', protect, createPayment);
router.get('/order/:orderId', protect, getPaymentByOrderId);
router.get('/user', protect, getUserPayments);

router.get('/', protect, authorize('admin'), getAllPayments);
router.get('/orders', protect, authorize('admin'), getOrdersWithPayments);
router.put('/:id/status', protect, authorize('admin'), updatePaymentStatus);

export default router;