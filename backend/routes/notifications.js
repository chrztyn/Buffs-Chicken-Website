const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get user notifications
router.get('/user/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId })
      .populate('order')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get admin notifications
router.get('/admin', async (req, res) => {
  try {
    const notifications = await Notification.find({ admin: { $exists: false }, user: { $exists: false } })
      .populate('order')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.put('/:notificationId/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete notification
router.delete('/:notificationId', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.notificationId);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
