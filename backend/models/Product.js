const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: String, // e.g., "Size"
  options: [
    {
      name: String, // e.g., "Small", "Large"
      priceModifier: { type: Number, default: 0 }
    }
  ]
});

const addonSchema = new mongoose.Schema({
  name: String, // e.g., "Extra Cheese"
  price: Number
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    image: String, // URL to image
    variants: [variantSchema],
    addons: [addonSchema],
    isAvailable: {
      type: Boolean,
      default: true
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
