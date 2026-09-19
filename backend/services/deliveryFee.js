/**
 * Distance-based delivery fee calculation.
 * Kept separate from services/deliveryLocation.js, which only validates pin shape/PH bounds —
 * this module owns the business radius/pricing rules.
 */

const {
  STORE_LOCATION,
  DELIVERY_FEE_PESOS,
  FREE_DELIVERY_RADIUS_KM,
  MAX_DELIVERY_RADIUS_KM,
  FREE_DELIVERY_MIN_SUBTOTAL
} = require('../constants/delivery');

const EARTH_RADIUS_KM = 6371;

/**
 * Great-circle (haversine) distance between two lat/lng points, in kilometers.
 */
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

function getDistanceFromStoreKm(lat, lng) {
  return getDistanceKm(STORE_LOCATION.lat, STORE_LOCATION.lng, lat, lng);
}

/**
 * Business rules:
 *  - 0-5km + subtotal >= 350  -> free
 *  - 0-5km + subtotal < 350   -> flat fee
 *  - 5-8km, any subtotal      -> flat fee (never free)
 *  - > 8km                    -> out of range (caller must block/reject)
 */
function computeDeliveryFee(subtotalPesos, distanceKm) {
  const isOutOfRange = distanceKm > MAX_DELIVERY_RADIUS_KM;
  if (isOutOfRange) {
    return { fee: null, isFree: false, isOutOfRange: true };
  }
  const isFree = distanceKm <= FREE_DELIVERY_RADIUS_KM && subtotalPesos >= FREE_DELIVERY_MIN_SUBTOTAL;
  return { fee: isFree ? 0 : DELIVERY_FEE_PESOS, isFree, isOutOfRange: false };
}

/**
 * Delivery fee actually charged on an order, derived from its authoritative totals:
 * total = subtotal - voucherDiscount + tax + deliveryFee. Falls back correctly for orders
 * created before Order.deliveryFee existed (or by a server that didn't store it).
 */
function getOrderDeliveryFee(order) {
  const stored = Number(order.deliveryFee || 0);
  const discount = Number(order.voucher?.discountAmount || 0);
  const derived = Number(order.totalAmount || 0) - (Number(order.subtotal || 0) - discount) - Number(order.tax || 0);
  return Math.max(stored, Math.round(derived * 100) / 100, 0);
}

module.exports = {
  getOrderDeliveryFee,
  getDistanceKm,
  getDistanceFromStoreKm,
  computeDeliveryFee
};
