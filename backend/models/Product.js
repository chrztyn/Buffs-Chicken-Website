const mongoose = require('mongoose');
require('./ModifierGroup'); // ensure ModifierGroup is registered for populate

const variantSchema = new mongoose.Schema({
  name: String, // e.g., "Pieces", "Size"
  options: [
    {
      name: String, // e.g., "6 Pieces", "Small"
      priceModifier: { type: Number, default: 0 },
      isAvailable: { type: Boolean, default: true }
    }
  ]
});

const sauceSchema = new mongoose.Schema({
  name: String, // e.g., "Sauce Type"
  maxSelections: { type: Number, default: 1 }, // How many sauces user can pick
  options: [
    {
      name: String, // e.g., "Spicy", "Mild"
      price: { type: Number, default: 0 }, // Free sauces
      isAvailable: { type: Boolean, default: true }
    }
  ]
});

const addonSchema = new mongoose.Schema({
  name: String, // e.g., "Extra Cheese"
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
    category: {
      type: String,
      enum: ['wings', 'sandwiches', 'combos', 'sides', 'meals', 'pasta'],
      required: true
    },
    image: String, // URL to image
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
    // Group-level modifier toggles (legacy – kept for backward compat)
    variantsEnabled: { type: Boolean, default: true },
    saucesEnabled: { type: Boolean, default: true },
    addonsEnabled: { type: Boolean, default: true },
    // Global modifier groups (new system)
    modifierGroups: [
      {
        group: { type: mongoose.Schema.Types.ObjectId, ref: 'ModifierGroup' },
        enabled: { type: Boolean, default: true },
        _id: false
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
