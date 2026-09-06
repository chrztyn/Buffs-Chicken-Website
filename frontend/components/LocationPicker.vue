<template>
  <div class="location-picker">
    <!-- Search -->
    <div class="lp-field">
      <label :for="`${uid}-search`" class="lp-label">Search for your address or a nearby landmark</label>
      <div class="lp-search-wrap">
        <input
          :id="`${uid}-search`"
          v-model="searchQuery"
          type="text"
          class="lp-input"
          placeholder="e.g. SM North EDSA, or 123 Rizal Ave, Caloocan"
          autocomplete="off"
          role="combobox"
          :aria-expanded="showResults"
          aria-controls="lp-results"
          @focus="showResults = true"
          @keydown.down.prevent="moveActive(1)"
          @keydown.up.prevent="moveActive(-1)"
          @keydown.enter.prevent="chooseActive"
          @keydown.esc="showResults = false"
        />
        <span v-if="searching" class="lp-search-status" aria-live="polite">Searching…</span>

        <ul
          v-if="showResults && (searchResults.length || searchEmpty)"
          id="lp-results"
          class="lp-results"
          role="listbox"
        >
          <li
            v-for="(r, i) in searchResults"
            :key="`${r.lat},${r.lng}`"
            :class="['lp-result', { active: i === activeIndex }]"
            role="option"
            :aria-selected="i === activeIndex"
            @mousedown.prevent="selectResult(r)"
            @mouseenter="activeIndex = i"
          >
            {{ r.label }}
          </li>
          <li v-if="!searchResults.length && searchEmpty" class="lp-result lp-result--empty">
            No matches. Drag the map pin to your exact spot instead.
          </li>
        </ul>
      </div>
    </div>

    <!-- Map -->
    <div class="lp-map-shell">
      <ClientOnly>
        <div v-if="mapError" class="lp-map-state">
          <p class="lp-state-title">Map couldn't load</p>
          <p class="lp-state-msg">Check your connection and try again.</p>
          <button type="button" class="lp-retry" @click="initMap">Retry</button>
        </div>
        <div v-else ref="mapEl" class="lp-map" :class="{ 'lp-map--loading': !mapReady }" />
        <div v-if="!mapReady && !mapError" class="lp-map-skeleton" aria-hidden="true">
          <span>Loading map…</span>
        </div>
        <template #fallback>
          <div class="lp-map-skeleton"><span>Loading map…</span></div>
        </template>
      </ClientOnly>

      <button
        v-if="mapReady && !mapError"
        type="button"
        class="lp-locate"
        :disabled="locating"
        @click="useMyLocation"
      >
        <svg class="lp-locate-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
        <span>{{ locating ? 'Locating…' : 'Use my current location' }}</span>
      </button>
    </div>

    <p v-if="geoError" class="lp-hint lp-hint--warn">{{ geoError }}</p>
    <p class="lp-hint">Drag the map or the pin so it sits exactly on your gate / building entrance.</p>

    <!-- Derived + manual detail fields -->
    <div class="lp-field">
      <label :for="`${uid}-label`" class="lp-label">Address label</label>
      <input
        :id="`${uid}-label`"
        v-model="model.label"
        type="text"
        class="lp-input"
        placeholder="Filled in from the map — edit if needed"
      />
    </div>

    <div class="lp-field">
      <label :for="`${uid}-note`" class="lp-label">Unit / floor / house no. &amp; landmark for the rider *</label>
      <textarea
        :id="`${uid}-note`"
        v-model="model.note"
        rows="2"
        maxlength="200"
        class="lp-input lp-textarea"
        placeholder="e.g. Unit 4B, 2nd flr. Blue gate beside the sari-sari store"
        required
      />
    </div>

    <div class="lp-row">
      <div class="lp-field">
        <label :for="`${uid}-cname`" class="lp-label">Contact name</label>
        <input :id="`${uid}-cname`" v-model="model.contactName" type="text" class="lp-input" placeholder="Who the rider asks for" />
      </div>
      <div class="lp-field">
        <label :for="`${uid}-cphone`" class="lp-label">Contact number</label>
        <input :id="`${uid}-cphone`" v-model="model.contactPhone" type="tel" class="lp-input" placeholder="09XX XXX XXXX" />
      </div>
    </div>

    <p v-if="model.lat" class="lp-coords">Pinned at {{ model.lat.toFixed(5) }}, {{ model.lng.toFixed(5) }}</p>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useApi } from '~/composables/useApi'
import { loadLeaflet, createPinIcon, TILE_URL, TILE_OPTIONS, SHOP_LATLNG } from '~/composables/useLeaflet'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const { geocodeSearch, geocodeReverse } = useApi()

