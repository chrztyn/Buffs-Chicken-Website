const express = require('express');
const router = express.Router();
const ModifierGroup = require('../models/ModifierGroup');
const authenticateAdmin = require('../middleware/authenticateAdmin');

// GET all modifier groups (public – needed by customer-facing MenuModal)
router.get('/', async (req, res) => {
  try {
    const groups = await ModifierGroup.find().sort({ type: 1, name: 1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create modifier group (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const group = new ModifierGroup(req.body);
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update modifier group (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const group = await ModifierGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!group) return res.status(404).json({ message: 'Modifier group not found' });
    res.json(group);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE modifier group (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const group = await ModifierGroup.findByIdAndDelete(req.params.id);
    if (!group) return res.status(404).json({ message: 'Modifier group not found' });
    res.json({ message: 'Modifier group deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
