<template>
  <div 
    class="event-popover absolute z-[9999] bg-white rounded-lg shadow-2xl border-2 border-gray-200 p-4 min-w-[280px] max-w-[320px]"
    style="left: 50%; top: calc(100% + 8px); transform: translateX(-50%);"
    @mouseenter="$emit('keep-open')"
    @mouseleave="$emit('close')"
  >
    <!-- Arrow -->
    <div class="popover-arrow absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-gray-200 rotate-45"></div>

    <!-- Content -->
    <div class="relative z-10 bg-white">
      <!-- Event Logo -->
      <div class="mb-3 flex justify-center">
        <div class="bg-white p-3 rounded-md shadow-lg border-2 border-white">
          <img
            :src="imageUrl"
            :alt="event.name"
            class="w-24 h-24 object-contain rounded"
          />
        </div>
      </div>

      <!-- Event Details -->
      <div class="space-y-2">
        <h3 class="font-['Unbounded'] font-bold text-base text-[#1A4189] mb-2">
          {{ event.name }}
        </h3>

        <div class="space-y-1.5 text-sm">
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span class="text-gray-700">{{ formatDateRange }}</span>
          </div>

          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-gray-700">{{ event.time }}</span>
          </div>

          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="text-gray-700">{{ event.location }}</span>
          </div>
        </div>

        <div v-if="event.description" class="mt-3 pt-3 border-t border-gray-200">
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ event.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
  imageUrl: string
}>()

defineEmits(['close', 'keep-open'])

const formatDateRange = computed(() => {
  const start = new Date(props.event.date_start)
  const end = new Date(props.event.date_end)
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('en-US', options)
  }
  
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
})
</script>

<style scoped>
.event-popover {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
