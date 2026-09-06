<template>
  <div
    class="flex-shrink-0 bg-[#FBF4E5] border-t border-gray-200 px-3 sm:px-5 py-3 flex items-center gap-2 sm:gap-3 footer-safe-area"
  >
    <!-- Quantity selector (desktop only; on mobile it sits above the footer) -->
    <div class="hidden md:flex items-center bg-white rounded-full border border-gray-200 overflow-hidden shadow-sm flex-shrink-0">
      <button
        @click="$emit('update:quantity', Math.max(1, quantity - 1))"
        class="w-9 sm:w-10 h-11 sm:h-12 flex items-center justify-center text-[#FE601C] font-bold text-lg hover:bg-gray-50 transition-colors"
        aria-label="Decrease quantity"
      >
        &#x2212;
      </button>
      <span
        class="w-6 sm:w-8 text-center font-bold text-gray-800 text-sm select-none"
        style="font-family: 'Unbounded', sans-serif;"
      >
        {{ quantity }}
      </span>
      <button
        @click="$emit('update:quantity', quantity + 1)"
        class="w-9 sm:w-10 h-11 sm:h-12 flex items-center justify-center text-[#FE601C] font-bold text-lg hover:bg-gray-50 transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>

    <!-- Add to Cart button -->
    <button
      @click="$emit('add-to-cart')"
      :disabled="isDisabled"
      :class="[
        'flex-1 min-w-0 h-12 rounded-full font-bold text-sm sm:text-base text-white transition-all duration-200 flex items-center justify-center md:justify-between gap-2 px-4 sm:px-5',
        isDisabled
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-[#FE601C] hover:bg-[#e5551a] shadow-lg active:scale-95',
      ]"
      style="font-family: 'Unbounded', sans-serif;"
    >
      <span class="whitespace-nowrap truncate">{{ storeClosed ? 'Store Closed' : (actionLabel || 'Add to Cart') }}</span>
      <span class="font-bold whitespace-nowrap">&#x20B1;{{ Number(total).toFixed(2) }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  quantity: number
  total: number
  isDisabled: boolean
  storeClosed?: boolean
  actionLabel?: string
}>()

defineEmits<{
  'update:quantity': [value: number]
  'add-to-cart': []
}>()
</script>

<style scoped>
.footer-safe-area {
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}
</style>
