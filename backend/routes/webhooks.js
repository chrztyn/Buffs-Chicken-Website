const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Order = require('../models/Order');

/**
 * POST /api/webhooks/paymongo
 *
 * Receives and processes PayMongo QR Ph payment lifecycle events.
 * Uses express.raw() for this route only — this router MUST be mounted BEFORE
 * express.json() in server.js, otherwise req.body is a parsed object and the
 * PayMongo signature (computed over the raw body) can never verify.
 *
 * QR Ph uses the PaymentIntent flow, so the relevant events are:
 *   payment.paid    -> mark order paid, flip order.status to 'pending', emit new-order
 *   payment.failed  -> mark paymongo.status 'failed'
 *   qrph.expired    -> mark paymongo.status 'expired'
 * Orders are joined to events on the PaymentIntent id.
 */
router.post('/paymongo', express.raw({ type: 'application/json' }), async (req, res) => {
  // ── Step 1: verify PayMongo signature ────────────────────────────────────
  const sigHeader = req.headers['paymongo-signature'];
  if (!sigHeader) {
    console.warn('[WEBHOOK] Request with no paymongo-signature header — rejected.');
    return res.status(400).send('Missing signature.');
  }

  let sigParts;
  try {
    sigParts = Object.fromEntries(sigHeader.split(',').map((p) => p.split('=')));
  } catch {
    console.warn('[WEBHOOK] Malformed paymongo-signature header — rejected.');
    return res.status(400).send('Malformed signature header.');
  }

  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : String(req.body || '');
  const toSign = `${sigParts.t}.${rawBody}`;
  const expected = crypto
    .createHmac('sha256', process.env.PAYMONGO_WEBHOOK_SECRET || '')
    .update(toSign)
    .digest('hex');

  // PayMongo sends 'te' for test-mode events, 'li' for live-mode events.
  const received = sigParts.te || sigParts.li;
  const ok =
    received &&
    received.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));
  if (!ok) {
    console.warn('[WEBHOOK] Signature mismatch — possible spoofed or replayed request. Rejected.');
    return res.status(400).send('Invalid signature.');
  }

  // ── Step 2: parse payload ───────────────────────────────────────────────
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    console.error('[WEBHOOK] Failed to parse JSON body after signature passed.');
    return res.status(400).send('Invalid JSON.');
  }

  const eventType = event?.data?.attributes?.type;
  const resource = event?.data?.attributes?.data; // the Payment / PaymentIntent resource
  if (!eventType || !resource) {
    console.warn('[WEBHOOK] Unexpected payload shape — missing type or data. Acknowledged.');
    return res.sendStatus(200);
  }

  console.log(`[WEBHOOK] Received event: ${eventType}`);

  // PaymentIntent id is on the Payment resource as attributes.payment_intent_id;
  // for qrph.expired the resource is the PaymentIntent itself (resource.id).
  const paymentIntentId =
    resource.attributes?.payment_intent_id ||
    (resource.type === 'payment_intent' ? resource.id : null);

  const findOrder = () =>
    paymentIntentId
      ? Order.findOne({ 'paymongo.paymentIntentId': paymentIntentId })
      : Promise.resolve(null);

  // ── payment.paid ───────────────────────────────────────────────────────
  if (eventType === 'payment.paid') {
    try {
      const order = await (paymentIntentId
        ? Order.findOne({ 'paymongo.paymentIntentId': paymentIntentId }).populate('user')
        : Promise.resolve(null));
      if (!order) {
        console.warn(`[WEBHOOK] payment.paid: no order for payment_intent_id=${paymentIntentId}. Acknowledged.`);
        return res.sendStatus(200);
      }
      if (order.paymongo.status === 'paid') {
        console.log(`[WEBHOOK] payment.paid: order ${order._id} already paid. Skipping.`);
        return res.sendStatus(200);
      }

      order.paymongo.paymentId = resource.id;
      order.paymongo.status = 'paid';
      order.paymongo.paidAt = new Date();
      order.status = 'pending'; // enters the kitchen queue
      await order.save();

      const user = order.user;
      const io = req.app.get('io');
      if (io) {
        io.to('admin-orders').emit('new-order', {
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
          paymentMethod: 'qrph',
          voucher: order.voucher?.code ? order.voucher : null,
          paidAt: order.paymongo.paidAt,
          status: 'pending',
          timestamp: new Date(),
        });
        console.log(`[WEBHOOK] payment.paid: emitted new-order to admin-orders for order ${order._id}`);
      } else {
        console.warn('[WEBHOOK] payment.paid: Socket.io (io) not found on app — admin not notified in real-time.');
      }

      // TODO: trigger customer order-confirmation email here once template is confirmed.

      console.log(`[WEBHOOK] payment.paid: Order ${order._id} confirmed paid via QR Ph at ${order.paymongo.paidAt.toISOString()}`);
      return res.sendStatus(200);
    } catch (err) {
      console.error('[WEBHOOK] payment.paid handler error:', err.message);
      return res.sendStatus(500);
    }
  }

  // ── payment.failed ─────────────────────────────────────────────────────
  if (eventType === 'payment.failed') {
    try {
      const order = await findOrder();
      if (order) {
        order.paymongo.status = 'failed';
        await order.save();
        console.warn(`[WEBHOOK] payment.failed: order ${order._id} payment failed.`);
      } else {
        console.warn(`[WEBHOOK] payment.failed: no order for payment_intent_id=${paymentIntentId}. Acknowledged.`);
      }
    } catch (err) {
      console.error('[WEBHOOK] payment.failed handler error:', err.message);
    }
    return res.sendStatus(200);
  }

  // ── qrph.expired ───────────────────────────────────────────────────────
  if (eventType === 'qrph.expired') {
    try {
      const order = await findOrder();
      if (order && order.paymongo.status !== 'paid') {
        order.paymongo.status = 'expired';
        await order.save();
        console.warn(`[WEBHOOK] qrph.expired: order ${order._id} QR code expired.`);
      } else if (!order) {
        console.warn(`[WEBHOOK] qrph.expired: no order for payment_intent_id=${paymentIntentId}. Acknowledged.`);
      }
    } catch (err) {
      console.error('[WEBHOOK] qrph.expired handler error:', err.message);
    }
    return res.sendStatus(200);
  }

  // Unknown but validly-signed event — acknowledge silently.
  return res.sendStatus(200);
});

module.exports = router;
