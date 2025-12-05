import express from 'express';
import { 
  getCategories, 
  getMenuItems, 
  getMenuItemById, 
  createCategory, 
  createMenuItem, 
  updateMenuItem,
  deleteMenuItem,
  getCategoriesWithMenus
} from '../controllers/menuController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Root route for menu
router.get('/', optionalAuth, getMenuItems);

// Public routes (no auth required for viewing)
router.get('/categories', optionalAuth, getCategories);
router.get('/categories-with-menus', optionalAuth, getCategoriesWithMenus);
router.get('/items', optionalAuth, getMenuItems);
router.get('/items/:id', optionalAuth, getMenuItemById);

// Admin-only routes
router.post('/categories', protect, authorize('admin'), createCategory);
router.post('/items', protect, authorize('admin'), createMenuItem);
router.put('/items/:id', protect, authorize('admin'), updateMenuItem);
router.delete('/items/:id', protect, authorize('admin'), deleteMenuItem);

// Add error handling middleware for this router
router.use((error, req, res, next) => {
  console.error('Menu route error:', error);
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Menu operation failed'
  });
});

export default router;