const uid = `lp-${Math.random().toString(36).slice(2, 8)}`

const model = reactive({
  lat: props.modelValue?.lat ?? null,
  lng: props.modelValue?.lng ?? null,
  label: props.modelValue?.label ?? '',
  note: props.modelValue?.note ?? '',
  contactName: props.modelValue?.contactName ?? '',
  contactPhone: props.modelValue?.contactPhone ?? '',
  source: props.modelValue?.source ?? 'pin'
})

watch(model, () => {
  emit('update:modelValue', {
    lat: model.lat,
    lng: model.lng,
    label: model.label?.trim() || null,
    note: model.note?.trim() || null,
    contactName: model.contactName?.trim() || null,
    contactPhone: model.contactPhone?.trim() || null,
    source: model.source
  })
}, { deep: true })

// ─── search ────────────────────────────────────────────────────────────────
const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const searchEmpty = ref(false)
const showResults = ref(false)
const activeIndex = ref(-1)
let searchTimer = null

watch(searchQuery, (q) => {
  clearTimeout(searchTimer)
  activeIndex.value = -1
  if (!q || q.trim().length < 3) {
    searchResults.value = []
    searchEmpty.value = false
    return
  }
  searchTimer = setTimeout(runSearch, 600)
})

async function runSearch() {
  searching.value = true
  searchEmpty.value = false
  try {
    const { data } = await geocodeSearch(searchQuery.value.trim())
    searchResults.value = Array.isArray(data?.results) ? data.results : []
    searchEmpty.value = searchResults.value.length === 0
    showResults.value = true
  } catch {
    searchResults.value = []
    searchEmpty.value = true
  } finally {
    searching.value = false
  }
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
  model.source = 'search'
  model.label = r.label
  showResults.value = false
  searchResults.value = []
  setPin(r.lat, r.lng, { recenter: true, reverse: false })
}

// ─── map ───────────────────────────────────────────────────────────────────
const mapEl = ref(null)
const mapReady = ref(false)
const mapError = ref(false)
let L = null
let map = null
let marker = null
let reverseTimer = null
let resizeObs = null
let kickTimers = []

const kick = () => { if (map) map.invalidateSize({ animate: false }) }
function scheduleKicks() {
  kickTimers.forEach(clearTimeout)
  requestAnimationFrame(kick)
  kickTimers = [60, 180, 400, 800, 1500].map((t) => setTimeout(kick, t))
}

onMounted(() => {
  // Defer map creation until the picker is actually on screen — building Leaflet
  // in a zero-size / hidden modal is what leaves half the tiles unloaded.
  if (typeof IntersectionObserver !== 'undefined' && mapEl.value) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect()
        initMap()
      }
    }, { threshold: 0.1 })
    io.observe(mapEl.value)
  } else {
    initMap()
  }
})
onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  clearTimeout(reverseTimer)
  kickTimers.forEach(clearTimeout)
  if (resizeObs) { resizeObs.disconnect(); resizeObs = null }
  if (typeof window !== 'undefined') window.removeEventListener('resize', kick)
  if (map) { map.remove(); map = null }
})

async function initMap() {
  mapError.value = false
  mapReady.value = false
  try {
    L = await loadLeaflet()
    await nextTick()
    if (!mapEl.value) return

    const start = model.lat && model.lng ? [model.lat, model.lng] : SHOP_LATLNG
    map = L.map(mapEl.value, {
      zoomControl: true,
      attributionControl: false,
      preferCanvas: true
    }).setView(start, model.lat ? 17 : 15)

    L.tileLayer(TILE_URL, TILE_OPTIONS).addTo(map)

    marker = L.marker(start, { draggable: true, icon: createPinIcon(L), keyboard: true }).addTo(map)
    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng()
      model.source = 'pin'
      setPin(lat, lng, { recenter: false, reverse: true })
    })
    map.on('click', (e) => {
      model.source = 'pin'
      setPin(e.latlng.lat, e.latlng.lng, { recenter: false, reverse: true })
    })

    if (model.lat && model.lng) setPin(model.lat, model.lng, { recenter: false, reverse: !model.label })

    map.whenReady(() => {
      mapReady.value = true
      // The picker sits in a modal that fades / reflows in — Leaflet sizes its tile
      // grid from the container, so recalc a few times as the layout settles, and
      // whenever the container itself resizes.
      scheduleKicks()
      if (typeof ResizeObserver !== 'undefined' && mapEl.value) {
        resizeObs = new ResizeObserver(() => kick())
        resizeObs.observe(mapEl.value)
      }
      if (typeof window !== 'undefined') window.addEventListener('resize', kick)
    })
  } catch (err) {
    console.error('[LocationPicker] map init failed', err)
    mapError.value = true
  }
}

