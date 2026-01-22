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
    of: String // Map variant name to selected option
  },
  selectedAddons: [
    {
      name: String,
      price: Number
    }
  ],
  itemTotal: Number // price * quantity + addons total
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sessionId: String, // For anonymous users
    items: [cartItemSchema],
    cartTotal: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
