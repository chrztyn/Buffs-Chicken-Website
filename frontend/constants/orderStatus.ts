// Frontend mirror of backend/constants/orderStatus.js. Keep the two in sync.
// Enum values are lowercase-with-spaces to match the DB (e.g. 'out for delivery').

export const ORDER_STATUS = {
  AWAITING_PAYMENT: 'awaiting_payment',
  PENDING: 'pending',
  PREPARING: 'preparing',
  WAITING_FOR_RIDER: 'waiting for rider',
  OUT_FOR_DELIVERY: 'out for delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

// The statuses shown in the admin filter tabs + status-update modal, in pipeline order.
export const ADMIN_STATUS_FLOW = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.WAITING_FOR_RIDER,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.CANCELLED,
] as const

// The customer-facing timeline (no 'cancelled' — that's a terminal off-ramp).
export const CUSTOMER_TIMELINE = [
  { id: ORDER_STATUS.PENDING, label: 'Confirming' },
  { id: ORDER_STATUS.PREPARING, label: 'Preparing' },
  { id: ORDER_STATUS.WAITING_FOR_RIDER, label: 'Waiting for Rider' },
  { id: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
  { id: ORDER_STATUS.DELIVERED, label: 'Delivered' },
] as const

// index into CUSTOMER_TIMELINE for progress-bar math; cancelled = -1
export const STATUS_ORDER: Record<string, number> = {
  [ORDER_STATUS.PENDING]: 0,
  [ORDER_STATUS.PREPARING]: 1,
  [ORDER_STATUS.WAITING_FOR_RIDER]: 2,
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 3,
  [ORDER_STATUS.DELIVERED]: 4,
  [ORDER_STATUS.CANCELLED]: -1,
}

export const STATUS_BADGE_CLASS: Record<string, string> = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 font-bold',
  [ORDER_STATUS.PREPARING]: 'bg-blue-100 text-blue-800 font-bold',
  [ORDER_STATUS.WAITING_FOR_RIDER]: 'bg-amber-100 text-amber-800 font-bold',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'bg-purple-100 text-purple-800 font-bold',
  [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800 font-bold',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800 font-bold',
}

// Short customer-facing status blurb for toasts.
export const STATUS_TOAST: Record<string, string> = {
  [ORDER_STATUS.PENDING]: 'Confirming',
  [ORDER_STATUS.PREPARING]: 'Your order is being prepared',
  [ORDER_STATUS.WAITING_FOR_RIDER]: 'Your order is packed and waiting for a rider',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Your order is on the way',
  [ORDER_STATUS.DELIVERED]: 'Your order has arrived',
  [ORDER_STATUS.CANCELLED]: 'Your order has been cancelled',
}

// Payment-method display labels. QR Ph is the only method offered to new orders;
// the e-wallet entries remain so historical orders still render correctly.
export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  qrph: 'QR Ph',
  gcash: 'GCash',
  maya: 'Maya',
  maribank: 'Maribank',
  bpi: 'BPI',
  cash_on_delivery: 'Cash on Delivery',
}

export function paymentMethodLabel(method?: string | null): string {
  if (!method) return '—'
  return PAYMENT_METHOD_LABEL[method] || method
}
