<template>
  <div
    @click="$emit('click')"
    class="blog-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 flex flex-col h-full"
    :class="{ 'animate-fade-in-up': !disableAnimation }"
  >
    <!-- Image Container with Overlay -->
    <div class="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      <NuxtImg
        v-if="blog.image"
        :src="blog.image"
        :alt="blog.title"
        width="640"
        height="400"
        sizes="sm:100vw md:50vw lg:33vw"
        format="webp"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        loading="lazy"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-[#1A4189] via-[#2B5B9E] to-[#FE601C] flex items-center justify-center">
        <svg class="w-16 h-16 sm:w-20 sm:h-20 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
        </svg>
      </div>

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <!-- Date Badge -->
      <div class="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
        <span class="text-xs font-semibold text-[#1A4189] font-['Unbounded']">
          {{ formatDateBadge(blog.publishedAt || blog.createdAt) }}
        </span>
      </div>
    </div>

    <!-- Content Container -->
    <div class="p-5 sm:p-6 flex flex-col flex-grow">
      <!-- Title -->
      <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#FE601C] transition-colors duration-300 font-['Unbounded'] leading-tight">
        {{ blog.title }}
      </h3>

      <!-- Excerpt -->
      <p class="text-sm sm:text-base text-gray-600 line-clamp-3 mb-4 flex-grow font-['Unbounded'] leading-relaxed">
        {{ blog.excerpt || blog.metaDescription || 'Read more about this story...' }}
      </p>

      <!-- Footer with Metadata -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-['Unbounded']">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ readTime }} min read</span>
        </div>

        <!-- Read More Arrow -->
        <div class="flex items-center gap-1 text-[#FE601C] font-semibold text-sm group-hover:gap-2 transition-all duration-300 font-['Unbounded']">
          <span class="hidden sm:inline">Read More</span>
          <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Blog {
  _id: string
  title: string
  excerpt?: string
  metaDescription?: string
  image?: string
  content?: string
  description?: string
  createdAt: string
  publishedAt?: string
  slug: string
}

interface Props {
  blog: Blog
  disableAnimation?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disableAnimation: false
})

defineEmits(['click'])

// Calculate read time (average 200 words per minute)
const readTime = computed(() => {
  const content = (props.blog.content || '') + (props.blog.description || '')
  const wordCount = content.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 200))
})

// Format date for badge
const formatDateBadge = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Stagger animation for multiple cards */
.blog-card:nth-child(1) { animation-delay: 0.1s; }
.blog-card:nth-child(2) { animation-delay: 0.2s; }
.blog-card:nth-child(3) { animation-delay: 0.3s; }
.blog-card:nth-child(4) { animation-delay: 0.4s; }
</style>
