/**
 * The single "a QR Ph PaymentIntent settled → advance the order" routine.
 *
 * Called from three places, all of which must behave identically:
 *   - the PayMongo `payment.paid` webhook          (routes/webhooks.js)
 *   - the status-poll reconcile                     (GET  /orders/:id/status)
 *   - the QR-generate idempotency check             (POST /orders/:id/qrph, PI succeeded)
 *
 * Idempotent on `paymongo.status === 'paid'`. The admin fan-out (email + bell
 * Notification + `new-order` socket event) is delegated to notifyQRPhOrderPaid, which
 * has its own persisted guard so the webhook and the reconcile can race without
 * double-notifying.
 */
const { notifyQRPhOrderPaid } = require('./orderNotifications');

/**
 * @param {import('mongoose').Document} order - Order doc; `user` may or may not be populated
 * @param {object|null} io - Socket.io server (req.app.get('io')); may be null
 * @param {string} [paymentId] - PayMongo Payment resource id, when known
 */
async function markQRPhOrderPaid(order, io, paymentId) {
  if (order.paymongo?.status === 'paid') {
    // Recover a notification that failed on a previous attempt. No-op if already sent.
    await notifyQRPhOrderPaid(order, io);
    return;
  }

  // Never resurrect a cancelled order into the kitchen queue. A late `payment.paid`
  // for an order the customer already cancelled records the payment fact but does not
  // flip the status. Refund handling is a manual admin process (out of scope).
  if (order.status === 'cancelled') {
    order.paymongo.paymentId = paymentId || order.paymongo.paymentId || null;
    order.paymongo.status = 'paid';
    order.paymongo.paidAt = order.paymongo.paidAt || new Date();
    await order.save();
    console.warn(
      `[QRPH] markQRPhOrderPaid: order ${order._id} is CANCELLED — recorded payment, left status 'cancelled'.`
    );
    return;
  }

  order.paymongo.paymentId = paymentId || order.paymongo.paymentId || null;
  order.paymongo.status = 'paid';
  order.paymongo.paidAt = new Date();
  order.status = 'pending'; // enters the kitchen queue
  await order.save();

  console.log(`[QRPH] Order ${order._id} marked paid at ${order.paymongo.paidAt.toISOString()}`);

  await notifyQRPhOrderPaid(order, io);
}

module.exports = { markQRPhOrderPaid };
