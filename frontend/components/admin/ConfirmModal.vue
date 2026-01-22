<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div class="p-6">
          <h2 class="text-2xl font-['Caprasimo'] text-[#1A4189] mb-2">{{ title }}</h2>
          <p class="text-gray-600 mb-6">{{ message }}</p>
          <div class="flex gap-3 justify-end">
            <button
              @click="cancel"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {{ cancelText }}
            </button>
            <button
              @click="confirm"
              class="px-4 py-2 bg-[#FE601C] text-white rounded-lg hover:bg-[#e5551a] transition"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirm'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => emit('confirm')
const cancel = () => emit('cancel')
</script>
