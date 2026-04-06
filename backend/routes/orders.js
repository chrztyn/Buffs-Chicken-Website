const express = require('express');
const multer = require('multer');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const StoreSettings = require('../models/StoreSettings');
const { sendOrderNotification, sendAdminOrderNotification } = require('../config/mailer');
const { sendOrderReceipt } = require('../utils/sendOrderReceipt');
const { saveReceipt, deleteReceipt } = require('../utils/receiptStorage');
const authenticateAdmin = require('../middleware/authenticateAdmin');

// Multer instance — memory storage; never writes raw files to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB hard limit
});

/**
 * Validate that sauce selections respect variant-specific limits.
 * @param {Array} cartItems - Cart items with product populated
 * @param {Object} productMap - Map of product proxies for quick lookup
 * @throws {Error} if sauce limits are violated
 */
async function validateVariantSauceLimits(cartItems, productMap) {
  for (const cartItem of cartItems) {
    const product = cartItem.product || productMap[cartItem.productId];
    if (!product || !product.sauces || product.sauces.length === 0) {
      continue; // No sauces configured — skip
    }

    // Check each sauce group
    for (const sauceGroup of product.sauces) {
      const selectedCount = cartItem.selectedSauces?.filter(s => {
        // Match sauces belonging to this group
        const groupOption = sauceGroup.options?.find(opt => opt.name === s.name);
        return groupOption !== undefined;
      }).length || 0;

      if (selectedCount === 0) continue; // No sauces selected for this group

      // Find effective max for this sauce group based on selected variant
      let effectiveMax = sauceGroup.maxSelections; // Default to global max

      if (sauceGroup.variantLimits && sauceGroup.variantLimits.length > 0) {
        // Check if selected variant has a specific limit
        for (const variantName of Object.values(cartItem.selectedVariants || {})) {
          const variantLimit = sauceGroup.variantLimits.find(vl => vl.variantName === variantName);
          if (variantLimit) {
            effectiveMax = variantLimit.maxSelections;
            break;
          }
        }
      }

      // Validate
      if (selectedCount > effectiveMax) {
        throw new Error(
          `Invalid sauce selection for "${product.name}": ` +
          `Selected ${selectedCount} ${sauceGroup.name.toLowerCase()}, ` +
          `but limit is ${effectiveMax} for this variant`
        );
      }
    }
  }
}

