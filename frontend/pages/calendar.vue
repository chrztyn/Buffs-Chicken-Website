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

      <!-- Calendar Grid -->
      <div v-else-if="!error" class="bg-white rounded-lg shadow-md border-2 border-gray-200 min-h-[700px]">
        <CalendarGrid
          :year="currentYear"
          :month="currentMonth"
          :events="events"
        />
      </div>

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

      <!-- Empty State -->
      <div v-if="!loading && !error && events.length === 0" class="mt-8 text-center py-12 bg-white rounded-lg shadow-md border-2 border-gray-200">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="text-gray-600 text-lg font-medium">No events this month</p>
        <p class="text-gray-500 text-sm mt-2">Check back later for upcoming events</p>
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

const currentDate = new Date()
const currentYear = ref(currentDate.getFullYear())
const currentMonth = ref(currentDate.getMonth()) // 0-indexed

const events = ref<Event[]>([])
const loading = ref(false)
const error = ref('')

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const currentMonthName = computed(() => monthNames[currentMonth.value])

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

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
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
useHead({
  title: 'Events Calendar - Buffs Chicken',
  meta: [
    {
      name: 'description',
      content: 'Check out upcoming events and special occasions at Buffs Chicken'
    }
  ]
})
</script>

<style scoped>
/* Add any additional styles here */
</style>
