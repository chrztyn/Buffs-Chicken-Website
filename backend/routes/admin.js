const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Blog = require('../models/Blog');
const Notification = require('../models/Notification');
const authenticateAdmin = require('../middleware/authenticateAdmin');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure backend-images directory exists
const backendImagesDir = path.join(__dirname, '../public/backend-images');
if (!fs.existsSync(backendImagesDir)) {
  fs.mkdirSync(backendImagesDir, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to save image locally
const saveImageLocally = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const filename = `${name}-${uniqueSuffix}${ext}`;
      const filepath = path.join(backendImagesDir, filename);
      
      fs.writeFileSync(filepath, file.buffer);
      resolve(`/backend-images/${filename}`);
    } catch (error) {
      reject(error);
    }
  });
};


// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== UPLOAD ROUTES ==========

// Upload image endpoint
router.post('/upload', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    console.log('Image upload request received:', req.file.originalname);

    // Save locally (primary storage)
    const localUrl = await saveImageLocally(req.file);
    console.log('Image saved locally:', localUrl);

    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5001';
    const fullUrl = `${protocol}://${host}${localUrl}`;

    res.json({ 
      message: 'Image uploaded successfully',
      url: fullUrl
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

// ========== PRODUCT ROUTES ==========

// Create product
router.post('/products', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, variants, addons } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await saveImageLocally(req.file);
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image: imageUrl,
      variants: variants ? JSON.parse(variants) : [],
      addons: addons ? JSON.parse(addons) : []
    });

    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/products/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, variants, addons, isAvailable } = req.body;
    const updateData = { name, description, price, category, isAvailable };

    if (req.file) {
      updateData.image = await saveImageLocally(req.file);
    }

    if (variants) updateData.variants = JSON.parse(variants);
    if (addons) updateData.addons = JSON.parse(addons);

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/products/:id', authenticateAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== CATEGORY ROUTES ==========

// Create category
router.post('/categories', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, displayOrder } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await saveImageLocally(req.file);
    }

    const category = new Category({
      name,
      description,
      image: imageUrl,
      displayOrder,
      slug: name.toLowerCase().replace(/\s+/g, '-')
    });

    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update category
router.put('/categories/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, displayOrder } = req.body;
    const updateData = { name, description, displayOrder };

    if (req.file) {
      updateData.image = await saveImageLocally(req.file);
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: 'Category updated', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete category
router.delete('/categories/:id', authenticateAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== BLOG ROUTES ==========

// Upload blog image
router.post('/blogs/upload', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    console.log('Blog image upload request received:', req.file.originalname);

    // Save locally
    const localUrl = await saveImageLocally(req.file);
    console.log('Blog image saved locally:', localUrl);

    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5001';
    const fullUrl = `${protocol}://${host}${localUrl}`;

    res.json({ 
      message: 'Blog image uploaded successfully',
      url: fullUrl
    });
  } catch (error) {
    console.error('Blog image upload error:', error);
    res.status(500).json({ message: 'Failed to upload blog image', error: error.message });
  }
});

// Create blog
router.post('/blogs', authenticateAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, metaDescription, image, isPublished } = req.body;

    console.log('Blog creation request received:', {
      title,
      excerpt,
      content: content?.substring(0, 50) + '...',
      metaDescription,
      image: image ? `${image.substring(0, 50)}...` : 'NO IMAGE',
      isPublished
    })

    const slug = title.toLowerCase().replace(/\s+/g, '-');

    const blog = new Blog({
      title,
      excerpt,
      description: excerpt, // Use excerpt as description
      content,
      image: image || null,
      metaDescription,
      slug,
      author: req.admin.id,
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null
    });

    await blog.save();

    console.log('Blog created successfully:', {
      id: blog._id,
      title: blog.title,
      image: blog.image ? 'YES' : 'NO',
      publishedAt: blog.publishedAt
    })

    res.status(201).json({ message: 'Blog created', blog });
  } catch (error) {
    console.error('Blog creation error:', error)
    res.status(500).json({ message: error.message });
  }
});

// Update blog
router.put('/blogs/:id', authenticateAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, metaDescription, image, isPublished } = req.body;
    const updateData = { title, excerpt, description: excerpt, content, metaDescription, isPublished };

    if (image) {
      updateData.image = image;
    }

    if (title) updateData.slug = title.toLowerCase().replace(/\s+/g, '-');

    // Only set publishedAt if blog is being published and doesn't have a publishedAt date yet
    const existingBlog = await Blog.findById(req.params.id);
    if (isPublished === true && !existingBlog.publishedAt) {
      updateData.publishedAt = new Date();
    } else if (isPublished === false) {
      updateData.publishedAt = null; // Clear publishedAt if unpublishing
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: 'Blog updated', blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete blog
router.delete('/blogs/:id', authenticateAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all blogs (admin view - including unpublished)
router.get('/blogs', authenticateAdmin, async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name email').sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== ORDER ROUTES ==========

// Get all orders (admin view)
router.get('/orders', authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    console.log(`[ORDER UPDATE] Attempting to update order ${orderId} to status: ${status}`);

    if (!['pending', 'preparing', 'out for delivery', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('user');

    console.log(`[ORDER UPDATE] Order updated successfully. New status: ${order.status}`);

    // Send notification email
    const statusMessages = {
      pending: 'Your order has been confirmed.',
      preparing: 'Your order is being prepared.',
      'out for delivery': 'Your order is out for delivery.',
      delivered: 'Your order has been delivered.',
      cancelled: 'Your order has been cancelled.'
    };

    // Map status to notification type
    const statusToNotificationType = {
      pending: 'order_confirmed',
      preparing: 'order_preparing',
      'out for delivery': 'order_out_for_delivery',
      delivered: 'order_delivered',
      cancelled: 'order_cancelled'
    };

    try {
      const { sendOrderNotification } = require('../config/mailer');
      await sendOrderNotification(order.user.email, order.orderNumber, status);
    } catch (error) {
      console.log('Email notification failed:', error);
    }

    // Create notification for user
    await Notification.create({
      user: order.user._id,
      order: order._id,
      type: statusToNotificationType[status],
      title: 'Order Update',
      message: statusMessages[status]
    });

    // Emit real-time notification to order-specific room
    req.io.to(`order-${order._id}`).emit('order-status', {
      orderId: order._id,
      status,
      message: statusMessages[status]
    });

    // Also emit to user room for other listeners
    req.io.to(`user-${order.user._id}`).emit('order-status', {
      orderId: order._id,
      status,
      message: statusMessages[status]
    });

    // Notify admin
    req.io.to('admin-orders').emit('order-updated', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status,
      timestamp: new Date()
    });

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error(`[ORDER UPDATE ERROR] ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

// Verify order status (for debugging)
router.get('/orders/:id/verify', authenticateAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).select('orderNumber status updatedAt');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ 
      message: 'Order status verified',
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      lastUpdated: order.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== ANALYTICS ==========

// Get dashboard analytics
router.get('/analytics/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'out for delivery', 'preparing'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(10);

    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus,
      recentOrders,
      totalProducts,
      totalCategories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
