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
  itemTotal: Number,
  notes: String,
  voucher_free_item: {
    type: Boolean,
    default: false
  }
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
      // 'awaiting_payment' precedes 'pending' in the lifecycle — QR PH orders sit here
      // until the PayMongo `payment.paid` webhook fires. Kitchen views must exclude it.
      enum: ['awaiting_payment', 'pending', 'preparing', 'out for delivery', 'delivered', 'cancelled'],
      default: 'pending'
    },
    deliveryAddress: String,
    // Pinned delivery location from the map picker. Absent (lat null) on legacy orders —
    // those render from `deliveryAddress` instead. `deliveryAddress` is always kept in sync
    // (derived string) so existing screens need no change.
    deliveryLocation: {
      lat:          { type: Number, default: null },
      lng:          { type: Number, default: null },
      label:        { type: String, default: null }, // reverse-geocoded street/area, customer-editable
      note:         { type: String, default: null }, // unit / floor / house no. / landmark for the rider
      contactName:  { type: String, default: null },
      contactPhone: { type: String, default: null },
      mapsUrl:      { type: String, default: null }, // https://www.google.com/maps?q=lat,lng
      source:       { type: String, enum: ['pin', 'search', 'legacy'], default: 'pin' }
    },
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
      enum: ['gcash', 'maya', 'maribank', 'bpi', 'cash_on_delivery', 'qrph'],
      default: 'gcash'
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
    voucher: {
      code: { type: String, default: null },
      benefitType: { type: String, default: null },
      discountAmount: { type: Number, default: 0 },
      freeItemSnapshot: {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
        name: { type: String, default: null },
        variantLabel: { type: String, default: null },
        originalPrice: { type: Number, default: 0 }
      }
    },
    // PayMongo QR Ph payment tracking (PaymentIntent flow).
    // All-null for non-qrph orders (subdoc present but empty).
    paymongo: {
      paymentIntentId: { type: String, default: null },
      paymentMethodId: { type: String, default: null },
      paymentId:       { type: String, default: null },
      status:          { type: String, default: null }, // awaiting_next_action | paid | failed | expired
      qrCodeImageUrl:  { type: String, default: null }, // base64 data URI from next_action.code.image_url
      testUrl:         { type: String, default: null }, // test-mode payment simulation URL (null in live mode)
      paidAt:          { type: Date,   default: null }
    }
  },
  { timestamps: true }
);

// Sparse indexes — the webhook joins orders to PayMongo objects on these fields.
orderSchema.index({ 'paymongo.paymentIntentId': 1 }, { sparse: true });
orderSchema.index({ 'paymongo.paymentId': 1 }, { sparse: true });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORDER-${Date.now()}-${count + 1}`;
  }

  // Keep the legacy `deliveryAddress` string in sync with the pinned location so every
  // screen/report that reads `deliveryAddress` keeps working unchanged.
  const loc = this.deliveryLocation;
  if (loc && typeof loc.lat === 'number' && typeof loc.lng === 'number') {
    if (!loc.mapsUrl) loc.mapsUrl = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
    const parts = [];
    if (loc.label) parts.push(loc.label);
    if (loc.note) parts.push(`(${loc.note})`);
    parts.push(`— ${loc.lat},${loc.lng}`);
    this.deliveryAddress = parts.join(' ');
  }

  next();
});

module.exports = mongoose.model('Order', orderSchema);
