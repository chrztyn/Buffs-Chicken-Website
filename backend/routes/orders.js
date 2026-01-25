const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const { sendOrderNotification, sendAdminOrderNotification } = require('../config/mailer');

// Create order from cart
router.post('/', async (req, res) => {
  try {
    const { userId, cartId, deliveryAddress, notes, subtotal, tax, deliveryFee } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'User not verified or not found' });
    }

    const cart = await Cart.findById(cartId).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
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

    const totalAmount = subtotal + tax + deliveryFee;

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      deliveryAddress: deliveryAddress || user.location,
      status: 'pending'
    });

    await order.save();

    // Clear cart
    await Cart.findByIdAndUpdate(cartId, { items: [], cartTotal: 0 });

    // Send notification to user via email
    try {
      await sendOrderNotification(user.email, order.orderNumber, 'pending');
    } catch (error) {
      console.log('User email notification failed, but order created:', error);
    }

    // Send admin notification email
    try {
      await sendAdminOrderNotification(process.env.ADMIN_EMAIL || process.env.EMAIL_USER, order, {
        name: user.name,
        email: user.email,
        phone: user.phone,
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
      message: `New order ${order.orderNumber} from ${user.name}`
    });

    // Emit real-time notification to admin
    req.io.to('admin-orders').emit('new-order', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      customerName: user.name,
      totalAmount: order.totalAmount,
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
      deliveryFee: previousOrder.deliveryFee,
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
    const { 
      userId, 
      name,
      email, 
      phone, 
      address, 
      cartItems, 
      subtotal, 
      deliveryFee, 
      total,
      notes 
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
      itemTotal: (item.basePrice || item.price) * item.quantity + (item.addonsCost || 0)
    }));

    // Calculate totals
    const tax = 0; // Can be calculated based on your tax rules
    const totalAmount = subtotal + tax + deliveryFee;

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      deliveryAddress: address,
      status: 'pending',
      notes: notes || '',
      isVerified: true
    });

    await order.save();

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
      message: `New order ${order.orderNumber} from ${user.name}`
    });

    // Send notification to user via email
    try {
      await sendOrderNotification(email, order.orderNumber, 'pending');
    } catch (error) {
      console.log('User email notification failed, but order created:', error);
    }

    // Send admin notification email
    try {
      await sendAdminOrderNotification(process.env.ADMIN_EMAIL || process.env.EMAIL_USER, order, {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: order.deliveryAddress
      });
    } catch (error) {
      console.log('Admin email notification failed, but order created:', error);
    }

    // Emit real-time notification to admin
    if (req.io) {
      req.io.to('admin-orders').emit('new-order', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        customerName: user.name,
        totalAmount: order.totalAmount,
        timestamp: new Date(),
        status: 'pending'
      });

      // Emit to specific user
      req.io.to(`user-${userId}`).emit('order-status', {
        orderId: order._id,
        status: 'pending',
        message: 'Order received'
      });
    }

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

module.exports = router;
