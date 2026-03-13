<template>
  <div class="min-h-screen bg-[#FBF4E5]">
    <!-- Navigation Bar -->
    <Navbar />

    <!-- Calendar Page Content -->
    <div class="calendar-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="font-['Unbounded'] font-bold text-4xl text-[#1A4189] mb-2">
          Events Calendar
        </h1>
        <p class="text-gray-600 text-base">
          Check out our upcoming events and special occasions
        </p>
      </div>

      <!-- Month Navigation -->
      <div class="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-4 border-2 border-gray-200">
        <!-- Previous Month Button -->
        <button
          @click="previousMonth"
          class="flex items-center gap-2 px-4 py-2 bg-[#1A4189] text-white rounded-lg hover:bg-[#15306d] transition-colors duration-200 font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span class="hidden sm:inline">Previous</span>
        </button>

        <!-- Current Month & Year -->
        <div class="text-center">
          <h2 class="font-['Unbounded'] font-bold text-2xl text-gray-800">
            {{ currentMonthName }} {{ currentYear }}
          </h2>
        </div>

        <!-- Next Month Button -->
        <button
          @click="nextMonth"
          class="flex items-center gap-2 px-4 py-2 bg-[#1A4189] text-white rounded-lg hover:bg-[#15306d] transition-colors duration-200 font-medium"
        >
          <span class="hidden sm:inline">Next</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A4189]"></div>
        <p class="mt-4 text-gray-600">Loading events...</p>
      </div>

      <template v-else-if="!error">
        <!-- ══════════════════════════════════════════════
             MOBILE LAYOUT  (below md — under 768px)
             Apple Calendar-style compact grid + event list
             ══════════════════════════════════════════════ -->
        <div class="block md:hidden">

          <!-- Compact month grid -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-3 mb-4 w-full overflow-hidden">

            <!-- Day-of-week header -->
            <div class="grid grid-cols-7 mb-1">
              <div
                v-for="day in daysOfWeek"
                :key="day"
                class="text-center text-xs font-semibold text-gray-400 py-1"
              >{{ day }}</div>
            </div>

            <!-- Day cells -->
            <div class="grid grid-cols-7">
              <button
                v-for="(day, index) in calendarDays"
                :key="index"
                @click="selectDay(day.date)"
                class="flex flex-col items-center justify-start py-0.5 focus:outline-none"
              >
                <!-- Day number with today / selected circle -->
                <span
                  class="w-8 h-8 flex items-center justify-center text-sm rounded-full leading-none"
                  :class="[
                    isSelected(day.date)
                      ? 'bg-[#FE601C] text-white font-bold'
                      : isToday(day.date)
                      ? 'bg-[#1A4189] text-white font-bold'
                      : !day.isCurrentMonth
                      ? 'text-gray-300'
                      : 'text-gray-800'
                  ]"
                >{{ day.date.getDate() }}</span>

                <!-- Event dot indicator -->
                <span
                  class="mt-0.5 w-1.5 h-1.5 rounded-full"
                  :class="dateHasEvents(day.date) ? 'bg-[#FE601C]' : 'bg-transparent'"
                ></span>
              </button>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px bg-gray-200 mb-3"></div>

          <!-- Selected day hint -->
          <p class="text-center text-xs text-gray-400 pb-2">
            <template v-if="selectedDayEvents.length === 0">No events on {{ selectedDayLabel }}</template>
            <template v-else>{{ selectedDayEvents.length }} event{{ selectedDayEvents.length > 1 ? 's' : '' }} on {{ selectedDayLabel }} — tap a date to view</template>
          </p>
        </div>

        <!-- ─────────────────────────────────────────────
             MOBILE EVENT DETAIL BOTTOM SHEET
             Opens when a day with events is tapped
             ──────────────────────────────────────────── -->
        <Teleport to="body">
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-if="showMobileModal"
              class="fixed inset-0 z-[9999] flex items-end justify-center md:hidden"
              @click.self="showMobileModal = false"
            >
              <!-- Backdrop -->
              <div class="absolute inset-0 bg-black/50" @click="showMobileModal = false"></div>

              <!-- Sheet -->
              <Transition
                enter-active-class="transition-transform duration-300 ease-out"
                enter-from-class="translate-y-full"
                enter-to-class="translate-y-0"
                leave-active-class="transition-transform duration-200 ease-in"
                leave-from-class="translate-y-0"
                leave-to-class="translate-y-full"
              >
                <div
                  v-if="showMobileModal"
                  class="relative z-10 w-full bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl"
                  :style="sheetDragStyle"
                >
                  <!-- Handle + header (drag target only) -->
                  <div
                    class="flex-shrink-0 pt-3 pb-0"
                    @touchstart.passive="onSheetTouchStart"
                    @touchmove="onSheetTouchMove"
                    @touchend="onSheetTouchEnd"
                  >
                    <div class="flex justify-center mb-3 cursor-grab active:cursor-grabbing">
                      <div class="w-10 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                    <div class="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
                      <h3 class="font-['Unbounded'] font-bold text-sm text-[#1A4189]">
                        {{ selectedDayLabel }}
                      </h3>
                      <button
                        @click="showMobileModal = false"
                        class="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                        aria-label="Close"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Event cards — scrollable -->
                  <div class="overflow-y-auto flex-1">
                    <div
                      v-for="(event, idx) in selectedDayEvents"
                      :key="event.id || event._id"
                      class="px-4 py-4"
                      :class="idx > 0 ? 'border-t border-gray-100' : ''"
                    >
                      <!-- Event logo -->
                      <div class="mb-3 flex justify-center">
                        <div class="bg-white p-3 rounded-md shadow-lg border-2 border-gray-100">
                          <img
                            :src="getImageUrl(event)"
                            :alt="event.name"
                            class="w-24 h-24 object-contain rounded"
                          />
                        </div>
                      </div>

                      <!-- Event details -->
                      <div class="space-y-2">
                        <h4 class="font-['Unbounded'] font-bold text-base text-[#1A4189] mb-2 text-center">
                          {{ event.name }}
                        </h4>

                        <div class="space-y-1.5 text-sm">
                          <!-- Date -->
                          <div class="flex items-start gap-2">
                            <svg class="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span class="text-gray-700">{{ formatMobileEventDateRange(event) }}</span>
                          </div>
                          <!-- Time -->
                          <div class="flex items-start gap-2">
                            <svg class="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-gray-700">{{ event.time }}</span>
                          </div>
                          <!-- Location -->
                          <div class="flex items-start gap-2">
                            <svg class="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span class="text-gray-700">{{ event.location }}</span>
                          </div>
                        </div>

                        <!-- Description -->
                        <div v-if="event.description" class="mt-3 pt-3 border-t border-gray-200">
                          <p class="text-sm text-gray-600 leading-relaxed">{{ event.description }}</p>
                        </div>
                      </div>
                    </div>
                    <!-- Bottom safe-area spacer -->
                    <div class="h-6"></div>
                  </div>
                </div>
              </Transition>
            </div>
          </Transition>
        </Teleport>

        <!-- ══════════════════════════════════════════════
             DESKTOP / TABLET LAYOUT  (md and above — 768px+)
             Full calendar grid — unchanged
             ══════════════════════════════════════════════ -->
        <div class="hidden md:block bg-white rounded-lg shadow-md border-2 border-gray-200 min-h-[700px]">
          <CalendarGrid
            :year="currentYear"
            :month="currentMonth"
            :events="events"
          />
        </div>

        <!-- Desktop empty state (mobile shows "No events this day" inline) -->
        <div
          v-if="events.length === 0"
          class="hidden md:block mt-8 text-center py-12 bg-white rounded-lg shadow-md border-2 border-gray-200"
        >
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p class="text-gray-600 text-lg font-medium">No events this month</p>
          <p class="text-gray-500 text-sm mt-2">Check back later for upcoming events</p>
        </div>
      </template>

      <!-- Error State -->
      <div v-else class="text-center py-12 bg-white rounded-lg shadow-md border-2 border-red-200">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-red-600 font-medium">{{ error }}</p>
        <button
          @click="fetchEvents"
          class="mt-4 px-6 py-2 bg-[#1A4189] text-white rounded-lg hover:bg-[#15306d] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import CalendarGrid from '../components/CalendarGrid.vue'
