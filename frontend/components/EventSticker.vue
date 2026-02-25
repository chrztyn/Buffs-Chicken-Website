<template>
  <div 
    class="event-sticker group cursor-pointer relative z-10"
    @mouseenter="showPopover"
    @mouseleave="hidePopover"
    @click="togglePopover"
  >
    <!-- Sticker Image with drop shadow -->
    <img
      :src="imageUrl"
      :alt="event.name"
      class="w-[110px] h-[110px] object-contain transition-transform duration-200 group-hover:scale-110 mb-1"
      :style="imageStyle"
      loading="lazy"
      decoding="async"
    />

    <!-- Event Details Text -->
    <div class="event-details text-[11px] leading-snug text-gray-800 px-0.5 max-w-[110px]">
      <div class="font-bold truncate" :title="event.name">{{ event.name }}</div>
      <div class="text-gray-700 truncate text-[10px]">{{ event.time }}</div>
      <div class="text-gray-600 truncate text-[9px]">{{ event.location }}</div>
      <div v-if="isMultiDay" class="text-gray-600 text-[9px]">{{ formatDateRange }}</div>
    </div>

    <!-- Popover -->
    <EventPopover
      v-if="isPopoverVisible"
      :event="event"
      :imageUrl="imageUrl"
      @close="hidePopover"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import EventPopover from './EventPopover.vue'

interface Event {
  _id?: string
  id?: string
  name: string
  date_start: string
  date_end: string
  time: string
  location: string
  logo_url: string
  description?: string
}

const props = defineProps<{
  event: Event
}>()

const config = useRuntimeConfig()
const isPopoverVisible = ref(false)
let popoverTimeout: NodeJS.Timeout | null = null

// Generate deterministic rotation based on event ID
const rotation = computed(() => {
  const eventId = (props.event.id || props.event._id || '0') as string
  const id = parseInt(eventId) || 0
  // More dramatic rotation angles for scrapbook style
  const angle = ((id % 25) - 12)
  return angle
})

const imageStyle = computed(() => ({
  transform: `rotate(${rotation.value}deg)`,
  filter: 'drop-shadow(0 8px 12px rgba(0, 0, 0, 0.3)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15))',
  willChange: 'transform'
}))

const imageUrl = computed(() => {
  if (props.event.logo_url.startsWith('http')) {
    return props.event.logo_url
  }
  // Static files are served from root, not /api/
  return `${config.public.socketUrl}${props.event.logo_url}`
})

const isMultiDay = computed(() => {
  const start = new Date(props.event.date_start)
  const end = new Date(props.event.date_end)
  return start.toDateString() !== end.toDateString()
})

const formatDateRange = computed(() => {
  const start = new Date(props.event.date_start)
  const end = new Date(props.event.date_end)
  const startStr = `${start.getMonth() + 1}/${start.getDate()}`
  const endStr = `${end.getMonth() + 1}/${end.getDate()}`
  return `${startStr} - ${endStr}`
})

const showPopover = () => {
  if (popoverTimeout) clearTimeout(popoverTimeout)
  isPopoverVisible.value = true
}

const hidePopover = () => {
  if (popoverTimeout) clearTimeout(popoverTimeout)
  popoverTimeout = setTimeout(() => {
    isPopoverVisible.value = false
  }, 100)
}

const togglePopover = () => {
  isPopoverVisible.value = !isPopoverVisible.value
}
</script>

<style scoped>
/* Sticker styles */
</style>
