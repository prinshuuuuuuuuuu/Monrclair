const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getDashboardStats, 
  getAllOrders, 
  updateOrderStatus, 
  getAllUsers, 
  blockUser, 
  deleteUser,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.use(protect);
router.use(admin);

// Dashboard
router.get('/stats', getDashboardStats);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id/block', blockUser);
router.delete('/users/:id', deleteUser);

// Products
router.post('/products', upload.array('images', 5), createProduct);
router.put('/products/:id', upload.array('images', 5), updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
