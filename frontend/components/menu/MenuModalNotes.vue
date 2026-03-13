<template>
  <div class="px-4 sm:px-5 pt-4 pb-5">
    <label
      class="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest"
      style="font-family: 'Unbounded', sans-serif;"
    >
      Special Instructions
    </label>
    <textarea
      :value="notes"
      @input="$emit('update:notes', ($event.target as HTMLTextAreaElement).value)"
      placeholder="Any special instructions? (optional)"
      maxlength="200"
      class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white resize-none focus:outline-none focus:border-[#FE601C] transition-colors"
      style="font-family: 'Unbounded', sans-serif;"
      rows="2"
    ></textarea>
    <p
      class="text-right text-xs text-gray-400 mt-1"
      style="font-family: 'Unbounded', sans-serif;"
    >
      {{ notes.length }}/200
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  notes: string
}>()

defineEmits<{
  'update:notes': [value: string]
}>()
</script>
