const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Create payment intent (for Stripe integration)
router.post('/', async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const payment = new Payment({
      order: orderId,
      user: order.user,
      amount,
      paymentMethod,
      status: 'pending'
    });

    await payment.save();

    res.json({
      message: 'Payment created',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Confirm payment
router.post('/confirm/:paymentId', async (req, res) => {
  try {
    const { transactionId, status } = req.body;

    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status || 'success';
    payment.transactionId = transactionId;
    payment.paidAt = new Date();
    await payment.save();

    // Update order if payment successful
    if (payment.status === 'success') {
      const order = await Order.findByIdAndUpdate(
        payment.order,
        { isVerified: true },
        { new: true }
      );
    }

    res.json({
      message: 'Payment updated',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment by ID
router.get('/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