import EventPopover from '../components/EventPopover.vue'
import { useApi } from '../composables/useApi'

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

const { getEventsByMonth } = useApi()
const config = useRuntimeConfig()

const currentDate = new Date()
const currentYear = ref(currentDate.getFullYear())
const currentMonth = ref(currentDate.getMonth()) // 0-indexed

const events = ref<Event[]>([])
const loading = ref(false)
const error = ref('')

// Mobile calendar state
const selectedDay = ref<Date>(new Date())
const showMobileModal = ref(false)

// Swipe-to-dismiss state
const dragY = ref(0)
const dragStartY = ref(0)
const isDragging = ref(false)

const sheetDragStyle = computed(() => {
  if (dragY.value <= 0) return {}
  return {
    transform: `translateY(${dragY.value}px)`,
    transition: isDragging.value ? 'none' : 'transform 0.3s ease'
  }
})

const onSheetTouchStart = (e: TouchEvent) => {
  dragStartY.value = e.touches[0]?.clientY ?? 0
  dragY.value = 0
  isDragging.value = true
}

const onSheetTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  e.preventDefault() // block page scroll while dragging the handle
  const delta = (e.touches[0]?.clientY ?? dragStartY.value) - dragStartY.value
  dragY.value = Math.max(0, delta) // only allow downward drag
}

