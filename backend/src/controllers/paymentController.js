const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

// Initialize Razorpay instance if credentials are provided, or use mock fallback
let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (err) {
  console.warn('Razorpay could not be initialized. Operating in simulated gateway fallback mode.', err.message);
}

// @desc    Initialize a Razorpay checkout transaction order
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
      amount: Math.round(amount * 100), // Amount in paise (1 INR = 100 paise)
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(1000 + Math.random() * 9000)}`,
    };

    if (razorpay) {
      const razorpayOrder = await razorpay.orders.create(options);
      return res.status(250).json({
        success: true,
        order: razorpayOrder,
        mode: 'production',
      });
    } else {
      // Return simulated mock Razorpay order metadata
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
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment gateway signature response
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      res.statusCode = 400;
      throw new Error('Payment verification details missing');
    }

    // If working in simulated sandbox, auto-verify signature
    if (!razorpay) {
      return res.status(200).json({
        success: true,
        message: 'Simulated Razorpay transaction signature verified successfully',
      });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.status(200).json({
        success: true,
        message: 'Razorpay transaction signature verified successfully',
      });
    } else {
      res.statusCode = 400;
      throw new Error('Invalid signature. Potential fraud detected.');
    }
  } catch (error) {
    next(error);
  }
};
