const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  selectedVariants: {
    type: Map,
    of: String 
  },
  selectedSauces: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number
    }
  ],
  selectedAddons: [
    {
      name: String,
      price: Number
    }
  ],
  itemTotal: Number 
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sessionId: String, 
    items: [cartItemSchema],
    cartTotal: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
