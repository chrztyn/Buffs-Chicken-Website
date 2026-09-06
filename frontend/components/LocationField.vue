<template>
  <div class="lf">
    <div class="lf-row">
      <input
        :id="uid"
        type="text"
        class="lf-input"
        :class="{ 'lf-input--error': error }"
        :value="displayAddress"
        readonly
        placeholder="No location pinned yet"
        @click="open = true"
      />
      <button type="button" class="lf-btn" @click="open = true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
        </svg>
        <span>{{ hasPin ? 'Change pin' : 'Pin on map' }}</span>
      </button>
    </div>

    <div v-if="hasPin" class="lf-meta">
      <span class="lf-badge">{{ model.lat.toFixed(5) }}, {{ model.lng.toFixed(5) }}</span>
      <button type="button" class="lf-clear" aria-label="Clear pinned location" @click="clear">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        Clear
      </button>
    </div>

    <LocationPickerModal
      v-if="open"
      :initial="hasPin ? { lat: model.lat, lng: model.lng } : null"
      @confirm="handleConfirm"
      @close="open = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LocationPickerModal from '~/components/LocationPickerModal.vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  error: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const uid = `lf-${Math.random().toString(36).slice(2, 8)}`
const open = ref(false)

const model = computed(() => props.modelValue || {})
const hasPin = computed(() =>
  Number.isFinite(model.value.lat) && Number.isFinite(model.value.lng)
)
const displayAddress = computed(() => model.value.label || '')

function handleConfirm({ address, lat, lng, source }) {
  emit('update:modelValue', {
    ...model.value,
    lat: Number(lat),
    lng: Number(lng),
    label: address || null,
    source: source === 'search' ? 'search' : 'pin'
  })
  open.value = false
}

function clear() {
  emit('update:modelValue', {
    ...model.value,
    lat: null,
    lng: null,
    label: null,
    source: 'pin'
  })
}
</script>

<style scoped>
.lf { display: flex; flex-direction: column; gap: 8px; }
.lf-row { display: flex; gap: 8px; align-items: stretch; }

.lf-input {
  flex: 1; min-width: 0; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 10px;
  font-size: 0.92rem; background: #f9fafb; color: #374151; cursor: pointer;
}
.lf-input--error { border-color: #dc2626; }
.lf-input::placeholder { color: #9ca3af; }

.lf-btn {
  flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 14px; border-radius: 10px; background: #FE601C; color: #fff;
  font-size: 0.85rem; font-weight: 700; transition: opacity .15s, transform .1s;
}
.lf-btn:hover { opacity: .92; }
.lf-btn:active { transform: scale(.97); }

.lf-meta { display: flex; align-items: center; gap: 10px; }
.lf-badge {
  font-size: 0.74rem; font-weight: 600; color: #1A4189;
  background: #eef2ff; border-radius: 999px; padding: 3px 10px;
}
.lf-clear {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 0.74rem; font-weight: 600; color: #6b7280;
}
.lf-clear:hover { color: #dc2626; }

@media (prefers-reduced-motion: reduce) {
  .lf-btn { transition: none; }
}
</style>
