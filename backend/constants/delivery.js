/**
 * Delivery pin-location constants.
 * Single source of truth for coordinate bounds, field limits, and geocode proxy config.
 */

// Rough bounding box for the Philippines. A pin outside this is almost certainly bad data
// (wrong hemisphere, swapped lat/lng, default 0,0). We reject it at submit time.
const PH_BOUNDS = {
  minLat: 4.0,
  maxLat: 21.5,
  minLng: 116.0,
  maxLng: 127.5
};

const GLOBAL_BOUNDS = {
  minLat: -90,
  maxLat: 90,
  minLng: -180,
  maxLng: 180
};

const FIELD_LIMITS = {
  labelMax: 250,
  noteMax: 200,
  contactNameMax: 100
};

// PH mobile / landline — permissive: +63 or 0 prefix, 7-12 digits, spaces/dashes allowed.
const PH_PHONE_REGEX = /^(\+?63|0)[\d\s-]{7,13}$/;

// Nominatim (OpenStreetMap) geocoding — free, no key. Usage policy: <= 1 req/sec, real
// User-Agent identifying the app, cache results. We proxy all calls through the backend.
const GEOCODE = {
  BASE_URL: 'https://nominatim.openstreetmap.org',
  USER_AGENT: 'BuffsChicken/1.0 (https://buffschicken.ph; orders@buffschicken.ph)',
  SEARCH_LIMIT: 6,
  COUNTRY_CODES: 'ph',
  CACHE_TTL_MS: 5 * 60 * 1000,
  CACHE_MAX_ENTRIES: 500,
  UPSTREAM_TIMEOUT_MS: 6000,
  // Minimum gap between upstream calls (ms) — protects us from the 1 req/sec policy.
  MIN_UPSTREAM_GAP_MS: 1100
};

const MAPS_URL = (lat, lng) => `https://www.google.com/maps?q=${lat},${lng}`;
const WAZE_URL = (lat, lng) => `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

module.exports = {
  PH_BOUNDS,
  GLOBAL_BOUNDS,
  FIELD_LIMITS,
  PH_PHONE_REGEX,
  GEOCODE,
  MAPS_URL,
  WAZE_URL
};