const onSheetTouchEnd = () => {
  isDragging.value = false
  if (dragY.value > 80) {
    // Snapped past threshold — animate out then close
    dragY.value = window.innerHeight
    setTimeout(() => {
      showMobileModal.value = false
      dragY.value = 0
    }, 300)
  } else {
    // Snap back
    dragY.value = 0
  }
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const currentMonthName = computed(() => monthNames[currentMonth.value])

// Mobile grid: same day generation logic as CalendarGrid.vue
const calendarDays = computed(() => {
  const days: Array<{ date: Date; isCurrentMonth: boolean }> = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const firstDayOfWeek = firstDay.getDay()
  const lastDate = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate()

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({ date: new Date(currentYear.value, currentMonth.value - 1, prevMonthLastDay - i), isCurrentMonth: false })
  }
  for (let i = 1; i <= lastDate; i++) {
    days.push({ date: new Date(currentYear.value, currentMonth.value, i), isCurrentMonth: true })
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(currentYear.value, currentMonth.value + 1, i), isCurrentMonth: false })
  }
  return days
})

const isToday = (date: Date) => date.toDateString() === new Date().toDateString()

const isSelected = (date: Date) =>
  selectedDay.value ? date.toDateString() === selectedDay.value.toDateString() : false

const dateHasEvents = (date: Date) => {
  const t = new Date(date).setHours(0, 0, 0, 0)
  return events.value.some(ev => {
    const s = new Date(ev.date_start); s.setHours(0, 0, 0, 0)
    const e = new Date(ev.date_end);   e.setHours(23, 59, 59, 999)
    return t >= s.getTime() && t <= e.getTime()
  })
}

const getImageUrl = (event: Event) => {
  if (event.logo_url.startsWith('http')) return event.logo_url
  return `${config.public.socketUrl}${event.logo_url}`
}

const selectedDayEvents = computed(() => {
  if (!selectedDay.value) return []
  const dayStart = new Date(selectedDay.value); dayStart.setHours(0, 0, 0, 0)
  const dayEnd   = new Date(selectedDay.value); dayEnd.setHours(23, 59, 59, 999)
  return events.value.filter(ev => {
    const s = new Date(ev.date_start); s.setHours(0, 0, 0, 0)
    const e = new Date(ev.date_end);   e.setHours(23, 59, 59, 999)
    return dayStart.getTime() <= e.getTime() && dayEnd.getTime() >= s.getTime()
  })
})

