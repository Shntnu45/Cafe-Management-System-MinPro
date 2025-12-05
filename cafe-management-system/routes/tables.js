import express from 'express';
import { 
  getTables, 
  getAvailableTables, 
  occupyTable, 
  releaseTable, 
  createTable, 
  updateTable,
  occupyTableById,
  releaseTableById
} from '../controllers/tableController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getTables);
router.get('/available', optionalAuth, getAvailableTables);

// User routes
router.put('/:id/occupy', protect, occupyTableById);
router.put('/:id/release', protect, releaseTableById);
router.post('/occupy', protect, occupyTable);

// Admin routes
router.post('/', protect, authorize('admin'), createTable);
router.put('/:id/admin-update', protect, authorize('admin'), updateTable);
router.put('/:id/admin-release', protect, authorize('admin'), releaseTable);

export default router;