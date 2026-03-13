const mongoose = require('mongoose');

const modifierItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priceModifier: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true }
}, { _id: true });

const modifierGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  minSelections: { type: Number, default: 0 }, // 0 = optional, 1+ = required
  maxSelections: { type: Number, default: 0 }, // 0 = unlimited, 1 = single-select (radio)
  items: [modifierItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('ModifierGroup', modifierGroupSchema);
