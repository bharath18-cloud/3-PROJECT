const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get Admin Panel Metrics & Reports
// @route   GET /api/admin/metrics
// @access  Private/Admin
exports.getMetrics = async (req, res, next) => {
  try {
    const orders = await Order.find({});
    const products = await Product.find({});
    const customers = await User.find({ role: 'customer' });

    // Calculate dynamic analytical metrics
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const revenue = orders.reduce((sum, o) => sum + o.subtotal, 0);
    
    const activeOrdersCount = orders.filter(
      (o) => o.deliveryStatus !== 'Delivered'
    ).length;

    const lowStockCount = products.filter(
      (p) => p.stock <= p.lowStock
    ).length;

    // Monthly aggregation simulation
    const salesReport = [
      { month: 'Jan', sales: Math.round(totalSales * 0.15) },
      { month: 'Feb', sales: Math.round(totalSales * 0.2) },
      { month: 'Mar', sales: Math.round(totalSales * 0.18) },
      { month: 'Apr', sales: Math.round(totalSales * 0.22) },
      { month: 'May', sales: Math.round(totalSales * 0.25) },
      { month: 'Jun', sales: totalSales },
    ];

    res.status(200).json({
      success: true,
      metrics: {
        totalSales,
        revenue,
        customersCount: customers.length,
        activeOrdersCount,
        lowStockCount,
      },
      salesReport,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered customer files
// @route   GET /api/admin/customers
// @access  Private/Admin
exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    next(error);
  }
};