function setPin(lat, lng, { recenter = false, reverse = true } = {}) {
  model.lat = Number(lat)
  model.lng = Number(lng)
  if (marker) marker.setLatLng([lat, lng])
  if (recenter && map) map.setView([lat, lng], Math.max(map.getZoom(), 17))
  if (reverse) {
    clearTimeout(reverseTimer)
    reverseTimer = setTimeout(() => reverseGeocode(lat, lng), 500)
  }
}

async function reverseGeocode(lat, lng) {
  try {
    const { data } = await geocodeReverse(lat, lng)
    if (data?.label) model.label = data.label
  } catch {
    /* keep whatever label the user has */
  }
}

// ─── geolocation ───────────────────────────────────────────────────────────
const locating = ref(false)
const geoError = ref('')

function useMyLocation() {
  if (!import.meta.client || !navigator.geolocation) {
    geoError.value = 'Your browser cannot share your location. Please pin it manually.'
    return
  }
  locating.value = true
  geoError.value = ''
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      locating.value = false
      model.source = 'pin'
      setPin(pos.coords.latitude, pos.coords.longitude, { recenter: true, reverse: true })
    },
    () => {
      locating.value = false
      geoError.value = 'We could not get your location. Please pin it on the map instead.'
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  )
}
</script>

<style scoped>
@import 'leaflet/dist/leaflet.css';

.location-picker { display: flex; flex-direction: column; gap: 16px; }

.lp-field { display: flex; flex-direction: column; gap: 6px; }
.lp-row { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 640px) { .lp-row { grid-template-columns: 1fr 1fr; } }

.lp-label { font-size: 0.85rem; font-weight: 600; color: #374151; }

.lp-input {
  width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 10px;
  font-size: 0.95rem; background: #fff; transition: border-color .15s, box-shadow .15s;
}
.lp-input:focus { outline: none; border-color: #FE601C; box-shadow: 0 0 0 3px rgba(254,96,28,.18); }
.lp-textarea { resize: none; }

.lp-search-wrap { position: relative; }
.lp-search-status { position: absolute; right: 12px; top: 11px; font-size: .75rem; color: #6b7280; }

.lp-results {
  position: absolute; z-index: 40; left: 0; right: 0; margin-top: 4px; padding: 4px;
  background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; list-style: none;
  box-shadow: 0 10px 25px rgba(0,0,0,.12); max-height: 220px; overflow-y: auto;
}
.lp-result { padding: 8px 10px; font-size: .85rem; color: #374151; border-radius: 7px; cursor: pointer; }
.lp-result.active, .lp-result:hover { background: #fff2ec; color: #c2410c; }
.lp-result--empty { cursor: default; color: #6b7280; }
.lp-result--empty:hover { background: transparent; color: #6b7280; }

.lp-map-shell { position: relative; }
.lp-map, .lp-map-skeleton, .lp-map-state {
  height: 260px; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;
}
@media (min-width: 768px) { .lp-map, .lp-map-skeleton, .lp-map-state { height: 340px; } }
.lp-map--loading { opacity: 0; }
.lp-map-skeleton {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  color: #9ca3af; font-size: .85rem;
  background: linear-gradient(100deg, #f1f2f4 30%, #e7e9ec 50%, #f1f2f4 70%);
  background-size: 200% 100%;
  animation: lp-shimmer 1.3s ease-in-out infinite;
}
@keyframes lp-shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
@media (prefers-reduced-motion: reduce) { .lp-map-skeleton { animation: none; } }
.lp-map-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px; background: #fafafa; text-align: center; padding: 16px;
}
.lp-state-title { font-weight: 700; color: #374151; }
.lp-state-msg { font-size: .8rem; color: #6b7280; }
.lp-retry {
  margin-top: 6px; padding: 8px 16px; border-radius: 8px; background: #FE601C; color: #fff;
  font-weight: 600; font-size: .85rem;
}

.lp-locate {
  position: absolute; left: 10px; bottom: 10px; z-index: 20;
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 12px; border-radius: 8px; background: #fff; border: 1px solid #d1d5db;
  font-size: .8rem; font-weight: 600; color: #374151; box-shadow: 0 2px 8px rgba(0,0,0,.12);
}
.lp-locate:disabled { opacity: .6; }
.lp-locate-ic { width: 15px; height: 15px; color: #FE601C; flex-shrink: 0; }

.lp-hint { font-size: .78rem; color: #6b7280; }
.lp-hint--warn { color: #b45309; }
.lp-coords { font-size: .75rem; color: #9ca3af; }

:deep(.buffs-pin-icon) { background: transparent; border: none; }

@media (prefers-reduced-motion: reduce) {
  .lp-input { transition: none; }
}
</style>
