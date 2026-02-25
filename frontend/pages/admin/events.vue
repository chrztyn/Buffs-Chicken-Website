<template>
  <div class="p-4 lg:p-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="font-['Caprasimo'] text-4xl text-[#1A4189] mb-2">Events</h1>
        <p class="font-['Unbounded'] text-gray-600">Manage calendar events</p>
      </div>
      <button
        @click="openAddEvent"
        class="px-6 py-2 bg-[#FE601C] text-white font-['Unbounded'] font-bold rounded-lg hover:bg-[#e5551a] transition"
      >
        + Add Event
      </button>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search events..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] font-['Unbounded']"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A4189]"></div>
      <p class="mt-4 text-gray-600 font-['Unbounded']">Loading events...</p>
    </div>

    <!-- Events List -->
    <div v-else-if="filteredEvents.length === 0" class="text-center py-12">
      <p class="text-gray-500 font-['Unbounded'] text-lg">No events found</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="event in filteredEvents"
        :key="event._id"
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-full"
      >
        <!-- Event Logo -->
        <div class="w-full h-48 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-4">
          <img
            :src="getEventImageUrl(event.logo_url)"
            :alt="event.name"
            class="max-w-full max-h-full object-contain"
          />
        </div>

        <!-- Event Info -->
        <div class="p-5 flex flex-col flex-grow">
          <!-- Title -->
          <h3 class="font-['Caprasimo'] text-lg text-[#1A4189] mb-2">{{ event.name }}</h3>
          
          <!-- Date Range -->
          <div class="mb-3 space-y-2 text-sm font-['Unbounded']">
            <div class="flex items-center gap-2 text-gray-700">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>{{ formatEventDate(event.date_start, event.date_end) }}</span>
            </div>
            
            <div class="flex items-center gap-2 text-gray-700">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ event.time }}</span>
            </div>
            
            <div class="flex items-center gap-2 text-gray-700">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{{ event.location }}</span>
            </div>
          </div>

          <!-- Description -->
          <p v-if="event.description" class="text-gray-600 text-xs font-['Unbounded'] mb-4 line-clamp-3 flex-grow">
            {{ event.description }}
          </p>

          <!-- Action Buttons -->
          <div class="flex gap-3 mt-auto">
            <button
              @click="openEditEvent(event)"
              class="flex-1 px-4 py-2 bg-[#1A4189] text-white font-['Unbounded'] font-bold rounded-lg hover:bg-[#153066] transition"
            >
              Edit
            </button>
            <button
              @click="confirmDelete(event)"
              class="px-4 py-2 bg-red-500 text-white font-['Unbounded'] font-bold rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Event Modal -->
    <AdminEventForm
      v-if="showEventForm"
      :event="selectedEvent"
      @close="closeEventForm"
      @saved="handleEventSaved"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteConfirm"
      :isOpen="showDeleteConfirm"
      title="Delete Event"
      :message="`Are you sure you want to delete &quot;${eventToDelete?.name}&quot;? This action cannot be undone.`"
      @confirm="deleteEvent"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '../../composables/useApi'
import AdminEventForm from '../../components/admin/AdminEventForm.vue'
import ConfirmModal from '../../components/admin/ConfirmModal.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

interface Event {
  _id: string
  name: string
  date_start: string
  date_end: string
  time: string
  location: string
  logo_url: string
  description?: string
}

const { getEvents, deleteEvent: deleteEventApi } = useApi()
const config = useRuntimeConfig()

const events = ref<Event[]>([])
const loading = ref(false)
const searchQuery = ref('')
const showEventForm = ref(false)
const selectedEvent = ref<Event | null>(null)
const showDeleteConfirm = ref(false)
const eventToDelete = ref<Event | null>(null)

const filteredEvents = computed(() => {
  if (!searchQuery.value) return events.value
  
  const query = searchQuery.value.toLowerCase()
  return events.value.filter(event => 
    event.name.toLowerCase().includes(query) ||
    event.location.toLowerCase().includes(query) ||
    event.description?.toLowerCase().includes(query)
  )
})

const fetchEvents = async () => {
  loading.value = true
  try {
    const response = await getEvents()
    events.value = response.data || []
  } catch (error) {
    console.error('Error fetching events:', error)
  } finally {
    loading.value = false
  }
}

const getEventImageUrl = (logoUrl: string | undefined) => {
  if (!logoUrl) return ''
  if (logoUrl.startsWith('http')) {
    return logoUrl
  }
  // Static files are served from root, not /api/
  return `${config.public.socketUrl}${logoUrl}`
}

const formatEventDate = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('en-US', options)
  }
  
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
}

const openAddEvent = () => {
  selectedEvent.value = null
  showEventForm.value = true
}

const openEditEvent = (event: Event) => {
  selectedEvent.value = event
  showEventForm.value = true
}

const closeEventForm = () => {
  showEventForm.value = false
  selectedEvent.value = null
}

const handleEventSaved = () => {
  closeEventForm()
  fetchEvents()
}

const confirmDelete = (event: Event) => {
  eventToDelete.value = event
  showDeleteConfirm.value = true
}

const deleteEvent = async () => {
  if (!eventToDelete.value) return
  
  try {
    await deleteEventApi(eventToDelete.value._id)
    events.value = events.value.filter(e => e._id !== eventToDelete.value!._id)
    showDeleteConfirm.value = false
    eventToDelete.value = null
  } catch (error) {
    console.error('Error deleting event:', error)
    alert('Failed to delete event. Please try again.')
  }
}

onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
/* Add any additional styles here */
</style>
