const mongoose = require('mongoose');

const PriceUpdateSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['Steel TMT Bars', 'Cement', 'Binding Wire'],
      unique: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    previousPrice: {
      type: Number,
      required: true,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PriceUpdate', PriceUpdateSchema);
