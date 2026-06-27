const crypto = require('crypto');
const Order = require('../models/Order');

// @desc    Initialize a simulated checkout transaction order
// @route   POST /api/payment/checkout
// @access  Private
exports.checkout = async (req, res, next) => {
  try {
    const { amount } = req.body; // Amount in INR

    if (!amount || amount <= 0) {
      res.statusCode = 400;
      throw new Error('Transaction amount must be specified');
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(1000 + Math.random() * 9000)}`,
    };

    // Return simulated mock order metadata
    return res.status(200).json({
      success: true,
      mode: 'simulated',
      order: {
        id: `order_mock_${Math.floor(100000 + Math.random() * 900000)}`,
        amount: options.amount,
        currency: 'INR',
        receipt: options.receipt,
        status: 'created',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify simulated payment gateway signature response
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      res.statusCode = 400;
      throw new Error('Payment verification details missing');
    }

    return res.status(200).json({
      success: true,
      message: 'Simulated transaction signature verified successfully',
    });
  } catch (error) {
    next(error);
  }
};
