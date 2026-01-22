const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    type: {
      type: String,
      enum: ['order_confirmed', 'order_preparing', 'order_out_for_delivery', 'order_delivered', 'order_cancelled', 'new_order', 'blog_published'],
      required: true
    },
    title: String,
    message: String,
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
