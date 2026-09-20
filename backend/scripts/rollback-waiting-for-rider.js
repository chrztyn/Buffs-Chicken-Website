/**
 * Rollback helper for Phase 2 (the "waiting for rider" order status).
 *
 * Run this BEFORE reverting the code / the Order enum. Any order still sitting in
 * 'waiting for rider' would become unsaveable once the enum value is gone, so this
 * moves them back to 'preparing' and remaps the notification type.
 *
 * Usage:  MONGODB_URI=<uri> node scripts/rollback-waiting-for-rider.js [--dry-run]
 */
const mongoose = require('mongoose');

const DRY = process.argv.includes('--dry-run');
const URI = process.env.MONGODB_URI;

async function main() {
  if (!URI) throw new Error('MONGODB_URI is required');
  await mongoose.connect(URI);
  const Order = require('../models/Order');
  const Notification = require('../models/Notification');

  const stuckOrders = await Order.countDocuments({ status: 'waiting for rider' });
  const stuckNotes = await Notification.countDocuments({ type: 'order_waiting_for_rider' });
  console.log(`Orders in 'waiting for rider': ${stuckOrders}`);
  console.log(`Notifications of type 'order_waiting_for_rider': ${stuckNotes}`);

  if (DRY) {
    console.log('--dry-run: no changes written.');
    await mongoose.disconnect();
    return;
  }

  const o = await Order.updateMany(
    { status: 'waiting for rider' },
    { $set: { status: 'preparing' } }
  );
  const n = await Notification.updateMany(
    { type: 'order_waiting_for_rider' },
    { $set: { type: 'order_preparing' } }
  );
  console.log(`Reverted ${o.modifiedCount} orders -> 'preparing'.`);
  console.log(`Remapped ${n.modifiedCount} notifications -> 'order_preparing'.`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('[rollback] FAILED:', err);
  process.exit(1);
});
