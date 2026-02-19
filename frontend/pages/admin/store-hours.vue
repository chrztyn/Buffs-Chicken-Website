<template>
  <div class="p-4 lg:p-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="font-['Unbounded'] text-4xl text-[#1A4189] mb-2">Store Hours Management</h1>
      <p class="font-['Unbounded'] text-gray-600">Manage your store operating hours and availability</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#FE601C] border-t-transparent"></div>
        <p class="mt-4 text-gray-600 font-['Unbounded']">Loading settings...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Manual Override Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8 border-2" :class="manualOverride.isActive ? (manualOverride.isClosed ? 'border-red-500' : 'border-green-500') : 'border-gray-200'">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="font-['Unbounded'] text-2xl text-[#1A4189] mb-2">Manual Override</h2>
            <p class="font-['Unbounded'] text-sm text-gray-600">Override scheduled hours and control store status manually</p>
          </div>
          <div class="text-right">
            <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full" :class="manualOverride.isActive ? (manualOverride.isClosed ? 'bg-red-100' : 'bg-green-100') : 'bg-gray-100'">
              <span class="w-3 h-3 rounded-full animate-pulse" :class="manualOverride.isActive ? (manualOverride.isClosed ? 'bg-red-500' : 'bg-green-500') : 'bg-gray-400'"></span>
              <span class="font-['Unbounded'] text-sm font-bold" :class="manualOverride.isActive ? (manualOverride.isClosed ? 'text-red-700' : 'text-green-700') : 'text-gray-700'">
                {{ manualOverride.isActive ? (manualOverride.isClosed ? 'CLOSED' : 'OPEN') : 'FOLLOWING SCHEDULE' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Override Toggle -->
        <div class="flex items-center gap-4 mb-4">
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="manualOverride.isActive" class="sr-only peer" @change="handleOverrideChange">
            <div class="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#FE601C]"></div>
          </label>
          <span class="font-['Unbounded'] text-sm font-semibold text-gray-700">Enable Manual Override</span>
        </div>

        <!-- Info message when override is disabled -->
        <div v-if="!manualOverride.isActive" class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <p class="font-['Unbounded'] text-sm text-blue-800">
            <strong>Following scheduled hours:</strong> Store status is automatically determined by your weekly schedule.<br>
            <span class="text-xs mt-1 inline-block">Current day: {{ new Date().toLocaleDateString('en-US', { weekday: 'long' }) }}</span>
          </p>
        </div>

        <!-- Override Status (when active) -->
        <div v-if="manualOverride.isActive" class="space-y-4">
          <div class="flex items-center gap-4">
            <label class="font-['Unbounded'] text-sm font-semibold text-gray-700 min-w-[120px]">Store Status:</label>
            <div class="flex gap-3">
              <button 
                @click="setOverrideStatus(false)" 
                class="px-6 py-2 rounded-lg font-['Unbounded'] font-semibold transition-all"
                :class="!manualOverride.isClosed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              >
                🟢 OPEN
              </button>
              <button 
                @click="setOverrideStatus(true)" 
                class="px-6 py-2 rounded-lg font-['Unbounded'] font-semibold transition-all"
                :class="manualOverride.isClosed ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              >
                🔴 CLOSED
              </button>
            </div>
          </div>

          <div>
            <label class="block font-['Unbounded'] text-sm font-semibold text-gray-700 mb-2">Custom Message (Optional):</label>
            <textarea 
              v-model="manualOverride.message" 
              rows="3" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Unbounded'] text-sm focus:ring-2 focus:ring-[#FE601C] focus:border-transparent"
              placeholder="Example: We're at a pop-up event at SM Clark! Come visit us there."
            ></textarea>
            <p class="mt-1 text-xs text-gray-500 font-['Unbounded']">This message will be displayed to customers on the menu page</p>
            
            <button 
              @click="saveManualOverride" 
              :disabled="saving"
              class="mt-3 w-full px-4 py-2 bg-blue-500 text-white font-['Unbounded'] font-semibold rounded-lg hover:bg-blue-600 transition disabled:opacity-50 text-sm"
            >
              {{ saving ? 'Saving...' : 'Save Message' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Weekly Schedule Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="font-['Unbounded'] text-2xl text-[#1A4189] mb-2">Weekly Schedule</h2>
            <p class="font-['Unbounded'] text-sm text-gray-600">Set your regular operating hours and custom messages for each day</p>
          </div>
          <button 
            @click="copyToAllDays" 
            class="px-4 py-2 bg-blue-500 text-white font-['Unbounded'] font-semibold rounded-lg hover:bg-blue-600 transition text-sm"
          >
            Copy Monday to All Days
          </button>
        </div>

        <!-- Info box about custom messages -->
        <div class="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p class="font-['Unbounded'] text-sm text-blue-800 font-semibold mb-1">Custom Messages</p>
              <p class="font-['Unbounded'] text-xs text-blue-700">
                Add special notes to any day without changing hours. Examples: "Happy Hour 5-7 PM!", "Limited menu today", "Special: Buy 1 Get 1". 
                These messages appear on the menu page for customers to see.
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div v-for="day in daysOfWeek" :key="day" class="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="min-w-[120px]">
                <span class="font-['Unbounded'] text-sm font-bold text-gray-700 uppercase">{{ day }}</span>
              </div>

              <div class="flex items-center gap-2">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="operatingHours[day].isOpen" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
                <span class="font-['Unbounded'] text-xs font-semibold" :class="operatingHours[day].isOpen ? 'text-green-600' : 'text-red-600'">
                  {{ operatingHours[day].isOpen ? 'Open' : 'Closed' }}
                </span>
              </div>

              <div v-if="operatingHours[day].isOpen" class="flex items-center gap-3 flex-1">
                <div class="flex items-center gap-2">
                  <label class="font-['Unbounded'] text-xs text-gray-600 font-semibold">Opens:</label>
                  <input 
                    type="time" 
                    v-model="operatingHours[day].openTime" 
                    class="px-3 py-2 border border-gray-300 rounded-lg font-['Unbounded'] text-sm focus:ring-2 focus:ring-[#FE601C] focus:border-transparent"
                  >
                </div>
                <span class="text-gray-400">—</span>
                <div class="flex items-center gap-2">
                  <label class="font-['Unbounded'] text-xs text-gray-600 font-semibold">Closes:</label>
                  <input 
                    type="time" 
                    v-model="operatingHours[day].closeTime" 
                    class="px-3 py-2 border border-gray-300 rounded-lg font-['Unbounded'] text-sm focus:ring-2 focus:ring-[#FE601C] focus:border-transparent"
                  >
                </div>
              </div>
              <div v-else class="flex-1">
                <span class="font-['Unbounded'] text-sm text-gray-400 italic">Store closed this day</span>
              </div>
            </div>

            <!-- Custom Message for this day -->
            <div class="pl-0 sm:pl-[120px]">
              <label class="block font-['Unbounded'] text-xs text-gray-600 font-semibold mb-1">
                Custom Message (Optional):
              </label>
              <input 
                type="text" 
                v-model="operatingHours[day].customMessage" 
                placeholder="e.g., Happy Hour 5-7 PM!, Limited menu today, Special: Buy 1 Get 1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg font-['Unbounded'] text-xs focus:ring-2 focus:ring-[#FE601C] focus:border-transparent"
              >
              <p class="mt-1 text-xs text-gray-500 font-['Unbounded']">
                This message will show on the menu page when viewing hours for {{ day }}
              </p>
            </div>
          </div>
        </div>

        <button 
          @click="saveSchedule" 
          :disabled="saving"
          class="w-full mt-6 px-6 py-3 bg-[#1A4189] text-white font-['Unbounded'] font-bold rounded-lg hover:bg-[#15306d] transition disabled:opacity-50"
        >
          {{ saving ? 'Saving...' : 'Save Weekly Schedule' }}
        </button>
      </div>

      <!-- Temporary Closures Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="mb-6">
          <h2 class="font-['Unbounded'] text-2xl text-[#1A4189] mb-2">Temporary Closures</h2>
          <p class="font-['Unbounded'] text-sm text-gray-600">Schedule future closures for holidays, renovations, or special events</p>
        </div>

        <!-- Info box -->
        <div class="mb-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <div>
              <p class="font-['Unbounded'] text-sm text-purple-800 font-semibold mb-1">Temporary Closures</p>
              <p class="font-['Unbounded'] text-xs text-purple-700">
                Schedule closures in advance. Examples: "Closed Feb 15-17 for renovation", "Closed for National Holiday". 
                These take priority over all other settings during the scheduled dates.
              </p>
            </div>
          </div>
        </div>

        <!-- Add New Closure Form -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 class="font-['Unbounded'] text-sm font-bold text-gray-800 mb-4">Add New Temporary Closure</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block font-['Unbounded'] text-xs text-gray-600 font-semibold mb-2">Start Date:</label>
              <input 
                type="date" 
                v-model="newClosure.startDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg font-['Unbounded'] text-sm focus:ring-2 focus:ring-[#FE601C] focus:border-transparent"
              >
            </div>
            <div>
              <label class="block font-['Unbounded'] text-xs text-gray-600 font-semibold mb-2">End Date:</label>
              <input 
                type="date" 
                v-model="newClosure.endDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg font-['Unbounded'] text-sm focus:ring-2 focus:ring-[#FE601C] focus:border-transparent"
              >
            </div>
          </div>
          <div class="mb-4">
            <label class="block font-['Unbounded'] text-xs text-gray-600 font-semibold mb-2">Closure Message:</label>
            <input 
              type="text" 
              v-model="newClosure.message"
              placeholder="e.g., Closed for kitchen renovation, Closed for National Holiday"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg font-['Unbounded'] text-sm focus:ring-2 focus:ring-[#FE601C] focus:border-transparent"
            >
          </div>
          <button 
            @click.prevent="addClosure"
            type="button"
            :disabled="!newClosure.startDate || !newClosure.endDate || saving"
            class="w-full px-4 py-2 bg-purple-600 text-white font-['Unbounded'] font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'Adding...' : 'Add Closure' }}
          </button>
        </div>

        <!-- List of Scheduled Closures -->
        <div v-if="temporaryClosures.length > 0">
          <h3 class="font-['Unbounded'] text-sm font-bold text-gray-800 mb-3">Scheduled Closures</h3>
          <div class="space-y-3">
            <div 
              v-for="closure in sortedClosures" 
              :key="closure._id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4"
              :class="isClosureActive(closure) ? 'border-red-500 bg-red-50' : 'border-gray-300'"
            >
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span 
                    class="px-2 py-1 text-xs font-bold font-['Unbounded'] rounded-full"
                    :class="isClosureActive(closure) ? 'bg-red-200 text-red-800' : isClosurePast(closure) ? 'bg-gray-200 text-gray-600' : 'bg-blue-200 text-blue-800'"
                  >
                    {{ getClosureStatus(closure) }}
                  </span>
                  <span class="text-xs font-semibold font-['Unbounded'] text-gray-600">
                    {{ formatDate(closure.startDate) }} - {{ formatDate(closure.endDate) }}
                  </span>
                </div>
                <p class="text-sm font-['Unbounded'] text-gray-700">{{ closure.message || 'No message' }}</p>
                <p v-if="!isClosurePast(closure)" class="text-xs font-['Unbounded'] text-gray-500 mt-1">
                  {{ getClosureCountdown(closure) }}
                </p>
              </div>
              <button 
                @click="removeClosure(closure._id)"
                :disabled="saving"
                class="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                title="Delete closure"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p class="font-['Unbounded'] text-sm text-gray-500">No temporary closures scheduled</p>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p class="font-['Unbounded'] text-green-800 font-semibold">✓ {{ successMessage }}</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="font-['Unbounded'] text-red-800 font-semibold">✗ {{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: 'admin'
})

const { getStoreSettings, updateStoreSettings, addTemporaryClosure, deleteTemporaryClosure } = useApi()

const loading = ref(true)
const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const operatingHours = ref<any>({
  monday: { isOpen: true, openTime: '08:00', closeTime: '22:00', customMessage: '' },
  tuesday: { isOpen: true, openTime: '08:00', closeTime: '22:00', customMessage: '' },
  wednesday: { isOpen: true, openTime: '08:00', closeTime: '22:00', customMessage: '' },
  thursday: { isOpen: true, openTime: '08:00', closeTime: '22:00', customMessage: '' },
  friday: { isOpen: true, openTime: '08:00', closeTime: '22:00', customMessage: '' },
  saturday: { isOpen: true, openTime: '09:00', closeTime: '23:00', customMessage: '' },
  sunday: { isOpen: true, openTime: '09:00', closeTime: '23:00', customMessage: '' }
})

const manualOverride = ref({
  isActive: false,
  isClosed: false,
  message: ''
})

const temporaryClosures = ref<any[]>([])

const newClosure = ref({
  startDate: '',
  endDate: '',
  message: ''
})

// Computed property for sorted closures (active first, then upcoming, then past)
const sortedClosures = computed(() => {
  return [...temporaryClosures.value].sort((a, b) => {
    const aActive = isClosureActive(a)
    const bActive = isClosureActive(b)
    const aPast = isClosurePast(a)
    const bPast = isClosurePast(b)
    
    if (aActive && !bActive) return -1
    if (!aActive && bActive) return 1
    if (aPast && !bPast) return 1
    if (!aPast && bPast) return -1
    
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })
})

const loadSettings = async () => {
  try {
    loading.value = true
    const response = await getStoreSettings()
    const settings = response.data.data
    
    console.log('[loadSettings] Full response:', response.data)
    console.log('[loadSettings] Settings:', settings)
    console.log('[loadSettings] Temporary closures:', settings.temporaryClosures)

    if (settings.operatingHours) {
      operatingHours.value = settings.operatingHours
    }

    if (settings.manualOverride) {
      manualOverride.value = settings.manualOverride
    }

    if (settings.temporaryClosures) {
      temporaryClosures.value = settings.temporaryClosures
      console.log('[loadSettings] Set temporaryClosures.value to:', temporaryClosures.value)
      temporaryClosures.value.forEach((closure, index) => {
        console.log(`[loadSettings] Closure ${index}:`, {
          id: closure._id,
          startDate: closure.startDate,
          endDate: closure.endDate,
          message: closure.message
        })
      })
    }
  } catch (error) {
    console.error('Failed to load store settings:', error)
    errorMessage.value = 'Failed to load settings. Please try again.'
  } finally {
    loading.value = false
  }
}

const saveSchedule = async () => {
  try {
    saving.value = true
    errorMessage.value = ''
    successMessage.value = ''

    await updateStoreSettings({
      operatingHours: operatingHours.value
    })

    successMessage.value = 'Weekly schedule saved successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Failed to save schedule:', error)
    errorMessage.value = 'Failed to save schedule. Please try again.'
  } finally {
    saving.value = false
  }
}

const saveManualOverride = async () => {
  try {
    saving.value = true
    errorMessage.value = ''
    successMessage.value = ''

    await updateStoreSettings({
      manualOverride: manualOverride.value
    })

    successMessage.value = 'Manual override settings saved successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Failed to save manual override:', error)
    errorMessage.value = 'Failed to save manual override. Please try again.'
  } finally {
    saving.value = false
  }
}

const handleOverrideChange = async () => {
  // Save immediately on any toggle
  await saveManualOverride()
  
  // Add specific message for disabling override
  if (!manualOverride.value.isActive) {
    successMessage.value = 'Manual override disabled! Store now follows scheduled hours. Refresh menu page to see changes.'
  }
}

const setOverrideStatus = async (isClosed: boolean) => {
  manualOverride.value.isClosed = isClosed
  // Auto-save when changing status
  await saveManualOverride()
  
  // Update success message
  const status = isClosed ? 'CLOSED' : 'OPEN'
  successMessage.value = `Store manually set to ${status}! Refresh menu page to see changes.`
  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const getCurrentDaySchedule = () => {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
  const today = new Date().getDay()
  const currentDay = dayNames[today]
  return operatingHours.value[currentDay as string]
}

const copyToAllDays = () => {
  const mondaySchedule = operatingHours.value.monday
  daysOfWeek.forEach(day => {
    operatingHours.value[day] = { ...mondaySchedule }
  })
}

const addClosure = async (event?: Event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  try {
    console.log('addClosure called', newClosure.value)
    
    if (!newClosure.value.startDate || !newClosure.value.endDate) {
      errorMessage.value = 'Please provide both start and end dates'
      console.log('Validation failed: missing dates')
      return
    }

    const start = new Date(newClosure.value.startDate)
    const end = new Date(newClosure.value.endDate)

    if (end < start) {
      errorMessage.value = 'End date must be after start date'
      console.log('Validation failed: end before start')
      return
    }

    saving.value = true
    errorMessage.value = ''
    successMessage.value = ''

    console.log('Calling API with:', {
      startDate: newClosure.value.startDate,
      endDate: newClosure.value.endDate,
      message: newClosure.value.message
    })

    const response = await addTemporaryClosure({
      startDate: newClosure.value.startDate,
      endDate: newClosure.value.endDate,
      message: newClosure.value.message
    })

    console.log('API response:', response)

    // Reset form
    newClosure.value = {
      startDate: '',
      endDate: '',
      message: ''
    }

    // Reload settings to get updated closures list
    await loadSettings()

    successMessage.value = 'Temporary closure added successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error: any) {
    console.error('Failed to add temporary closure:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    
    if (error.response?.status === 401) {
      errorMessage.value = 'Authentication failed. Please login again.'
      setTimeout(() => {
        navigateTo('/admin/login')
      }, 2000)
    } else {
      errorMessage.value = `Failed to add temporary closure: ${error.response?.data?.message || error.message || 'Please try again.'}`
    }
  } finally {
    saving.value = false
  }
}

const removeClosure = async (id: string) => {
  console.log('[removeClosure] Attempting to delete closure ID:', id)
  
  if (!confirm('Are you sure you want to delete this temporary closure?')) {
    console.log('[removeClosure] User cancelled deletion')
    return
  }

  try {
    saving.value = true
    errorMessage.value = ''
    successMessage.value = ''

    console.log('[removeClosure] Calling API to delete:', id)
    const response = await deleteTemporaryClosure(id)
    console.log('[removeClosure] API response:', response)

    // Reload settings
    await loadSettings()

    successMessage.value = 'Temporary closure deleted successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error: any) {
    console.error('Failed to delete temporary closure:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    errorMessage.value = 'Failed to delete temporary closure. Please try again.'
  } finally {
    saving.value = false
  }
}

const isClosureActive = (closure: any) => {
  const now = new Date()
  const start = new Date(closure.startDate)
  const end = new Date(closure.endDate)
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)
  return now >= start && now <= end
}

const isClosurePast = (closure: any) => {
  const now = new Date()
  const end = new Date(closure.endDate)
  end.setHours(23, 59, 59, 999)
  return now > end
}

const getClosureStatus = (closure: any) => {
  if (isClosureActive(closure)) return 'ACTIVE NOW'
  if (isClosurePast(closure)) return 'PAST'
  return 'UPCOMING'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getClosureCountdown = (closure: any) => {
  const now = new Date()
  const start = new Date(closure.startDate)
  const end = new Date(closure.endDate)
  
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)
  
  if (isClosureActive(closure)) {
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysLeft === 1 ? 'Reopening tomorrow' : `Reopening in ${daysLeft} days`
  } else {
    const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil === 1 ? 'Starts tomorrow' : `Starts in ${daysUntil} days`
  }
}

onMounted(() => {
  loadSettings()
})
</script>
