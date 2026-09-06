<template>
  <Teleport to="body">
    <div
      class="lpm-overlay"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`${uid}-title`"
      @mousedown.self="requestClose"
    >
      <div ref="panelEl" class="lpm-panel" @keydown.esc.stop.prevent="requestClose">
        <!-- Header -->
        <header class="lpm-head">
          <div>
            <h2 :id="`${uid}-title`" class="lpm-title">Pin your delivery location</h2>
            <p class="lpm-sub">Search an address, or tap the map where the rider should drop off.</p>
          </div>
          <button type="button" class="lpm-close" aria-label="Close map" @click="requestClose">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <!-- Search -->
        <div class="lpm-search">
          <div class="lpm-search-wrap">
            <svg class="lpm-search-ic" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              ref="searchInputEl"
              v-model="searchQuery"
              type="text"
              class="lpm-input"
              placeholder="Search an address or landmark"
              autocomplete="off"
              role="combobox"
              aria-controls="lpm-results"
              :aria-expanded="showResults"
              @focus="showResults = true"
              @keydown.down.prevent="moveActive(1)"
              @keydown.up.prevent="moveActive(-1)"
              @keydown.enter.prevent="chooseActive"
              @keydown.esc.stop="showResults = false"
            />
            <span v-if="searching" class="lpm-spin" aria-hidden="true" />
          </div>

          <ul
            v-if="showResults && (searchResults.length || searchEmpty)"
            id="lpm-results"
            class="lpm-results"
            role="listbox"
          >
            <li
              v-for="(r, i) in searchResults"
              :key="`${r.lat},${r.lng}`"
              :class="['lpm-result', { active: i === activeIndex }]"
              role="option"
              :aria-selected="i === activeIndex"
              @mousedown.prevent="selectResult(r)"
              @mouseenter="activeIndex = i"
            >
              {{ r.label }}
            </li>
            <li v-if="!searchResults.length && searchEmpty" class="lpm-result lpm-result--empty">
              No matches — drop a pin on the map instead.
            </li>
            <li class="lpm-attr">Powered by OpenStreetMap</li>
          </ul>
        </div>

        <!-- Map -->
        <div class="lpm-map-shell">
          <ClientOnly>
            <div v-if="mapError" class="lpm-map-state">
              <p class="lpm-state-title">Map couldn't load</p>
              <p class="lpm-state-msg">Check your connection and try again.</p>
              <button type="button" class="lpm-retry" @click="initMap">Retry</button>
            </div>
            <div v-show="!mapError" ref="mapEl" class="lpm-map" />
            <div v-if="!tilesLoaded && !mapError" class="lpm-map-skeleton" aria-hidden="true">
              <span>Loading map…</span>
            </div>
            <template #fallback>
              <div class="lpm-map-skeleton"><span>Loading map…</span></div>
            </template>
          </ClientOnly>

          <p v-if="tilesLoaded && !pin && !mapError" class="lpm-map-hint">Tap anywhere to drop a pin</p>

          <button
            v-if="tilesLoaded && !mapError"
            type="button"
            class="lpm-locate"
            :disabled="locating"
            @click="useMyLocation"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
            <span>{{ locating ? 'Locating…' : 'Use my location' }}</span>
          </button>
        </div>
        <p v-if="geoError" class="lpm-geo-err">{{ geoError }}</p>

        <!-- Footer -->
        <footer class="lpm-foot">
          <p class="lpm-resolved">
            <template v-if="geocoding">Resolving address…</template>
            <template v-else-if="resolvedAddress">{{ resolvedAddress }}</template>
            <template v-else>No location pinned yet</template>
          </p>
          <button
            type="button"
            class="lpm-confirm"
            :disabled="!pin || geocoding"
            @click="confirm"
          >
            Use This Location
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { loadLeaflet, createPinIcon, TILE_URL, TILE_OPTIONS, SHOP_LATLNG } from '~/composables/useLeaflet'

const props = defineProps({
  initial: { type: Object, default: null } // { lat, lng }
})
const emit = defineEmits(['confirm', 'close'])

