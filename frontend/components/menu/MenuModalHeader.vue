<template>
  <div>
    <!-- Product image (tap to open full-screen viewer) -->
    <div class="relative w-full h-48 sm:h-56 md:h-64 bg-white flex-shrink-0 overflow-hidden">
      <img
        :src="item.image"
        :alt="item.name"
        class="w-full h-full object-cover cursor-zoom-in"
        @click="lightboxOpen = true"
      />
      <button
        type="button"
        class="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-['Unbounded'] text-white backdrop-blur-sm transition hover:bg-black/60"
        aria-label="View larger image"
        @click="lightboxOpen = true"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M11 8v6M8 11h6M18 11a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Zoom
      </button>
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

    <ImageLightbox
      :src="item.image"
      :alt="item.name"
      :open="lightboxOpen"
      @close="lightboxOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImageLightbox from '~/components/ImageLightbox.vue'
import type { Product } from '~/composables/useMenuModal'

defineProps<{
  item: Product
}>()

const lightboxOpen = ref(false)
</script>
