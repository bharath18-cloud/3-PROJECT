const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper token generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey_saitejatraders_2026_ab12cd34', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user (triggers mock SMS/Email OTP)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, mobile, gstin, address } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.statusCode = 400;
      throw new Error('User already exists with this email');
    }

    // Simulate OTP generation and send to mobile
    const mockOtp = Math.floor(1000 + Math.random() * 9000);
    console.log(`[SMS Gateway] Sent OTP ${mockOtp} to mobile ${mobile}`);

    // Return response indicating OTP step is required
    res.status(200).json({
      success: true,
      message: 'OTP sent to registered mobile. Verify to complete registration.',
      tempData: { name, email, password, role, mobile, gstin, address },
      mockOtpCode: mockOtp, // Exposed for easy B2B validation in testing environments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and finalize registration
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { otp, enteredOtp, userDetails } = req.body;

    if (otp !== enteredOtp) {
      res.statusCode = 400;
      throw new Error('Invalid OTP verification code');
    }

    const { name, email, password, role, mobile, gstin, address } = userDetails;

    // Create user in database
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      mobile,
      gstin,
      address,
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          gstin: user.gstin,
          address: user.address,
        },
      });
    } else {
      res.statusCode = 400;
      throw new Error('Invalid user details provided');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.statusCode = 401;
      throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.statusCode = 401;
      throw new Error('Invalid credentials');
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        gstin: user.gstin,
        address: user.address,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulate Forgot Password trigger
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.statusCode = 404;
      throw new Error('No account found with this email');
    }

    console.log(`[Email Gateway] Sent password reset link to ${email}`);
    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your registered email.',
    });
  } catch (error) {
    next(error);
  }
};