const { geocodeSearch, geocodeReverse } = useApi()
const uid = `lpm-${Math.random().toString(36).slice(2, 8)}`

const panelEl = ref(null)
const searchInputEl = ref(null)

// ─── pin + address ─────────────────────────────────────────────────────────
const pin = ref(
  props.initial && Number.isFinite(props.initial.lat) && Number.isFinite(props.initial.lng)
    ? { lat: Number(props.initial.lat), lng: Number(props.initial.lng) }
    : null
)
const resolvedAddress = ref('')
const geocoding = ref(false)
const source = ref('pin')
let reverseTimer = null
let reverseSeq = 0

function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function ensureMarker(lat, lng) {
  if (!L || !map) return
  if (!marker) {
    marker = L.marker([lat, lng], {
      draggable: true,
      icon: createPinIcon(L),
      keyboard: true,
      autoPan: true
    }).addTo(map)
    marker.on('dragend', () => {
      const p = marker.getLatLng()
      setPin(p.lat, p.lng, { src: 'pin' })
    })
  } else {
    marker.setLatLng([lat, lng])
  }
}

function setPin(lat, lng, { recenter = false, reverse = true, src = 'pin' } = {}) {
  const nLat = Number(lat)
  const nLng = Number(lng)
  if (!Number.isFinite(nLat) || !Number.isFinite(nLng)) return
  pin.value = { lat: nLat, lng: nLng }
  source.value = src
  ensureMarker(nLat, nLng)
  if (map) {
    if (recenter) {
      const z = Math.max(map.getZoom(), 16)
      if (prefersReducedMotion()) map.setView([nLat, nLng], z)
      else map.flyTo([nLat, nLng], z, { duration: 0.6 })
    } else if (!map.getBounds().contains([nLat, nLng])) {
      map.panTo([nLat, nLng])
    }
  }
  if (reverse) {
    clearTimeout(reverseTimer)
    resolvedAddress.value = ''
    geocoding.value = true
    reverseTimer = setTimeout(() => reverseGeocode(nLat, nLng), 400)
  }
}

async function reverseGeocode(lat, lng) {
  const seq = ++reverseSeq
  try {
    const { data } = await geocodeReverse(lat, lng)
    if (seq !== reverseSeq) return
    resolvedAddress.value = data?.label || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  } catch {
    if (seq === reverseSeq) resolvedAddress.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  } finally {
    if (seq === reverseSeq) geocoding.value = false
  }
}

// ─── search ────────────────────────────────────────────────────────────────
const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const searchEmpty = ref(false)
const showResults = ref(false)
const activeIndex = ref(-1)
let searchTimer = null
let searchSeq = 0
const searchCache = new Map()

watch(searchQuery, (q) => {
  clearTimeout(searchTimer)
  activeIndex.value = -1
  const term = (q || '').trim()
  if (term.length < 3) {
    searchResults.value = []
    searchEmpty.value = false
    searching.value = false
    return
  }
  searching.value = true
  showResults.value = true
  searchTimer = setTimeout(() => runSearch(term), 500)
})

async function runSearch(term) {
  const seq = ++searchSeq
  const key = term.toLowerCase()

  if (searchCache.has(key)) {
    applyResults(searchCache.get(key))
    return
  }

  try {
    const { data } = await geocodeSearch(term)
    if (seq !== searchSeq) return
    const results = Array.isArray(data?.results)
      ? data.results
      : (Array.isArray(data) ? data : [])
    searchCache.set(key, results)
    applyResults(results)
  } catch {
    if (seq !== searchSeq) return
    applyResults([])
  }
}

function applyResults(results) {
  searchResults.value = results
  searchEmpty.value = results.length === 0
  showResults.value = true
  searching.value = false
}

