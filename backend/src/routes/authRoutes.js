const express = require('express');
const router = express.Router();
const {
  register,
  login,
  googleLogin,
  getMe,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  deleteAddress,
  updateAddress,
  setDefaultAddress,
  forgotPassword,
  verifyOTP,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.put('/addresses/:id', protect, updateAddress);
router.put('/addresses/:id/default', protect, setDefaultAddress);

module.exports = router;
