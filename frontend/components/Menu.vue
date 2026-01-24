<template>
  <div class="menu-card bg-white rounded-3xl h-50 overflow-hidden shadow-lg hover:shadow-xl transition max-w-sm">
    <!-- Image Placeholder -->
    <div class="bg-blue-500 flex items-center justify-center rounded-t-3xl overflow-hidden">
      <img
        :src="imgSrc"
        :alt="title"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Card Content -->
    <div class="p-6">
      <h3 class="text-xl font-semibold text-[#1A4189] mb-2">{{ title }}</h3>
      <p class="text-2xl font-bold text-gray-800">{{ price }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Buffs Burger'
  },
  price: {
    type: String,
    default: '₱150'
  },
  imgSrc: {
    type: String,
    default: '/burger-placeholder.jpg'
  }
})
</script>

<style scoped>
/* keep styles tailwind-first; add small fallback */
.rounded-t-3xl { border-top-left-radius: 1rem; border-top-right-radius: 1rem; }
</style>