function moveActive(step) {
  if (!searchResults.value.length) return
  const next = activeIndex.value + step
  activeIndex.value = (next + searchResults.value.length) % searchResults.value.length
}
function chooseActive() {
  if (activeIndex.value >= 0 && searchResults.value[activeIndex.value]) {
    selectResult(searchResults.value[activeIndex.value])
  }
}
function selectResult(r) {
  showResults.value = false
  searchResults.value = []
  searchEmpty.value = false
  searchSeq++ // cancel any in-flight search so it can't repopulate the list
  searchQuery.value = r.label
  setPin(r.lat, r.lng, { recenter: true, reverse: true, src: 'search' })
}

// ─── map ───────────────────────────────────────────────────────────────────
const mapEl = ref(null)
const tilesLoaded = ref(false)
const mapError = ref(false)
let L = null
let map = null
let marker = null
let resizeObs = null
let kickTimers = []

function kick() {
  if (map) map.invalidateSize({ animate: false })
}

function scheduleKicks() {
  kickTimers.forEach(clearTimeout)
  kickTimers = []
  if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(kick)
  ;[60, 160, 320, 600, 1000].forEach((t) => {
    kickTimers.push(setTimeout(kick, t))
  })
}

function nextFrame() {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === 'undefined') { setTimeout(resolve, 32); return }
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })
}

async function initMap() {
  mapError.value = false
  tilesLoaded.value = false
  try {
    L = await loadLeaflet()
    await nextTick()
    // Modal is teleported + ClientOnly-gated. Wait two frames so the browser has
    // laid out and painted the 300px map container BEFORE Leaflet measures it —
    // otherwise every click projects from a stale viewport and lands off-target.
    await nextFrame()
    if (!mapEl.value) return

    const start = pin.value ? [pin.value.lat, pin.value.lng] : SHOP_LATLNG
    map = L.map(mapEl.value, {
      zoomControl: true,
      attributionControl: false
    }).setView(start, pin.value ? 16 : 12)

    const tiles = L.tileLayer(TILE_URL, TILE_OPTIONS)
    tiles.on('load', () => { tilesLoaded.value = true; kick() })
    // Fallback: if the 'load' event is missed (all tiles cached), reveal anyway.
    tiles.on('tileload', () => { if (!tilesLoaded.value) tilesLoaded.value = true })
    tiles.addTo(map)

    map.on('click', (e) => {
      setPin(e.latlng.lat, e.latlng.lng, { reverse: true, src: 'pin' })
    })

    if (pin.value) {
      ensureMarker(pin.value.lat, pin.value.lng)
      setPin(pin.value.lat, pin.value.lng, { reverse: true, src: source.value })
    }

    map.whenReady(() => {
      scheduleKicks()
      if (typeof ResizeObserver !== 'undefined' && mapEl.value) {
        resizeObs = new ResizeObserver(() => kick())
        resizeObs.observe(mapEl.value)
      }
      if (typeof window !== 'undefined') window.addEventListener('resize', kick)
    })

    // Safety net: never leave the skeleton up forever if tile events don't arrive.
    kickTimers.push(setTimeout(() => { tilesLoaded.value = true; kick() }, 2500))
  } catch (err) {
    console.error('[LocationPickerModal] map init failed', err)
    mapError.value = true
  }
}

// ─── geolocation ───────────────────────────────────────────────────────────
const locating = ref(false)
const geoError = ref('')

function useMyLocation() {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    geoError.value = 'Your browser cannot share your location. Please pin it manually.'
    return
  }
  locating.value = true
  geoError.value = ''
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      locating.value = false
      setPin(pos.coords.latitude, pos.coords.longitude, { recenter: true, reverse: true, src: 'pin' })
    },
    () => {
      locating.value = false
      geoError.value = 'We could not get your location. Please pin it on the map instead.'
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  )
}

// ─── confirm / close ───────────────────────────────────────────────────────
function confirm() {
  if (!pin.value || geocoding.value) return
  emit('confirm', {
    address: resolvedAddress.value || `${pin.value.lat.toFixed(5)}, ${pin.value.lng.toFixed(5)}`,
    lat: pin.value.lat,
    lng: pin.value.lng,
    source: source.value
  })
}
function requestClose() {
  emit('close')
}

