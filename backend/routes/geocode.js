/**
 * Geocode proxy — fronts OpenStreetMap's Nominatim service for the delivery pin picker.
 *
 * Why a proxy and not a direct browser call:
 *   - Nominatim's usage policy requires a real identifying User-Agent (browsers can't set it).
 *   - We cache results and throttle upstream calls to stay within the 1 req/sec policy.
 *   - On any upstream failure we degrade gracefully ({ results: [] }) so the picker still works
 *     via marker drag.
 *
 * No API key. No cost.
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

const { GEOCODE, GLOBAL_BOUNDS } = require('../constants/delivery');

// ─── tiny in-memory LRU cache ────────────────────────────────────────────────
const cache = new Map(); // key -> { at, payload }

function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > GEOCODE.CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  // refresh recency
  cache.delete(key);
  cache.set(key, hit);
  return hit.payload;
}

function cacheSet(key, payload) {
  cache.set(key, { at: Date.now(), payload });
  if (cache.size > GEOCODE.CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
}

// ─── upstream throttle: serialise calls, min gap between them ─────────────────
let upstreamChain = Promise.resolve();
let lastUpstreamAt = 0;

function throttledUpstream(fn) {
  const run = upstreamChain.then(async () => {
    const wait = GEOCODE.MIN_UPSTREAM_GAP_MS - (Date.now() - lastUpstreamAt);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    try {
      return await fn();
    } finally {
      lastUpstreamAt = Date.now();
    }
  });
  // keep the chain alive regardless of individual failures
  upstreamChain = run.then(() => {}, () => {});
  return run;
}

function nominatim(path, params) {
  return axios.get(`${GEOCODE.BASE_URL}${path}`, {
    params: { format: 'jsonv2', ...params },
    headers: {
      'User-Agent': GEOCODE.USER_AGENT,
      Referer: GEOCODE.USER_AGENT
    },
    timeout: GEOCODE.UPSTREAM_TIMEOUT_MS
  });
}

// ─── GET /api/geocode/search?q= ──────────────────────────────────────────────
router.get('/search', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (q.length < 3) return res.json({ results: [] });

  const cacheKey = `s:${q.toLowerCase()}`;
  const cached = cacheGet(cacheKey);
  if (cached) return res.json({ results: cached, cached: true });

  try {
    const { data } = await throttledUpstream(() =>
      nominatim('/search', {
        q,
        limit: GEOCODE.SEARCH_LIMIT,
        countrycodes: GEOCODE.COUNTRY_CODES,
        addressdetails: 1
      })
    );

    const results = (Array.isArray(data) ? data : []).map((item) => ({
      label: item.display_name,
      lat: Number(item.lat),
      lng: Number(item.lon),
      type: item.type
    }));

    cacheSet(cacheKey, results);
    return res.json({ results });
  } catch (err) {
    console.error('[GEOCODE] search upstream failed:', err.message);
    return res.json({ results: [], degraded: true });
  }
});

// ─── GET /api/geocode/reverse?lat=&lng= ──────────────────────────────────────
router.get('/reverse', async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);

  if (
    !Number.isFinite(lat) || !Number.isFinite(lng) ||
    lat < GLOBAL_BOUNDS.minLat || lat > GLOBAL_BOUNDS.maxLat ||
    lng < GLOBAL_BOUNDS.minLng || lng > GLOBAL_BOUNDS.maxLng
  ) {
    return res.status(400).json({ label: null, message: 'Invalid coordinates.' });
  }

  const cacheKey = `r:${lat.toFixed(5)},${lng.toFixed(5)}`;
  const cached = cacheGet(cacheKey);
  if (cached !== null) return res.json({ label: cached, cached: true });

  try {
    const { data } = await throttledUpstream(() =>
      nominatim('/reverse', { lat, lon: lng, addressdetails: 1 })
    );
    const label = data && data.display_name ? data.display_name : null;
    cacheSet(cacheKey, label);
    return res.json({ label });
  } catch (err) {
    console.error('[GEOCODE] reverse upstream failed:', err.message);
    return res.json({ label: null, degraded: true });
  }
});

module.exports = router;
