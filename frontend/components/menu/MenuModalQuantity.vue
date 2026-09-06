<template>
  <div class="flex items-center justify-center gap-4 px-4 sm:px-5 py-4">
    <button
      @click="$emit('update:quantity', Math.max(1, quantity - 1))"
      class="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 bg-white text-[#FE601C] font-bold text-xl hover:bg-gray-50 transition-colors disabled:opacity-40"
      :disabled="quantity <= 1"
      aria-label="Decrease quantity"
    >
      &#x2212;
    </button>
    <span
      class="w-10 text-center font-bold text-gray-800 text-lg select-none"
      style="font-family: 'Unbounded', sans-serif;"
    >
      {{ quantity }}
    </span>
    <button
      @click="$emit('update:quantity', quantity + 1)"
      class="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 bg-white text-[#FE601C] font-bold text-xl hover:bg-gray-50 transition-colors"
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  quantity: number
}>()

defineEmits<{
  'update:quantity': [value: number]
}>()
</script>
