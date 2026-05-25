const mongoose = require('mongoose');

const freeItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variantLabel: {
    type: String,
    required: true
  },
  variantPrice: {
    type: Number,
    required: true
  }
}, { _id: false });

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    benefitType: {
      type: String,
      required: true,
      enum: ['percentage', 'fixed', 'free_item', 'free_delivery']
    },
    percentageAmount: {
      type: Number,
      default: null
    },
    maxDiscountCap: {
      type: Number,
      default: null
    },
    discountAmount: {
      type: Number,
      default: null
    },
    freeItem: {
      type: freeItemSchema,
      default: null
    },
    minimumOrderAmount: {
      type: Number,
      default: 0
    },
    usageCap: {
      type: Number,
      default: null
    },
    usageCount: {
      type: Number,
      default: 0
    },
    usedByEmails: {
      type: [String],
      default: []
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Voucher', voucherSchema);
