import express from 'express';
import { getAllUsers, getUserById, updateUserStatus } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id/status', protect, authorize('admin'), updateUserStatus);

export default router;