/**
 * Distance-based delivery fee — mirrors backend/services/deliveryFee.js.
 * Lets the checkout UI compute fee/prompt/block live as the pin moves, no network round-trip.
 * Backend is authoritative and recomputes/enforces this again at POST /submit.
 */
import {
  STORE_LOCATION,
  DELIVERY_FEE_PESOS,
  FREE_DELIVERY_RADIUS_KM,
  MAX_DELIVERY_RADIUS_KM,
  FREE_DELIVERY_MIN_SUBTOTAL,
  OUT_OF_RANGE_MESSAGE
} from '~/constants/delivery'

const EARTH_RADIUS_KM = 6371

export interface DeliveryFeeResult {
  fee: number | null
  isFree: boolean
  isOutOfRange: boolean
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

function getDistanceFromStoreKm(lat: number, lng: number): number {
  return getDistanceKm(STORE_LOCATION.lat, STORE_LOCATION.lng, lat, lng)
}

/**
 * Business rules (identical to backend):
 *  - 0-5km + subtotal >= 350  -> free
 *  - 0-5km + subtotal < 350   -> flat fee
 *  - 5-8km, any subtotal      -> flat fee (never free)
 *  - > 8km                    -> out of range
 */
function computeDeliveryFee(subtotalPesos: number, distanceKm: number): DeliveryFeeResult {
  if (distanceKm > MAX_DELIVERY_RADIUS_KM) {
    return { fee: null, isFree: false, isOutOfRange: true }
  }
  const isFree = distanceKm <= FREE_DELIVERY_RADIUS_KM && subtotalPesos >= FREE_DELIVERY_MIN_SUBTOTAL
  return { fee: isFree ? 0 : DELIVERY_FEE_PESOS, isFree, isOutOfRange: false }
}

export function useDeliveryFee() {
  return {
    STORE_LOCATION,
    DELIVERY_FEE_PESOS,
    FREE_DELIVERY_RADIUS_KM,
    MAX_DELIVERY_RADIUS_KM,
    FREE_DELIVERY_MIN_SUBTOTAL,
    OUT_OF_RANGE_MESSAGE,
    getDistanceKm,
    getDistanceFromStoreKm,
    computeDeliveryFee
  }
}
