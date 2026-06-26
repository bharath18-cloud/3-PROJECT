const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      enum: ['Steel TMT Bars', 'Binding Wire', 'Cement', 'Construction Materials'],
    },
    brand: {
      type: String,
      required: [true, 'Please specify brand'],
      trim: true,
    },
    grade: {
      type: String,
      required: [true, 'Please specify grade/spec (e.g. Fe-550D, OPC 53)'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a base price'],
    },
    unit: {
      type: String,
      required: [true, 'Please add a measurement unit (e.g., Ton, Bag, Bundle)'],
      default: 'Ton',
    },
    stock: {
      type: Number,
      required: [true, 'Please add inventory stock level'],
      default: 0,
    },
    lowStock: {
      type: Number,
      required: [true, 'Please set low stock threshold for replenishment alerts'],
      default: 10,
    },
    spec: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: 'default-material',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', ProductSchema);
