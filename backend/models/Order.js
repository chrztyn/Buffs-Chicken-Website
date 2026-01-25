const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: String,
  productImage: String,
  quantity: Number,
  pricePerUnit: Number,
  selectedVariants: Map,
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

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [orderItemSchema],
    subtotal: Number,
    tax: {
      type: Number,
      default: 0
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    totalAmount: Number,
    status: {
      type: String,
      enum: ['pending', 'preparing', 'out for delivery', 'delivered', 'cancelled'],
      default: 'pending'
    },
    deliveryAddress: String,
    deliveryDate: {
      type: Date,
      default: Date.now
    },
    estimatedDeliveryTime: String,
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    notes: String,
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORDER-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
