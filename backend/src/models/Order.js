const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
});

const TrackingEventSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Order Confirmed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered'],
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: String,
    default: '',
  },
});

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerMobile: {
      type: String,
      required: true,
    },
    customerGST: {
      type: String,
      default: 'N/A',
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    items: [OrderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Card', 'Net Banking', 'Credit Account'],
      default: 'UPI',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    deliveryStatus: {
      type: String,
      enum: ['Order Confirmed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered'],
      default: 'Order Confirmed',
    },
    trackingHistory: [TrackingEventSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', OrderSchema);
