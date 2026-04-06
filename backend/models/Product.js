const mongoose = require('mongoose');
require('./ModifierGroup'); // ensure ModifierGroup is registered for populate

const variantSchema = new mongoose.Schema({
  name: String,
  options: [
    {
      name: String,
      priceModifier: { type: Number, default: 0 },
      isAvailable: { type: Boolean, default: true }
    }
  ]
});

const sauceSchema = new mongoose.Schema({
  name: String,
  maxSelections: { type: Number, default: 1 },
  options: [
    {
      name: String,
      price: { type: Number, default: 0 },
      isAvailable: { type: Boolean, default: true }
    }
  ],
  variantLimits: [
    {
      variantName: String,
      maxSelections: { type: Number, default: 1 }
    }
  ]
});

const addonSchema = new mongoose.Schema({
  name: String,
  price: Number,
  isAvailable: { type: Boolean, default: true }
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
    // CHANGED: no longer an enum — category is a slug string matching Category.slug
    category: {
      type: String,
      required: true
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    image: String,
    variants: [variantSchema],
    sauces: [sauceSchema],
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
    },
    isPopularPick: {
      type: Boolean,
      default: false
    },
    allowSpecialRequests: { type: Boolean, default: false },
    variantsEnabled: { type: Boolean, default: true },
    saucesEnabled: { type: Boolean, default: true },
    addonsEnabled: { type: Boolean, default: true },
    modifierGroups: [
      {
        group: { type: mongoose.Schema.Types.ObjectId, ref: 'ModifierGroup' },
        enabled: { type: Boolean, default: true },
        _id: false
      }
    ],
    variantSauceLimits: [
      {
        variantName: { type: String, required: true },
        maxSauces: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);