// ─── lifecycle: scroll lock, focus, esc ────────────────────────────────────
let prevOverflow = ''
let lastFocused = null

function onKeydown(e) {
  if (e.key === 'Escape') { e.preventDefault(); requestClose() }
}

onMounted(() => {
  if (typeof document !== 'undefined') {
    lastFocused = document.activeElement
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeydown)
    nextTick(() => searchInputEl.value && searchInputEl.value.focus())
  }
  initMap()
})

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  clearTimeout(reverseTimer)
  kickTimers.forEach(clearTimeout)
  if (resizeObs) { resizeObs.disconnect(); resizeObs = null }
  if (typeof window !== 'undefined') window.removeEventListener('resize', kick)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = prevOverflow
    document.removeEventListener('keydown', onKeydown)
    if (lastFocused && lastFocused.focus) lastFocused.focus()
  }
  if (map) { map.remove(); map = null }
  marker = null
})
</script>

<style scoped>
.lpm-overlay {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  padding: 16px; background: rgba(15, 23, 42, 0.55);
  animation: lpm-fade 0.15s ease;
}
@keyframes lpm-fade { from { opacity: 0 } to { opacity: 1 } }

.lpm-panel {
  width: 100%; max-width: 560px; max-height: 92vh; overflow-y: auto;
  background: #fff; border-radius: 16px; padding: 18px;
  display: flex; flex-direction: column; gap: 14px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
}

