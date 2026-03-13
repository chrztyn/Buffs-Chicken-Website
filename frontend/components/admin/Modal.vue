<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-lg max-w-2xl w-full shadow-xl my-8">
        <div class="sticky top-0 bg-white border-b p-6 flex justify-between items-center rounded-t-lg">
          <h2 class="text-2xl font-['Caprasimo'] text-[#1A4189]">{{ title }}</h2>
          <button
            @click="close"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <slot />
        </div>
        <div v-if="showFooter" class="border-t p-6 flex gap-3 justify-end">
          <button
            @click="close"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            v-if="showSubmit"
            @click="submit"
            :disabled="submitDisabled"
            :class="[
              'px-4 py-2 rounded-lg transition font-[\'Unbounded\'] font-bold',
              submitDisabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#FE601C] text-white hover:bg-[#e5551a]'
            ]"
          >
            {{ submitText }}
          </button>
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
    required: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showSubmit: {
    type: Boolean,
    default: true
  },
  submitText: {
    type: String,
    default: 'Save'
  },
  submitDisabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const close = () => emit('close')
const submit = () => emit('submit')
</script>
