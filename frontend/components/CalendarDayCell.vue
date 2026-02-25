<template>
  <div 
    class="calendar-day-cell border border-gray-200 bg-white min-h-[160px] p-2 relative overflow-visible"
    :class="{
      'bg-gray-50': !isCurrentMonth,
      'bg-blue-50/30': isToday,
      'border-[#1A4189] border-2': isToday
    }"
  >
    <!-- Day Number -->
    <div 
      class="day-number text-xs font-semibold mb-2 relative"
      :class="{
        'text-gray-400': !isCurrentMonth,
        'text-[#1A4189] font-bold': isToday,
        'text-gray-700': isCurrentMonth && !isToday
      }"
    >
      {{ dayNumber }}
      <!-- Handwritten circle for today -->
      <svg 
        v-if="isToday" 
        class="absolute -top-2 -left-2 pointer-events-none"
        width="32" 
        height="32" 
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M 16 4 C 20 3.5 26 5 28 10 C 30 15 29 22 24 26 C 19 30 10 30 6 26 C 2 22 2 14 5 9 C 7.5 5 12 4.5 16 4" 
          stroke="#EF4444" 
          stroke-width="2.5" 
          stroke-linecap="round"
          fill="none"
          opacity="0.85"
          style="filter: blur(0.3px);"
        />
      </svg>
    </div>

    <!-- Events -->
    <div class="events-container space-y-1 overflow-visible">
      <EventSticker
        v-for="event in dayEvents"
        :key="event.id || event._id"
        :event="event"
      />
    </div>

    <!-- More events indicator -->
    <div 
      v-if="hasMoreEvents"
      class="absolute bottom-1 right-2 text-[10px] text-gray-500 font-medium"
    >
      +{{ remainingEventsCount }} more
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EventSticker from './EventSticker.vue'

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
  date: Date
  isCurrentMonth: boolean
  events: Event[]
}>()

const dayNumber = computed(() => props.date.getDate())

const isToday = computed(() => {
  const today = new Date()
  return (
    props.date.getDate() === today.getDate() &&
    props.date.getMonth() === today.getMonth() &&
    props.date.getFullYear() === today.getFullYear()
  )
})

// Cache the current day timestamp for performance
const currentDayTime = computed(() => {
  const day = new Date(props.date)
  day.setHours(0, 0, 0, 0)
  return day.getTime()
})

// Filter events once and cache the result
const allDayEvents = computed(() => {
  return props.events.filter(event => {
    const eventStart = new Date(event.date_start)
    const eventEnd = new Date(event.date_end)
    
    // Reset time parts for accurate date comparison
    eventStart.setHours(0, 0, 0, 0)
    eventEnd.setHours(23, 59, 59, 999)
    
    return currentDayTime.value >= eventStart.getTime() && currentDayTime.value <= eventEnd.getTime()
  })
})

const dayEvents = computed(() => {
  return allDayEvents.value.slice(0, 2) // Show max 2 events per day
})

const hasMoreEvents = computed(() => {
  return allDayEvents.value.length > 2
})

const remainingEventsCount = computed(() => {
  return allDayEvents.value.length - 2
})
</script>

<style scoped>
.calendar-day-cell {
  transition: box-shadow 0.2s ease;
}

.calendar-day-cell:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
