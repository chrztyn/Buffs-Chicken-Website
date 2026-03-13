<template>
  <div>
    <!-- Product image -->
    <div class="w-full h-48 sm:h-56 md:h-64 bg-white flex-shrink-0 overflow-hidden">
      <img
        :src="item.image"
        :alt="item.name"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Product info -->
    <div class="px-4 sm:px-5 pt-4 pb-3">
      <h1
        class="text-lg sm:text-xl font-bold text-[#1A4189] leading-tight mb-1"
        style="font-family: 'Unbounded', sans-serif;"
      >
        {{ item.name }}
      </h1>
      <p
        class="text-sm text-gray-500 leading-relaxed"
        style="font-family: 'Unbounded', sans-serif;"
      >
        {{ item.description }}
      </p>
      <p
        class="mt-2 text-[#FE601C] font-bold text-xl"
        style="font-family: 'Unbounded', sans-serif;"
      >
        &#x20B1;{{ Number(item.price).toFixed(2) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useMenuModal'

defineProps<{
  item: Product
}>()
</script>
