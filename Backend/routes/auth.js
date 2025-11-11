import express from 'express';
import { register, login, getMe, updateProfile, verifyRole } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/verify-role', protect, verifyRole);

export default router;