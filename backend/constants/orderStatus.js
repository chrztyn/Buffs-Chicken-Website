/**
 * Single source of truth for the order-status pipeline.
 *
 * Enum values keep the existing lowercase-with-spaces style (e.g. 'out for delivery').
 * 'waiting for rider' sits between 'preparing' and 'out for delivery' — the order is
 * cooked and packed, waiting for a booked rider (Grab/Maxim) to pick it up.
 */
const ORDER_STATUS = {
  AWAITING_PAYMENT: 'awaiting_payment',
  PENDING: 'pending',
  PREPARING: 'preparing',
  WAITING_FOR_RIDER: 'waiting for rider',
  OUT_FOR_DELIVERY: 'out for delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Full lifecycle order, including the pre-payment state.
const ORDER_STATUS_LIFECYCLE = [
  ORDER_STATUS.AWAITING_PAYMENT,
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.WAITING_FOR_RIDER,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.CANCELLED,
];

// The statuses an admin can set via PUT /admin/orders/:id/status (no 'awaiting_payment').
const ADMIN_SETTABLE_STATUSES = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.WAITING_FOR_RIDER,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.CANCELLED,
];

// In the kitchen / in-flight — an order actively being worked (drives "active orders").
const ACTIVE_STATUSES = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.WAITING_FOR_RIDER,
  ORDER_STATUS.OUT_FOR_DELIVERY,
];

// Counts toward revenue (order was accepted and is being fulfilled or is done).
const REVENUE_STATUSES = [
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.WAITING_FOR_RIDER,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
];

// Customer-facing copy for status-change notifications / emails.
const STATUS_MESSAGES = {
  [ORDER_STATUS.PENDING]: 'Your order has been confirmed.',
  [ORDER_STATUS.PREPARING]: 'Your order is being prepared.',
  [ORDER_STATUS.WAITING_FOR_RIDER]: 'Your order is packed and waiting for a rider.',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Your order is out for delivery.',
  [ORDER_STATUS.DELIVERED]: 'Your order has been delivered.',
  [ORDER_STATUS.CANCELLED]: 'Your order has been cancelled.',
};

// Status -> Notification.type (see models/Notification.js enum).
const STATUS_NOTIFICATION_TYPE = {
  [ORDER_STATUS.PENDING]: 'order_confirmed',
  [ORDER_STATUS.PREPARING]: 'order_preparing',
  [ORDER_STATUS.WAITING_FOR_RIDER]: 'order_waiting_for_rider',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'order_out_for_delivery',
  [ORDER_STATUS.DELIVERED]: 'order_delivered',
  [ORDER_STATUS.CANCELLED]: 'order_cancelled',
};

module.exports = {
  ORDER_STATUS,
  ORDER_STATUS_LIFECYCLE,
  ADMIN_SETTABLE_STATUSES,
  ACTIVE_STATUSES,
  REVENUE_STATUSES,
  STATUS_MESSAGES,
  STATUS_NOTIFICATION_TYPE,
};