const selectedDayLabel = computed(() => {
  if (!selectedDay.value) return ''
  return selectedDay.value.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
})

const formatMobileEventDateRange = (event: Event) => {
  const start = new Date(event.date_start)
  const end = new Date(event.date_end)
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  if (start.toDateString() === end.toDateString()) return start.toLocaleDateString('en-US', options)
  return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}`
}

const selectDay = (date: Date) => {
  selectedDay.value = date
  dragY.value = 0
  showMobileModal.value = dateHasEvents(date)
}

const fetchEvents = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await getEventsByMonth(currentYear.value, currentMonth.value + 1)
    // Backend returns { data: events }, so access response.data.data
    const eventsData = response.data?.data || response.data || []
    
    // Ensure eventsData is an array
    if (Array.isArray(eventsData)) {
      events.value = eventsData.map((event: any) => ({
        ...event,
        id: event._id || event.id
      }))
    } else {
      events.value = []
    }
    console.log('Fetched events:', events.value)
  } catch (err: any) {
    console.error('Error fetching events:', err)
    error.value = 'Failed to load events. Please try again later.'
  } finally {
    loading.value = false
  }
}

const syncSelectedDay = () => {
  showMobileModal.value = false
  const today = new Date()
  if (today.getMonth() === currentMonth.value && today.getFullYear() === currentYear.value) {
    selectedDay.value = today
  } else {
    selectedDay.value = new Date(currentYear.value, currentMonth.value, 1)
  }
}

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  syncSelectedDay()
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  syncSelectedDay()
}

// Watch for month/year changes and fetch events
watch([currentYear, currentMonth], () => {
  fetchEvents()
})

// Fetch events on mount
onMounted(() => {
  fetchEvents()
})

// Set page metadata
useSeoMeta({
  robots: 'index, follow',
  ogTitle: 'Events Calendar - Buffs Chicken',
  ogDescription: 'Check out upcoming events and special occasions at Buffs Chicken in Angeles City.',
  ogType: 'website',
  ogUrl: 'https://www.buffschicken.com/calendar',
  ogSiteName: 'Buffs Chicken',
})
useHead({
  title: 'Events Calendar - Buffs Chicken',
  meta: [
    {
      name: 'description',
      content: 'Check out upcoming events and special occasions at Buffs Chicken in Angeles City.'
    }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.buffschicken.com/calendar' }
  ]
})

// Event JSON-LD schema — dynamically generated from fetched events for Google rich results
useHead(computed(() => {
  if (!events.value || events.value.length === 0) return {}
  return {
    script: [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        events.value.map(event => {
          const schema: Record<string, any> = {
            '@context': 'https://schema.org',
            '@type': 'Event',
            'name': event.name,
            'startDate': new Date(event.date_start).toISOString(),
            'eventStatus': 'https://schema.org/EventScheduled',
            'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
            'location': {
              '@type': 'Place',
              'name': event.location || 'The Hood, Angeles City',
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': '699 MacArthur Hwy, Sto. Rosario, Sto. Domingo',
                'addressLocality': 'Angeles City',
                'addressRegion': 'Pampanga',
                'addressCountry': 'PH'
              }
            },
            'organizer': {
              '@type': 'Organization',
              'name': 'Buffs Chicken',
              'url': 'https://www.buffschicken.com'
            }
          }
          if (event.description) schema.description = event.description
          if (event.date_end) schema.endDate = new Date(event.date_end).toISOString()
          if (event.logo_url) {
            schema.image = event.logo_url.startsWith('http')
              ? event.logo_url
              : `${config.public.socketUrl}${event.logo_url}`
          }
          return schema
        })
      )
    }]
  }
}))
</script>

<style scoped>
/* Add any additional styles here */
</style>
