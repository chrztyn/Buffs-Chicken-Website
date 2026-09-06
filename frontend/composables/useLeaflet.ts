/**
 * Lazily loads Leaflet (JS + CSS) on the client only.
 *
 * Leaflet touches `window`/`document` at import time, so it must never run during SSR.
 * Every consumer awaits `loadLeaflet()` inside `onMounted`.
 *
 * Free stack: OpenStreetMap tiles, no API key, no billing.
 */

// Buffs Chicken shop location — used to center a fresh map before the user pins.
export const SHOP_LATLNG: [number, number] = [14.5995, 120.9842] // Metro Manila fallback

// Tile source: OpenStreetMap standard raster tiles. Genuinely free, no API key,
// no registration. Their tile-usage policy asks for a valid Referer/UA (browsers
// send both) and reasonable volume — fine for checkout-level traffic. Do NOT swap
// in Carto/Stadia/Mapbox/MapTiler here: those now require a key and will stamp
// "API KEY REQUIRED" into the tiles.
export const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

// Shared tile-layer options tuned for fast first paint inside a modal.
export const TILE_OPTIONS = {
  maxZoom: 19,
  crossOrigin: true,
  updateWhenIdle: false,   // fetch tiles while panning, not only when it stops
  updateWhenZooming: false,
  keepBuffer: 4            // pre-load a ring of off-screen tiles
}

export const OSM_TILE_URL = TILE_URL

let leafletPromise: Promise<any> | null = null

export function loadLeaflet(): Promise<any> {
  if (import.meta.server) return Promise.reject(new Error('Leaflet is client-only'))
  if (!leafletPromise) {
    // CSS is imported statically in each consuming component's <style> (@import
    // 'leaflet/dist/leaflet.css') so it is always applied — a dynamic import here
    // can be dropped by the bundler and leaves tiles mispositioned / invisible.
    leafletPromise = import('leaflet').then((mod: any) => mod.default || mod)
  }
  return leafletPromise
}

/**
 * Image-free marker so we avoid Leaflet's broken default-icon-path problem with bundlers.
 * Returns an L.divIcon showing an orange map pin.
 */
export function createPinIcon(L: any) {
  return L.divIcon({
    className: 'buffs-pin-icon',
    html: `
      <svg width="32" height="42" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 8.25 12 20 12 20s12-11.75 12-20C24 5.373 18.627 0 12 0z"
              fill="#FE601C"/>
        <circle cx="12" cy="12" r="4.5" fill="#ffffff"/>
      </svg>`,
    iconSize: [32, 42],
    iconAnchor: [16, 41],
    popupAnchor: [0, -38]
  })
}
