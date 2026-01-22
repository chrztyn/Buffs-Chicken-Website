const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const authenticateAdmin = require('../middleware/authenticateAdmin');

// Get all published blogs (for public viewing)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .select('-content')
      .sort({ publishedAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single blog by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
      .populate('author', 'name email');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blogs by category
router.get('/category/:category', async (req, res) => {
  try {
    const blogs = await Blog.find({ category: req.params.category, isPublished: true })
      .select('-content')
      .sort({ publishedAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
