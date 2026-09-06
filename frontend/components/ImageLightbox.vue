<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 select-none"
        @click.self="close"
      >
        <!-- Top bar -->
        <div class="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-10">
          <span class="text-white/80 text-xs font-['Unbounded'] truncate max-w-[60%]">{{ alt }}</span>
          <button
            type="button"
            class="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            aria-label="Close image viewer"
            @click="close"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Image stage -->
        <div
          ref="stage"
          class="absolute inset-0 overflow-hidden"
          :class="scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'"
          @wheel.prevent="onWheel"
          @dblclick="toggleZoom"
          @mousedown="onPointerDown"
          @touchstart.passive="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend="onTouchEnd"
        >
          <img
            :src="src"
            :alt="alt"
            draggable="false"
            class="absolute left-1/2 top-1/2 max-w-none will-change-transform"
            :style="imageStyle"
            @click.stop
          />
        </div>

        <!-- Zoom controls -->
        <div class="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          <button
            type="button"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition disabled:opacity-30"
            :disabled="scale <= MIN_SCALE"
            aria-label="Zoom out"
            @click="zoomBy(-ZOOM_STEP)"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <button
            type="button"
            class="px-3 h-10 flex items-center justify-center rounded-full bg-white/10 text-white text-xs font-['Unbounded'] hover:bg-white/20 transition"
            aria-label="Reset zoom"
            @click="reset"
          >
            {{ Math.round(scale * 100) }}%
          </button>
          <button
            type="button"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition disabled:opacity-30"
            :disabled="scale >= MAX_SCALE"
            aria-label="Zoom in"
            @click="zoomBy(ZOOM_STEP)"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16M4 12h16" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
  open: boolean
}>()

const emit = defineEmits<{ close: [] }>()

const MIN_SCALE = 1
const MAX_SCALE = 5
const ZOOM_STEP = 0.5

const scale = ref(1)
const tx = ref(0)
const ty = ref(0)
const stage = ref<HTMLElement | null>(null)

const imageStyle = computed(() => ({
  transform: `translate(-50%, -50%) translate(${tx.value}px, ${ty.value}px) scale(${scale.value})`,
  transition: dragging.value || pinching.value ? 'none' : 'transform 0.2s ease',
  maxHeight: '85vh',
  maxWidth: '92vw',
}))

function clampPan() {
  if (scale.value <= 1) {
    tx.value = 0
    ty.value = 0
    return
  }
  const el = stage.value
  if (!el) return
  const limitX = (el.clientWidth * (scale.value - 1)) / 2
  const limitY = (el.clientHeight * (scale.value - 1)) / 2
  tx.value = Math.max(-limitX, Math.min(limitX, tx.value))
  ty.value = Math.max(-limitY, Math.min(limitY, ty.value))
}

function setScale(next: number) {
  scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, Number(next.toFixed(2))))
  clampPan()
}

function zoomBy(delta: number) {
  setScale(scale.value + delta)
}

function reset() {
  scale.value = 1
  tx.value = 0
  ty.value = 0
}

function toggleZoom() {
  if (scale.value > 1) reset()
  else setScale(2.5)
}

function close() {
  emit('close')
}

function onWheel(e: WheelEvent) {
  zoomBy(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)
}

// ── Mouse drag to pan ────────────────────────────────────────────────
const dragging = ref(false)
let startX = 0
let startY = 0
let startTx = 0
let startTy = 0

function onPointerDown(e: MouseEvent) {
  if (scale.value <= 1) return
  dragging.value = true
  startX = e.clientX
  startY = e.clientY
  startTx = tx.value
  startTy = ty.value
  window.addEventListener('mousemove', onPointerMove)
  window.addEventListener('mouseup', onPointerUp)
}

function onPointerMove(e: MouseEvent) {
  if (!dragging.value) return
  tx.value = startTx + (e.clientX - startX)
  ty.value = startTy + (e.clientY - startY)
  clampPan()
}

function onPointerUp() {
  dragging.value = false
  window.removeEventListener('mousemove', onPointerMove)
  window.removeEventListener('mouseup', onPointerUp)
}

// ── Touch: pinch zoom + one-finger pan ───────────────────────────────
const pinching = ref(false)
let pinchStartDist = 0
let pinchStartScale = 1
let touchStartX = 0
let touchStartY = 0
let touchStartTx = 0
let touchStartTy = 0

function dist(t: TouchList) {
  const dx = t[0].clientX - t[1].clientX
  const dy = t[0].clientY - t[1].clientY
  return Math.hypot(dx, dy)
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 2) {
    pinching.value = true
    pinchStartDist = dist(e.touches)
    pinchStartScale = scale.value
  } else if (e.touches.length === 1 && scale.value > 1) {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
    touchStartTx = tx.value
    touchStartTy = ty.value
  }
}

function onTouchMove(e: TouchEvent) {
  if (pinching.value && e.touches.length === 2) {
    const ratio = dist(e.touches) / pinchStartDist
    setScale(pinchStartScale * ratio)
  } else if (e.touches.length === 1 && scale.value > 1) {
    tx.value = touchStartTx + (e.touches[0].clientX - touchStartX)
    ty.value = touchStartTy + (e.touches[0].clientY - touchStartY)
    clampPan()
  }
}

function onTouchEnd(e: TouchEvent) {
  if (e.touches.length < 2) pinching.value = false
}

// ── Esc to close, lock body scroll while open ────────────────────────
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
  else if (e.key === '+' || e.key === '=') zoomBy(ZOOM_STEP)
  else if (e.key === '-') zoomBy(-ZOOM_STEP)
}

watch(
  () => props.open,
  (isOpen) => {
    if (typeof document === 'undefined') return
    if (isOpen) {
      reset()
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('mousemove', onPointerMove)
  window.removeEventListener('mouseup', onPointerUp)
})
</script>