.lpm-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.lpm-title { font-size: 1.05rem; font-weight: 800; color: #1f2937; }
.lpm-sub { font-size: 0.8rem; color: #6b7280; margin-top: 2px; }
.lpm-close {
  flex-shrink: 0; width: 34px; height: 34px; border-radius: 9px; border: 1px solid #e5e7eb;
  display: inline-flex; align-items: center; justify-content: center; color: #6b7280; background: #fff;
}
.lpm-close:hover { background: #f9fafb; color: #111827; }

.lpm-search { position: relative; z-index: 50; }
.lpm-search-wrap { position: relative; display: flex; align-items: center; }
.lpm-search-ic { position: absolute; left: 12px; color: #9ca3af; pointer-events: none; }
.lpm-input {
  width: 100%; padding: 10px 12px 10px 34px; border: 1px solid #d1d5db; border-radius: 10px;
  font-size: 0.95rem; background: #fff; transition: border-color .15s, box-shadow .15s;
}
.lpm-input:focus { outline: none; border-color: #FE601C; box-shadow: 0 0 0 3px rgba(254, 96, 28, .18); }
.lpm-spin {
  position: absolute; right: 12px; width: 15px; height: 15px; border-radius: 50%;
  border: 2px solid #e5e7eb; border-top-color: #FE601C; animation: lpm-rot .7s linear infinite;
}
@keyframes lpm-rot { to { transform: rotate(360deg) } }

.lpm-results {
  position: absolute; z-index: 60; left: 0; right: 0; margin-top: 4px; padding: 4px;
  background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; list-style: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, .12); max-height: 240px; overflow-y: auto;
}
.lpm-result { padding: 8px 10px; font-size: .85rem; color: #374151; border-radius: 7px; cursor: pointer; }
.lpm-result.active, .lpm-result:hover { background: #fff2ec; color: #c2410c; }
.lpm-result--empty { cursor: default; color: #6b7280; }
.lpm-result--empty:hover { background: transparent; color: #6b7280; }
.lpm-attr { padding: 6px 10px 2px; font-size: .68rem; color: #9ca3af; }

.lpm-map-shell { position: relative; flex-shrink: 0; height: 300px; }
@media (min-width: 640px) { .lpm-map-shell { height: 340px; } }
.lpm-map, .lpm-map-skeleton, .lpm-map-state {
  position: absolute; inset: 0;
  height: 100%; width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;
}
.lpm-map { z-index: 1; background: #e8eaed; }
.lpm-map-skeleton {
  z-index: 2; display: flex; align-items: center; justify-content: center;
  color: #9ca3af; font-size: .85rem; pointer-events: none;
  background: linear-gradient(100deg, #f1f2f4 30%, #e7e9ec 50%, #f1f2f4 70%);
  background-size: 200% 100%; animation: lpm-shimmer 1.3s ease-in-out infinite;
}
@keyframes lpm-shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
.lpm-map-state {
  z-index: 3; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px; background: #fafafa; text-align: center; padding: 16px;
}
.lpm-state-title { font-weight: 700; color: #374151; }
.lpm-state-msg { font-size: .8rem; color: #6b7280; }
.lpm-retry {
  margin-top: 6px; padding: 8px 16px; border-radius: 8px; background: #FE601C; color: #fff;
  font-weight: 600; font-size: .85rem;
}
.lpm-map-hint {
  position: absolute; top: 10px; left: 50%; transform: translateX(-50%); z-index: 20;
  padding: 5px 12px; border-radius: 999px; background: rgba(31, 41, 55, .82); color: #fff;
  font-size: .74rem; font-weight: 600; pointer-events: none; white-space: nowrap;
}
.lpm-locate {
  position: absolute; left: 10px; bottom: 10px; z-index: 20;
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 12px; border-radius: 8px; background: #fff; border: 1px solid #d1d5db;
  font-size: .8rem; font-weight: 600; color: #374151; box-shadow: 0 2px 8px rgba(0, 0, 0, .12);
}
.lpm-locate:disabled { opacity: .6; }
.lpm-locate svg { color: #FE601C; flex-shrink: 0; }
.lpm-geo-err { font-size: .78rem; color: #b45309; }

.lpm-foot { display: flex; align-items: center; gap: 12px; justify-content: space-between; }
.lpm-resolved {
  font-size: .84rem; color: #374151; flex: 1; min-width: 0;
  overflow-wrap: anywhere; line-height: 1.4;
  max-height: 3.2em; overflow-y: auto;
}
.lpm-confirm {
  flex-shrink: 0; padding: 11px 20px; border-radius: 10px; background: #FE601C; color: #fff;
  font-weight: 700; font-size: .9rem; transition: opacity .15s, transform .1s;
}
.lpm-confirm:hover:not(:disabled) { opacity: .92; }
.lpm-confirm:active:not(:disabled) { transform: scale(.97); }
.lpm-confirm:disabled { opacity: .5; cursor: not-allowed; }

:deep(.buffs-pin-icon) { background: transparent; border: none; }
:deep(.leaflet-container) { font: inherit; background: #e8eaed; }

@media (prefers-reduced-motion: reduce) {
  .lpm-overlay, .lpm-map-skeleton, .lpm-spin { animation: none; }
  .lpm-input, .lpm-confirm { transition: none; }
}

/* ─────────────── Mobile: bottom sheet, stacked footer ─────────────── */
@media (max-width: 560px) {
  .lpm-overlay { padding: 0; align-items: flex-end; }

  .lpm-panel {
    max-width: 100%; max-height: 94vh;
    border-radius: 16px 16px 0 0; padding: 14px; gap: 12px;
  }

  .lpm-title { font-size: 1rem; }
  .lpm-sub { font-size: .75rem; }
  .lpm-input { font-size: 16px; } /* 16px = no iOS focus zoom */
  .lpm-input::placeholder { font-size: 0.8125rem; } /* 13px — matches order modal */
  .lpm-map-shell { height: 250px; }

  /* Address stacks above a full-width button; footer pinned to sheet bottom */
  .lpm-foot {
    flex-direction: column; align-items: stretch; gap: 10px;
    position: sticky; bottom: 0; z-index: 30;
    margin: 0 -14px -14px; padding: 12px 14px calc(12px + env(safe-area-inset-bottom, 0px));
    background: #fff; border-top: 1px solid #eef0f2;
  }
  .lpm-resolved { font-size: .8rem; flex: none; max-height: 3em; }
  .lpm-confirm { width: 100%; padding: 12px 20px; }
}
</style>
