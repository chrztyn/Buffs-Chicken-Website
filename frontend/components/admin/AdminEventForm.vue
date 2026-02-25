<template>
  <div class="modal-overlay fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="modal-content bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 class="font-['Caprasimo'] text-2xl text-[#1A4189]">
          {{ isEditMode ? 'Edit Event' : 'Add Event' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="p-6 space-y-5">
        <!-- Event Name -->
        <div>
          <label class="block font-['Unbounded'] font-semibold text-gray-700 mb-2">
            Event Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.name"
            type="text"
            required
            placeholder="e.g., Pop-up Market"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] font-['Unbounded']"
          />
        </div>

        <!-- Date Range -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-['Unbounded'] font-semibold text-gray-700 mb-2">
              Start Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.date_start"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] font-['Unbounded']"
            />
          </div>

          <div>
            <label class="block font-['Unbounded'] font-semibold text-gray-700 mb-2">
              End Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.date_end"
              type="date"
              required
              :min="formData.date_start"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] font-['Unbounded']"
            />
          </div>
        </div>

        <!-- Time -->
        <div>
          <label class="block font-['Unbounded'] font-semibold text-gray-700 mb-2">
            Time <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.time"
            type="text"
            required
            placeholder="e.g., 10:00 AM - 6:00 PM"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] font-['Unbounded']"
          />
        </div>

        <!-- Location -->
        <div>
          <label class="block font-['Unbounded'] font-semibold text-gray-700 mb-2">
            Location <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.location"
            type="text"
            required
            placeholder="e.g., BGC, Taguig"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] font-['Unbounded']"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block font-['Unbounded'] font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="formData.description"
            rows="3"
            placeholder="Additional details about the event..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] font-['Unbounded'] resize-none"
          ></textarea>
        </div>

        <!-- Logo Upload -->
        <div>
          <label class="block font-['Unbounded'] font-semibold text-gray-700 mb-2">
            Event Logo <span v-if="!isEditMode" class="text-red-500">*</span>
          </label>
          
          <!-- Current Logo Preview (Edit Mode) -->
          <div v-if="isEditMode && currentLogoUrl" class="mb-3">
            <p class="text-sm text-gray-600 mb-2 font-['Unbounded']">Current Logo:</p>
            <div class="w-32 h-32 bg-white rounded-lg border-2 border-gray-200 shadow-md p-2 flex items-center justify-center">
              <img
                :src="currentLogoUrl"
                alt="Current logo"
                class="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            :required="!isEditMode"
            @change="handleFileChange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] font-['Unbounded']"
          />
          <p class="text-xs text-gray-500 mt-1 font-['Unbounded']">
            Upload an image file (max 5MB). Recommended: square images.
          </p>

          <!-- New Logo Preview -->
          <div v-if="previewUrl" class="mt-3">
            <p class="text-sm text-gray-600 mb-2 font-['Unbounded']">New Logo Preview:</p>
            <div class="w-32 h-32 bg-white rounded-lg border-2 border-[#FE601C] shadow-md p-2 flex items-center justify-center">
              <img
                :src="previewUrl"
                alt="Logo preview"
                class="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-6 py-2 bg-gray-200 text-gray-700 font-['Unbounded'] font-bold rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 px-6 py-2 bg-[#FE601C] text-white font-['Unbounded'] font-bold rounded-lg hover:bg-[#e5551a] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Saving...' : (isEditMode ? 'Update Event' : 'Add Event') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useApi } from '../../composables/useApi'

interface EventData {
  _id?: string
  name: string
  date_start: string
  date_end: string
  time: string
  location: string
  logo_url: string
  description?: string
}

const props = defineProps<{
  event?: EventData | null
}>()

const emit = defineEmits(['close', 'saved'])

const { createEvent, updateEvent } = useApi()
const config = useRuntimeConfig()

const isEditMode = computed(() => !!props.event)

const formData = ref({
  name: '',
  date_start: '',
  date_end: '',
  time: '',
  location: '',
  description: ''
})

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref('')
const submitting = ref(false)

const currentLogoUrl = computed(() => {
  if (!isEditMode.value || !props.event?.logo_url) return ''
  
  const logoUrl = props.event.logo_url
  if (logoUrl.startsWith('http')) {
    return logoUrl
  }
  // Static files are served from root, not /api/
  return `${config.public.socketUrl}${logoUrl}`
})

// Initialize form data when editing
watch(() => props.event, (newEvent) => {
  if (newEvent) {
    formData.value = {
      name: newEvent.name,
      date_start: newEvent.date_start?.split('T')[0] || '',
      date_end: newEvent.date_end?.split('T')[0] || '',
      time: newEvent.time,
      location: newEvent.location,
      description: newEvent.description || ''
    }
  }
}, { immediate: true })

const handleFileChange = (event: any) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      if (fileInput.value) fileInput.value.value = ''
      return
    }

    selectedFile.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const submitForm = async () => {
  submitting.value = true
  
  try {
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.value.name)
    formDataToSend.append('date_start', formData.value.date_start)
    formDataToSend.append('date_end', formData.value.date_end)
    formDataToSend.append('time', formData.value.time)
    formDataToSend.append('location', formData.value.location)
    formDataToSend.append('description', formData.value.description)
    
    if (selectedFile.value) {
      formDataToSend.append('logo', selectedFile.value)
    }

    if (isEditMode.value && props.event?._id) {
      await updateEvent(props.event._id, formDataToSend)
    } else {
      await createEvent(formDataToSend)
    }

    emit('saved')
  } catch (error: any) {
    console.error('Error saving event:', error)
    alert(error.response?.data?.message || 'Failed to save event. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  animation: slideUp 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
