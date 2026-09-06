/**
 * Delivery pin-location — validation + normalisation.
 *
 * The customer sends a `deliveryLocation` object from the map picker. This service:
 *   1. validates the coordinates and text fields,
 *   2. normalises it into the shape stored on the Order,
 *   3. derives the legacy `deliveryAddress` string so every existing screen keeps working.
 */

const {
  PH_BOUNDS,
  FIELD_LIMITS,
  PH_PHONE_REGEX,
  MAPS_URL
} = require('../constants/delivery');

class DeliveryLocationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DeliveryLocationError';
    this.statusCode = 400;
  }
}

function clampString(value, max) {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

/**
 * @param {Object} raw - { lat, lng, label, note, contactName, contactPhone }
 * @returns {Object} normalised deliveryLocation subdoc
 * @throws {DeliveryLocationError} on invalid input
 */
function validateAndNormalize(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new DeliveryLocationError('Please pin your delivery location on the map.');
  }

  const lat = Number(raw.lat);
  const lng = Number(raw.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new DeliveryLocationError('Please pin your delivery location on the map.');
  }

  if (
    lat < PH_BOUNDS.minLat || lat > PH_BOUNDS.maxLat ||
    lng < PH_BOUNDS.minLng || lng > PH_BOUNDS.maxLng
  ) {
    throw new DeliveryLocationError(
      'That pin is outside our delivery area. Please pin a location within the Philippines.'
    );
  }

  const note = clampString(raw.note, FIELD_LIMITS.noteMax);
  if (!note) {
    throw new DeliveryLocationError(
      'Please add a unit / floor / house number or a landmark for the rider.'
    );
  }

  const contactPhone = clampString(raw.contactPhone, 20);
  if (contactPhone && !PH_PHONE_REGEX.test(contactPhone.replace(/\s|-/g, ''))) {
    throw new DeliveryLocationError('Please enter a valid Philippine contact number.');
  }

  const roundedLat = Number(lat.toFixed(6));
  const roundedLng = Number(lng.toFixed(6));

  return {
    lat: roundedLat,
    lng: roundedLng,
    label: clampString(raw.label, FIELD_LIMITS.labelMax),
    note,
    contactName: clampString(raw.contactName, FIELD_LIMITS.contactNameMax),
    contactPhone: contactPhone || null,
    mapsUrl: MAPS_URL(roundedLat, roundedLng),
    source: raw.source === 'search' ? 'search' : 'pin'
  };
}

/**
 * Human-readable one-liner written to `Order.deliveryAddress` for backward compatibility
 * (admin list rows, order-status, PayMongo billing addressLine).
 */
function deriveAddressString(loc) {
  if (!loc || !Number.isFinite(loc.lat) || !Number.isFinite(loc.lng)) return null;
  const parts = [];
  if (loc.label) parts.push(loc.label);
  if (loc.note) parts.push(`(${loc.note})`);
  parts.push(`— ${loc.lat},${loc.lng}`);
  return parts.join(' ');
}

module.exports = {
  DeliveryLocationError,
  validateAndNormalize,
  deriveAddressString
};
