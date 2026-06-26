const Order = require('../models/Order');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');

// @desc    Place a new B2B order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      items,
      deliveryAddress,
      deliveryDate,
      paymentMethod,
      gstin,
      razorpayOrderId,
      razorpayPaymentId,
    } = req.body;

    if (!items || items.length === 0) {
      res.statusCode = 400;
      throw new Error('Order items list cannot be empty');
    }

    let subtotal = 0;
    let orderItems = [];

    // Verify inventory quantities and calculate prices
    for (const item of items) {
      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) {
        res.statusCode = 404;
        throw new Error(`Product not found with ID ${item.productId}`);
      }

      if (dbProduct.stock < item.quantity) {
        res.statusCode = 400;
        throw new Error(`Insufficient stock for ${dbProduct.name}. Requested: ${item.quantity}, In stock: ${dbProduct.stock}`);
      }

      subtotal += dbProduct.price * item.quantity;
      orderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        quantity: item.quantity,
        price: dbProduct.price,
        unit: dbProduct.unit,
      });

      // Deduct stock levels
      dbProduct.stock -= item.quantity;
      await dbProduct.save();
    }

    // Standard B2B Steel/Cement GST is 18% in India
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);

    const order = await Order.create({
      orderId,
      user: req.user.id,
      customerName: req.user.name,
      customerMobile: req.user.mobile,
      customerGST: gstin || req.user.gstin || 'N/A',
      deliveryAddress,
      deliveryDate,
      items: orderItems,
      subtotal,
      gst,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'Credit Account' ? 'Pending' : 'Paid',
      razorpayOrderId,
      razorpayPaymentId,
      deliveryStatus: 'Order Confirmed',
      trackingHistory: [
        {
          status: 'Order Confirmed',
          time: new Date(),
          comment: `Order registered successfully via ${paymentMethod}.`,
        },
      ],
    });

    // Auto-generate Tax Invoice
    const invoiceNumber = 'INV-' + orderId.replace('ORD-', '');
    const cgst = Math.round(gst / 2);
    const sgst = Math.round(gst / 2);

    await Invoice.create({
      invoiceNumber,
      order: order._id,
      customerName: order.customerName,
      customerGST: order.customerGST,
      subtotal,
      cgst,
      sgst,
      total,
      invoiceDate: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Order successfully created. Dynamic GST invoice generated.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by B2B Order ID (for tracking/invoice)
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });

    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found');
    }

    // Only allow owner or admin to check order details
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.statusCode = 403;
      throw new Error('Not authorized to view this transaction');
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order shipping milestone (Admin Only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, comment } = req.body;
    const order = await Order.findOne({ orderId: req.params.id });

    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found');
    }

    const validStages = ['Order Confirmed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered'];
    if (!validStages.includes(status)) {
      res.statusCode = 400;
      throw new Error('Invalid delivery status value');
    }

    order.deliveryStatus = status;
    order.trackingHistory.push({
      status,
      time: new Date(),
      comment: comment || `Order stage transitioned to: ${status}`,
    });

    if (status === 'Delivered') {
      order.paymentStatus = 'Paid'; // mark credit accounts paid on receipt
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Logistics status updated to ${status}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch digital tax invoice for order
// @route   GET /api/orders/:id/invoice
// @access  Private
exports.getOrderInvoice = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.statusCode = 403;
      throw new Error('Not authorized to print this invoice');
    }

    const invoice = await Invoice.findOne({ order: order._id });
    if (!invoice) {
      res.statusCode = 404;
      throw new Error('Invoice file not found for this transaction');
    }

    res.status(200).json({
      success: true,
      invoice,
      order,
    });
  } catch (error) {
    next(error);
  }
};
