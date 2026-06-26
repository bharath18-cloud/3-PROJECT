const express = require('express');
const router = express.Router();
const { checkout, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/checkout', protect, checkout);
router.post('/verify', protect, verifyPayment);

module.exports = router;
