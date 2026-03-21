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
    },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'gcash', 'maya', 'maribank', 'bpi'],
      default: 'cash_on_delivery'
    },
    gcashReference: {
      type: String,
      default: null
    },
    paymentReference: { type: String, default: null },
    receiptImage: {
      filename: { type: String, default: null },
      path: { type: String, default: null },
      uploadedAt: { type: Date, default: null },
      deletedAt: { type: Date, default: null },
    },
    receiptVerified: { type: Boolean, default: false },
    receiptVerifiedAt: { type: Date, default: null },
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
