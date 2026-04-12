const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  changePassword,
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Profile & Security
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Addresses
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.put('/addresses/:id/default', protect, setDefaultAddress);

module.exports = router;
