// Distance-based delivery pricing constants.
// Mirror of backend/constants/delivery.js — keep both in sync. Backend is authoritative
// (routes/orders.js POST /submit recomputes and enforces this server-side); this copy exists
// so the checkout UI can compute fee/prompt/block live as the pin moves, no network round-trip.
export const STORE_LOCATION = { lat: 15.127774, lng: 120.596859 }
export const DELIVERY_FEE_PESOS = 35
export const FREE_DELIVERY_RADIUS_KM = 5
export const MAX_DELIVERY_RADIUS_KM = 8
export const FREE_DELIVERY_MIN_SUBTOTAL = 350
export const OUT_OF_RANGE_MESSAGE = 'Sorry, this location is not yet covered by our delivery service.'
