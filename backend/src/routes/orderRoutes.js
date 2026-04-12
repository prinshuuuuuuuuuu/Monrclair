const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, cancelOrder, checkStatus, verifyPayment } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createOrder);
router.get('/check-status/:paymentId', checkStatus);
router.post('/verify-payment', verifyPayment); // Internal/Admin only usually, but exposing for demo
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);

module.exports = router;
