const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Public: Get all active categories sorted by displayOrder
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    res.json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all categories (including inactive)
router.get('/admin/all', async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create category
router.post('/admin/create', async (req, res) => {
  try {
    const { name, isActive } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    // Auto-set displayOrder to end of list
    const count = await Category.countDocuments();

    const category = new Category({
      name,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: count
    });

    const saved = await category.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A category with this name already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update category
router.put('/admin/:id', async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const updates = { isActive };
    if (name) {
      updates.name = name;
      updates.slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete category
router.delete('/admin/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Reorder categories
router.patch('/admin/reorder', async (req, res) => {
  try {
    const { updates } = req.body; // [{ categoryId, displayOrder }]
    if (!Array.isArray(updates)) return res.status(400).json({ message: 'Updates must be an array' });

    const results = [];
    for (const { categoryId, displayOrder } of updates) {
      const cat = await Category.findByIdAndUpdate(categoryId, { displayOrder }, { new: true });
      if (cat) results.push(cat);
    }

    res.json({ message: 'Categories reordered', updated: results.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;