<template>
  <div class="dlp">
    <!-- Has a pinned location -->
    <template v-if="hasPin">
      <div class="dlp-map-shell">
        <ClientOnly>
          <div v-show="!mapError" ref="mapEl" class="dlp-map" />
          <div v-if="mapError" class="dlp-map-skeleton"><span>Map unavailable</span></div>
          <div v-else-if="!tilesLoaded" class="dlp-map-skeleton" aria-hidden="true"><span>Loading map…</span></div>
          <template #fallback>
            <div class="dlp-map-skeleton"><span>Loading map…</span></div>
          </template>
        </ClientOnly>
      </div>

      <div class="dlp-details">
        <p v-if="loc.label" class="dlp-label">{{ loc.label }}</p>
        <p v-if="loc.note" class="dlp-note"><strong>Rider note:</strong> {{ loc.note }}</p>
        <p v-if="loc.contactName || loc.contactPhone" class="dlp-contact">
          <strong>Contact:</strong> {{ loc.contactName }}
          <a v-if="loc.contactPhone" :href="`tel:${loc.contactPhone}`" class="dlp-tel">{{ loc.contactPhone }}</a>
        </p>
        <p class="dlp-coords">{{ loc.lat }}, {{ loc.lng }}</p>
      </div>

      <div v-if="admin" class="dlp-actions">
        <button type="button" class="dlp-btn" @click="copy(mapsUrl, 'link')">
          {{ copied === 'link' ? '✓ Copied' : 'Copy Google Maps link' }}
        </button>
        <button type="button" class="dlp-btn" @click="copy(`${loc.lat}, ${loc.lng}`, 'coords')">
          {{ copied === 'coords' ? '✓ Copied' : 'Copy coordinates' }}
        </button>
        <a class="dlp-btn dlp-btn--link" :href="mapsUrl" target="_blank" rel="noopener">Open in Google Maps</a>
        <a class="dlp-btn dlp-btn--link" :href="wazeUrl" target="_blank" rel="noopener">Open in Waze</a>
      </div>

      <p v-if="admin" class="dlp-hint">
        To book: open in Google Maps → copy the address → paste into Grab Express or Maxim as the drop-off.
      </p>
    </template>

    <!-- Legacy order — text address only -->
    <template v-else>
      <p class="dlp-legacy">{{ fallbackAddress || 'No delivery location on file.' }}</p>
      <a
        v-if="admin && fallbackAddress"
        class="dlp-btn dlp-btn--link"
        :href="`https://www.google.com/maps?q=${encodeURIComponent(fallbackAddress)}`"
        target="_blank"
        rel="noopener"
      >Search this address in Google Maps</a>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { loadLeaflet, createPinIcon, TILE_URL, TILE_OPTIONS } from '~/composables/useLeaflet'

const props = defineProps({
  location: { type: Object, default: null },
  fallbackAddress: { type: String, default: '' },
  admin: { type: Boolean, default: false }
})

const loc = computed(() => props.location || {})
const hasPin = computed(() =>
  loc.value && typeof loc.value.lat === 'number' && typeof loc.value.lng === 'number'
)
const mapsUrl = computed(() =>
  loc.value.mapsUrl || `https://www.google.com/maps?q=${loc.value.lat},${loc.value.lng}`
)
const wazeUrl = computed(() =>
  `https://waze.com/ul?ll=${loc.value.lat},${loc.value.lng}&navigate=yes`
)

const copied = ref('')
async function copy(text, key) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy') } catch { /* noop */ }
    document.body.removeChild(ta)
  }
  copied.value = key
  setTimeout(() => { if (copied.value === key) copied.value = '' }, 1800)
}

const mapEl = ref(null)
const tilesLoaded = ref(false)
const mapError = ref(false)
let map = null
let resizeObs = null
let kickTimers = []

function nextFrame() {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === 'undefined') { setTimeout(resolve, 32); return }
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })
}

onMounted(async () => {
  if (!hasPin.value) return
  try {
    const L = await loadLeaflet()
    await nextTick()
    // Panel often mounts inside a collapsed/late-revealed container — wait two
    // frames so the 180px box is painted before Leaflet measures it.
    await nextFrame()
    if (!mapEl.value) return

    map = L.map(mapEl.value, {
      zoomControl: false, dragging: false, scrollWheelZoom: false, attributionControl: false,
      doubleClickZoom: false, boxZoom: false, keyboard: false, tap: false
    }).setView([loc.value.lat, loc.value.lng], 17)

    const kick = () => { if (map) map.invalidateSize({ animate: false }) }
    const tiles = L.tileLayer(TILE_URL, TILE_OPTIONS)
    tiles.on('load', () => { tilesLoaded.value = true; kick() })
    tiles.on('tileload', () => { if (!tilesLoaded.value) tilesLoaded.value = true })
    tiles.addTo(map)

    L.marker([loc.value.lat, loc.value.lng], { icon: createPinIcon(L), interactive: false }).addTo(map)

    map.whenReady(() => {
      if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(kick)
      ;[80, 200, 400, 800, 1400].forEach((t) => kickTimers.push(setTimeout(kick, t)))
      if (typeof ResizeObserver !== 'undefined' && mapEl.value) {
        resizeObs = new ResizeObserver(kick)
        resizeObs.observe(mapEl.value)
      }
    })

    // Safety net: reveal the map even if tile events never fire (all cached).
    kickTimers.push(setTimeout(() => { tilesLoaded.value = true; kick() }, 2500))
  } catch (err) {
    console.error('[DeliveryLocationPanel] map failed', err)
    mapError.value = true
  }
})

onBeforeUnmount(() => {
  kickTimers.forEach(clearTimeout)
  if (resizeObs) { resizeObs.disconnect(); resizeObs = null }
  if (map) { map.remove(); map = null }
})
</script>

<style scoped>
.dlp { display: flex; flex-direction: column; gap: 10px; }
.dlp-map-shell { position: relative; height: 180px; }
.dlp-map, .dlp-map-skeleton {
  position: absolute; inset: 0;
  height: 100%; width: 100%; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb;
}
.dlp-map { z-index: 1; background: #e8eaed; }
.dlp-map-skeleton {
  z-index: 2; display: flex; align-items: center; justify-content: center;
  background: #f3f4f6; color: #9ca3af; font-size: .8rem; pointer-events: none;
}
:deep(.leaflet-container) { font: inherit; background: #e8eaed; }
.dlp-details { font-size: .85rem; color: #374151; display: flex; flex-direction: column; gap: 3px; }
.dlp-label { font-weight: 700; color: #1f2937; }
.dlp-tel { color: #1A4189; font-weight: 700; margin-left: 4px; }
.dlp-coords { font-size: .72rem; color: #9ca3af; }
.dlp-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.dlp-btn {
  padding: 7px 12px; border-radius: 8px; font-size: .78rem; font-weight: 600;
  background: #FE601C; color: #fff; border: none; cursor: pointer; text-decoration: none;
  display: inline-block;
}
.dlp-btn--link { background: #1A4189; }
.dlp-hint { font-size: .74rem; color: #6b7280; }
.dlp-legacy { font-weight: 700; color: #1f2937; font-size: .9rem; }
</style>
