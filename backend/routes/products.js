const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get popular picks (must be BEFORE /:id route)
router.get('/popular', async (req, res) => {
  try {
    const products = await Product.find({ isPopularPick: true, isAvailable: true })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const products = await Product.find({ isAvailable: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ isAvailable: true });

    res.json({
      data: products,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID with variants and addons
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
      isAvailable: true
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create product
router.post('/admin/create', async (req, res) => {
  try {
    const { name, description, price, category, image, variants, sauces, addons } = req.body;

    // Validation
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      variants: variants || [],
      sauces: sauces || [],
      addons: addons || [],
      isAvailable: true
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update product
router.put('/admin/:id', async (req, res) => {
  try {
    const { name, description, price, category, image, variants, sauces, addons, isAvailable, isPopularPick } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        image,
        variants: variants || [],
        sauces: sauces || [],
        addons: addons || [],
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        isPopularPick: isPopularPick !== undefined ? isPopularPick : false
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete product
router.delete('/admin/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all products (including unavailable)
router.get('/admin/all', async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