// Create order from cart
router.post('/', async (req, res) => {
  try {
    // Check if store is open
    const storeSettings = await StoreSettings.getSettings();
    if (!storeSettings.isStoreOpen()) {
      return res.status(400).json({ 
        success: false,
        message: 'Store is currently closed. Please try again during our operating hours.',
        storeClosed: true
      });
    }

    const { userId, cartId, deliveryAddress, notes, subtotal, tax } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'User not verified or not found' });
    }

    const cart = await Cart.findById(cartId).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate variant-specific sauce limits
    try {
      await validateVariantSauceLimits(cart.items, {});
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError.message,
        code: 'INVALID_SAUCE_SELECTION'
      });
    }

    // Create order items from cart items
    const orderItems = cart.items.map(cartItem => ({
      product: cartItem.product._id,
      productName: cartItem.product.name,
      productImage: cartItem.product.image,
      quantity: cartItem.quantity,
      pricePerUnit: cartItem.product.price,
      selectedVariants: cartItem.selectedVariants,
      selectedSauces: cartItem.selectedSauces,
      selectedAddons: cartItem.selectedAddons,
      itemTotal: cartItem.itemTotal
    }));

    const totalAmount = subtotal + tax;

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      subtotal,
      tax,
      totalAmount,
      deliveryAddress: deliveryAddress || user.location,
      status: 'pending'
    });

    await order.save();

    // Clear cart
    await Cart.findByIdAndUpdate(cartId, { items: [], cartTotal: 0 });

    // Re-fetch user to ensure latest data is available
    const freshUser = await User.findById(userId);

    // Send branded receipt email (fire-and-forget — never blocks the order response)
    sendOrderReceipt(order, freshUser).catch(() => {});

    // Send admin notification email
    try {
      await sendAdminOrderNotification(process.env.ADMIN_EMAIL || process.env.EMAIL_USER, order, {
        name: freshUser.name,
        email: freshUser.email,
        phone: freshUser.phone,
        address: order.deliveryAddress
      });
    } catch (error) {
      console.log('Admin email notification failed, but order created:', error);
    }

    // Create database notification for user
    await Notification.create({
      user: userId,
      order: order._id,
      type: 'order_confirmed',
      title: 'Order Confirmed',
      message: `Your order ${order.orderNumber} has been received.`
    });

    // Create database notification for admin
    await Notification.create({
      type: 'new_order',
      order: order._id,
      title: 'New Order Received',
      message: `New order ${order.orderNumber} from ${freshUser.name}`
    });

    // Emit real-time notification to admin with complete order data
    req.io.to('admin-orders').emit('new-order', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      userId: freshUser._id,
      customerName: freshUser.name || 'Unknown Customer',
      customerEmail: freshUser.email,
      customerPhone: freshUser.phone,
      items: orderItems,
      subtotal: order.subtotal,
      tax: order.tax,
      totalAmount: order.totalAmount,
      deliveryAddress: order.deliveryAddress,
      status: order.status,
      timestamp: new Date()
    });

    // Emit to specific user
    req.io.to(`user-${userId}`).emit('order-status', {
      orderId: order._id,
      status: 'pending',
      message: 'Order received'
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user's orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /summary/today — today's order summary (Philippines time UTC+8)
router.get('/summary/today', authenticateAdmin, async (req, res) => {
  try {
    const PH_OFFSET_MS = 8 * 60 * 60 * 1000;
    const now = new Date();
    const phNow = new Date(now.getTime() + PH_OFFSET_MS);

    // Midnight today in PH time, converted back to UTC for MongoDB query
    const phStartOfDay = new Date(
      Date.UTC(phNow.getUTCFullYear(), phNow.getUTCMonth(), phNow.getUTCDate(), 0, 0, 0, 0) - PH_OFFSET_MS
    );
    const phEndOfDay = new Date(
      Date.UTC(phNow.getUTCFullYear(), phNow.getUTCMonth(), phNow.getUTCDate(), 23, 59, 59, 999) - PH_OFFSET_MS
    );

    const todayOrders = await Order.find({
      createdAt: { $gte: phStartOfDay, $lte: phEndOfDay }
    })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const totalOrders = todayOrders.length;
    const totalRevenue = todayOrders.reduce(
      (sum, o) => (o.status !== 'cancelled' ? sum + o.totalAmount : sum),
      0
    );

    const paymentMethods = ['cash_on_delivery', 'gcash', 'maya', 'maribank', 'bpi'];
    const paymentBreakdown = {};
    paymentMethods.forEach(m => { paymentBreakdown[m] = { count: 0, total: 0 }; });
    todayOrders.forEach(order => {
      const m = order.paymentMethod || 'cash_on_delivery';
      if (paymentBreakdown[m]) {
        paymentBreakdown[m].count += 1;
        if (order.status !== 'cancelled') paymentBreakdown[m].total += order.totalAmount;
      }
    });

    const formatTimePH = (date) => {
      const d = new Date(new Date(date).getTime() + PH_OFFSET_MS);
      let h = d.getUTCHours();
      const min = d.getUTCMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${min} ${ampm}`;
    };

    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dateStr = `${MONTHS[phNow.getUTCMonth()]} ${phNow.getUTCDate()}, ${phNow.getUTCFullYear()}`;

    const orders = todayOrders.map(o => ({
      orderNumber: o.orderNumber,
      customerName: o.user?.name || 'Guest',
      paymentMethod: o.paymentMethod || 'cash_on_delivery',
      totalAmount: o.totalAmount,
      status: o.status,
      createdAt: formatTimePH(o.createdAt)
    }));

    res.json({ date: dateStr, totalOrders, totalRevenue, paymentBreakdown, orders });
  } catch (error) {
    console.error('Error fetching today\'s summary:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('items.product')
      .populate('user');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel order (only if pending)
router.put('/:orderId/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        message: 'Order cannot be cancelled. It is already being prepared or out for delivery.'
      });
    }

    order.status = 'cancelled';
    await order.save();

    const user = await User.findById(order.user);

    // Send email notification
    try {
      await sendOrderNotification(user.email, order.orderNumber, 'cancelled');
    } catch (error) {
      console.log('Email notification failed:', error);
    }

    // Create notification
    await Notification.create({
      user: order.user,
      order: order._id,
      type: 'order_cancelled',
      title: 'Order Cancelled',
      message: `Your order ${order.orderNumber} has been cancelled.`
    });

    // Emit real-time notification
    req.io.to(`user-${order.user}`).emit('order-status', {
      orderId: order._id,
      status: 'cancelled',
      message: 'Order cancelled'
    });

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reorder
router.post('/:orderId/reorder', async (req, res) => {
  try {
    const previousOrder = await Order.findById(req.params.orderId);
    if (!previousOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const newOrder = new Order({
      user: previousOrder.user,
      items: previousOrder.items,
      subtotal: previousOrder.subtotal,
      tax: previousOrder.tax,
      totalAmount: previousOrder.totalAmount,
      deliveryAddress: previousOrder.deliveryAddress,
      status: 'pending'
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Reorder created successfully',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit order after OTP verification (for direct cart checkout)
router.post('/submit', async (req, res) => {
  try {
    // Check if store is open
    const storeSettings = await StoreSettings.getSettings();
    if (!storeSettings.isStoreOpen()) {
      return res.status(400).json({ 
        success: false,
        message: 'Store is currently closed. Please try again during our operating hours.',
        storeClosed: true
      });
    }

    const { 
      userId, 
      name,
      email, 
      phone, 
      address, 
      cartItems, 
      subtotal, 
      total,
      notes,
      paymentMethod,
      paymentReference,
      gcashReference
    } = req.body;

    // Verify user
    const user = await User.findById(userId);
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'User not verified' });
    }

    // Create order items from cart
    const orderItems = cartItems.map(item => ({
      product: item.id || item._id,
      productName: item.name,
      productImage: item.image,
      quantity: item.quantity,
      pricePerUnit: item.price,
      selectedVariants: item.selectedVariants || {},
      selectedSauces: item.selectedSauces || [],
      selectedAddons: item.selectedAddons || [],
      itemTotal: (item.basePrice || item.price) * item.quantity + (item.addonsCost || 0),
      notes: item.notes || '',
    }));

    // Calculate totals
    const tax = 0; // Can be calculated based on your tax rules
    const totalAmount = subtotal + tax;

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      subtotal,
      tax,
      totalAmount,
      deliveryAddress: address,
      status: 'pending',
      notes: notes || '',
      isVerified: true,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      paymentReference: ['gcash', 'maya', 'maribank', 'bpi'].includes(paymentMethod) ? (paymentReference || gcashReference) : null,
      gcashReference: paymentMethod === 'gcash' ? (gcashReference || paymentReference) : null
    });

    await order.save();

    // Re-fetch user to ensure latest data is available
    const freshUser = await User.findById(userId);

    // Create database notification for user (order received)
    await Notification.create({
      user: userId,
      order: order._id,
      type: 'order_confirmed',
      title: 'Order Confirmed',
      message: `Your order ${order.orderNumber} has been received.`
    });

    // NOTE: Admin notifications and customer receipt email are deferred.
    // They fire from POST /:orderId/receipt once the user uploads their receipt
    // and completes the full checkout flow (lands on order-status page).

    res.status(201).json({
      message: 'Order submitted successfully',
      order,
      orderNumber: order.orderNumber
    });
  } catch (error) {
    console.error('Error submitting order:', error);
    res.status(500).json({ message: error.message });
  }
});

// Cancel order (customer can only cancel pending orders)
router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order can only be cancelled from pending status' });
    }

    order.status = 'cancelled';
    await order.save();

    // Create notification for user
    await Notification.create({
      user: order.user._id,
      order: order._id,
      type: 'order_cancelled',
      title: 'Order Cancelled',
      message: 'Your order has been cancelled.'
    });

    // Emit real-time notification to order-specific room
    req.io.to(`order-${order._id}`).emit('order-status', {
      orderId: order._id,
      status: 'cancelled',
      message: 'Your order has been cancelled.'
    });

    // Emit to user room
    req.io.to(`user-${order.user._id}`).emit('order-status', {
      orderId: order._id,
      status: 'cancelled',
      message: 'Your order has been cancelled.'
    });

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /orders/:orderId/receipt — upload payment receipt (customer-facing)
router.post('/:orderId/receipt', upload.single('receipt'), async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'Receipt image is required.' });
    }

    // Validate MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type. Please upload an image.' });
    }

    // Validate raw size (multer limit covers >5 MB, but double-check here)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'Receipt image must be under 5MB.' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const { filename, path: filePath } = await saveReceipt(req.file.buffer, orderId);

    order.receiptImage = {
      filename,
      path: filePath,
      uploadedAt: new Date(),
      deletedAt: null,
    };
    await order.save();

    // Populate user for notifications
    const user = await User.findById(order.user);

    // 1. Send branded receipt email to customer
    sendOrderReceipt(order, user).catch(() => {});

    // 2. Create admin DB notification
    Notification.create({
      type: 'new_order',
      order: order._id,
      title: 'New Order Received',
      message: `New order ${order.orderNumber} from ${user?.name || 'customer'}`
    }).catch(() => {});

    // 3. Send admin notification email
    sendAdminOrderNotification(
      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      order,
      {
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        address: order.deliveryAddress
      }
    ).catch((err) => console.log('Admin email failed:', err));

    // 4. Notify admin in real-time with full order data
    if (req.io) {
      req.io.to('admin-orders').emit('new-order', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        userId: user?._id,
        customerName: user?.name || 'Unknown Customer',
        customerEmail: user?.email,
        customerPhone: user?.phone,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        totalAmount: order.totalAmount,
        deliveryAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod,
        receiptImage: order.receiptImage,
        status: 'pending',
        timestamp: new Date()
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error uploading receipt:', error);
    res.status(500).json({ message: error.message });
  }
});

// PATCH /orders/:orderId/verify-receipt — admin verifies and deletes receipt image
router.patch('/:orderId/verify-receipt', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('user');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.receiptImage && order.receiptImage.filename) {
      deleteReceipt(order.receiptImage.filename);
    }

    order.receiptImage = order.receiptImage || {};
    order.receiptImage.deletedAt = new Date();
    order.receiptVerified = true;
    order.receiptVerifiedAt = new Date();
    await order.save();

    res.json({ order });
  } catch (error) {
    console.error('Error verifying receipt:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
