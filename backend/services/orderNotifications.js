/**
 * Admin-facing notifications for a QR Ph order that has just been marked paid.
 *
 * Before this module existed the "a new order arrived" fan-out (admin email + admin
 * bell Notification + `new-order` socket event) was copy-pasted in three places and
 * the QR Ph paid path only did the socket emit. Everything now goes through
 * notifyQRPhOrderPaid(), which is idempotent: the webhook and the status-poll
 * reconcile can both call it and exactly one set of notifications goes out.
 */
const Order = require('../models/Order');
const User = require('../models/User');
const Notification = require('../models/Notification');
// Namespace import (not destructured) so the send can be spied in tests.
const mailer = require('../config/mailer');

const ADMIN_ORDERS_ROOM = 'admin-orders';

/**
 * The canonical `new-order` socket payload the admin dashboard expects.
 * Mirrors the shape emitted from POST /orders/:orderId/receipt.
 */
function buildNewOrderPayload(order, user) {
  return {
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
    deliveryLocation: order.deliveryLocation || null,
    paymentMethod: 'qrph',
    voucher: order.voucher?.code ? order.voucher : null,
    paidAt: order.paymongo?.paidAt,
    status: order.status,
    timestamp: new Date(),
  };
}

/**
 * Notify the admin that a QR Ph order was paid. Call AFTER the order has been saved
 * as paid.
 *
 * @param {import('mongoose').Document} order - Order doc (user may or may not be populated)
 * @param {object|null} io - Socket.io server instance (from req.app.get('io')); may be null
 * @returns {Promise<boolean>} true if this call delivered the notifications,
 *                             false if a previous call already did
 */
async function notifyQRPhOrderPaid(order, io) {
  if (order?.paymongo?.adminNotifiedAt) return false;

  // Claim the guard with a conditional update so a concurrent caller (webhook vs poll)
  // cannot both pass. Only the writer that flips adminNotifiedAt from null proceeds.
  const claim = await Order.updateOne(
    { _id: order._id, 'paymongo.adminNotifiedAt': null },
    { $set: { 'paymongo.adminNotifiedAt': new Date() } }
  );
  if (!claim.modifiedCount) return false;
  if (order.paymongo) order.paymongo.adminNotifiedAt = new Date();

  const user =
    order.user && order.user._id ? order.user : await User.findById(order.user);

  // 1. Admin bell notification
  try {
    await Notification.create({
      type: 'new_order',
      order: order._id,
      title: 'New Order Received',
      message: `New QR Ph order ${order.orderNumber} from ${user?.name || 'customer'}`,
    });
  } catch (err) {
    console.error('[QRPH] admin Notification.create failed:', err.message);
  }

  // 2. Admin email — same template as the receipt-upload flow
  try {
    await mailer.sendAdminOrderNotification(
      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      order,
      {
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        address: order.deliveryAddress,
      }
    );
  } catch (err) {
    console.error('[QRPH] admin email failed:', err.message);
  }

  // 3. Real-time admin dashboard
  if (io) {
    io.to(ADMIN_ORDERS_ROOM).emit('new-order', buildNewOrderPayload(order, user));
    console.log(`[QRPH] notifyQRPhOrderPaid: emitted new-order for order ${order._id}`);
  } else {
    console.warn('[QRPH] notifyQRPhOrderPaid: no io — admin not notified in real-time');
  }

  return true;
}

module.exports = { notifyQRPhOrderPaid, buildNewOrderPayload, ADMIN_ORDERS_ROOM };
