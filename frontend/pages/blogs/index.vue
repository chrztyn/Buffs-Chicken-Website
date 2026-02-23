<template>
    <div class="min-h-screen bg-[#FBF4E5] overflow-x-hidden max-w-[100vw]">
        <!-- Navigation Bar -->
        <Navbar class="relative z-20" />

        <!-- Top Section -->
        <div class="blogs-hero-section relative bg-[#1A4189] overflow-hidden">
            <div class="relative z-10 min-h-[35vh] flex items-center">
                <div class="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div class="max-w-6xl mx-auto">
                        <div class="grid lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                            <!-- Left: Text content -->
                            <div class="hero-content">
                                <!-- Super bold title -->
                                <div class="mb-3">
                                    <div class="hero-badge inline-block px-2 py-0.5 bg-[#FEB90E] text-[#1A4189] font-['Unbounded'] font-black text-[9px] uppercase tracking-widest mb-2 transform -rotate-2">
                                        Blog Posts
                                    </div>
                                    <h1 class="font-['Unbounded'] font-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl leading-[0.85] text-white mb-0">
                                        <span class="hero-title-line-1 inline-block">FRESH</span><br/>
                                        <span class="hero-title-line-2 inline-block text-[#FEB90E]">OFF THE</span><br/>
                                        <span class="hero-title-line-3 inline-block">FRYER</span>
                                    </h1>
                                </div>
                                
                                <div class="hero-line w-full h-1 bg-[#FEB90E] mb-3"></div>
                                
                                <p class="hero-description text-white/90 text-sm sm:text-base font-medium leading-relaxed mb-0">
                                    Bringing you fresh insights, stories, and updates from the Buffs team.
                                </p>
                                
                            </div>
                            
                            <!-- Right: Graphic element - Magazine style -->
                            <div class="hero-magazine hidden lg:block relative">
                                <div class="magazine-shadow absolute inset-0 bg-[#FEB90E] transform rotate-6 opacity-20"></div>
                                <div class="magazine-card relative bg-white/5 backdrop-blur-sm border-[3px] border-[#FEB90E] p-6 transform -rotate-3">
                                    <div class="space-y-2.5">
                                        <div class="magazine-line-1 h-2.5 bg-white/30 w-3/4"></div>
                                        <div class="magazine-line-2 h-2.5 bg-white/30 w-full"></div>
                                        <div class="magazine-line-3 h-2.5 bg-white/30 w-2/3"></div>
                                        <div class="magazine-box h-14 bg-[#FEB90E]/30 mt-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Background pattern -->
            <div class="absolute inset-0 opacity-5">
                <div class="absolute top-0 left-0 w-full h-full" style="background-image: repeating-linear-gradient(45deg, #FEB90E 0, #FEB90E 2px, transparent 2px, transparent 20px);"></div>
            </div>
        </div>

        <!-- Search Section -->
        <div class="blogs-search max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-14 md:-mt-16 relative z-20 mb-12 sm:mb-14 md:mb-16">
            <div class="flex gap-2 sm:gap-3 items-center w-full">
                <div class="relative flex-1 min-w-0">
                    <input 
                        v-model="searchQuery"
                        @keyup.enter="handleSearch"
                        type="text" 
                        placeholder="Search blog posts..." 
                        class="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1A4189] focus:ring-2 focus:ring-[#1A4189]/20 transition-all shadow-sm hover:shadow-md text-xs sm:text-sm"
                    />
                    <button
                        v-if="searchQuery"
                        type="button"
                        @click.prevent="clearSearch"
                        class="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Clear search"
                    >
                        <svg class="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <svg 
                        v-else
                        class="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>
        </div>

    <!-- Blog Posts Section -->
    <div class="relative">
        <Blog :current-page="currentPage" :items-per-page="5" :search-query="activeSearchQuery" @update-total="updateTotalBlogs" />
        
        <!-- Navigation Buttons -->
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
            <div class="flex justify-center md:justify-end items-center gap-2 sm:gap-3 md:gap-4">
                <!-- Previous Button -->
                <button 
                    @click="handlePrevious"
                    :disabled="currentPage === 1"
                    :class="[
                        'w-11 sm:w-12 h-11 sm:h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center group flex-shrink-0',
                        currentPage === 1 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-white hover:bg-gray-50 text-[#1A4189] hover:shadow-xl active:scale-95'
                    ]"
                    aria-label="Previous page"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" :class="['h-5 sm:h-6 w-5 sm:w-6 transition-transform duration-200', currentPage !== 1 && 'group-hover:-translate-x-0.5']" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </button>

                <!-- Next Button -->
                <button 
                    @click="handleNext"
                    :disabled="currentPage === totalPages"
                    :class="[
                        'w-11 sm:w-12 h-11 sm:h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center group flex-shrink-0',
                        currentPage === totalPages 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-white hover:bg-gray-50 text-[#1A4189] hover:shadow-xl active:scale-95'
                    ]"
                    aria-label="Next page"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" :class="['h-5 sm:h-6 w-5 sm:w-6 transition-transform duration-200', currentPage !== totalPages && 'group-hover:translate-x-0.5']" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Footer Section -->
    <Footer />
    
    </div>
</template>


<script setup>
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'
import Blog from '~/components/Blog.vue'
import { ref, computed } from 'vue'

const currentPage = ref(1)
const totalBlogs = ref(0)
const itemsPerPage = 5
const searchQuery = ref('')
const activeSearchQuery = ref('')

const totalPages = computed(() => {
  return Math.ceil(totalBlogs.value / itemsPerPage)
})

// SEO Meta Tags
useHead({
  title: 'Blog - Buffs Chicken | Behind The Scenes, Stories & Updates',
  meta: [
    {
      name: 'description',
      content: 'Discover stories, tips, and updates from the Buffs Chicken team. Learn about our journey, special offers, and what\'s new in our kitchen.'
    },
    {
      name: 'keywords',
      content: 'blog, Buffs Chicken, restaurant news, food stories, Angeles City, updates'
    },
    { property: 'og:title', content: 'Blog - Buffs Chicken' },
    { property: 'og:description', content: 'Stories, tips, and updates from the Buffs Chicken team' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.buffschicken.com/blogs' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.buffschicken.com/blogs' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        'name': 'Buffs Chicken Blog',
        'description': 'Stories, tips, and updates from the Buffs Chicken team in the Philippines',
        'url': 'https://www.buffschicken.com/blogs',
        'publisher': {
          '@type': 'Organization',
          'name': 'Buffs Chicken',
          'url': 'https://www.buffschicken.com',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://www.buffschicken.com/buffs-logo.webp'
          }
        },
        'inLanguage': 'en-PH'
      }, null, 2)
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://www.buffschicken.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Blogs',
            'item': 'https://www.buffschicken.com/blogs'
          }
        ]
      }, null, 2)
    }
  ]
})

const handleSearch = () => {
    activeSearchQuery.value = searchQuery.value
    currentPage.value = 1 // Reset to first page on search
}

const clearSearch = () => {
    searchQuery.value = ''
    activeSearchQuery.value = ''
    currentPage.value = 1
}

const handleNext = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
        console.log('Next page:', currentPage.value)
    }
}

const handlePrevious = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        console.log('Previous page:', currentPage.value)
    }
}

const updateTotalBlogs = (total) => {
  totalBlogs.value = total
}

</script>

<style scoped>
/* Keep only the global overflow fixes that can't be done with Tailwind */
html,
body,
#__nuxt {
    overflow-x: hidden !important;
    max-width: 100vw !important;
}

/* Hero Section Animations */
.hero-content {
    animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-badge {
    animation: slideDown 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s backwards;
}

.hero-title-line-1 {
    animation: slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s backwards;
}

.hero-title-line-2 {
    animation: slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) 0.45s backwards;
}

.hero-title-line-3 {
    animation: slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s backwards;
}

.hero-line {
    animation: expandWidth 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.8s backwards;
}

.hero-description {
    animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 1s backwards;
}

.hero-magazine {
    animation: floatIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s backwards;
}

.magazine-line-1 {
    animation: lineExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s backwards;
}

.magazine-line-2 {
    animation: lineExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.2s backwards;
}

.magazine-line-3 {
    animation: lineExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.3s backwards;
}

.magazine-box {
    animation: boxGrow 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1.4s backwards;
}

/* Smooth Keyframe Animations with Easing */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px) rotate(-2deg);
    }
    to {
        opacity: 1;
        transform: translateY(0) rotate(-2deg);
    }
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-40px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes expandWidth {
    from {
        width: 0;
        opacity: 0;
    }
    to {
        width: 100%;
        opacity: 1;
    }
}

@keyframes floatIn {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.92);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes shadowGrow {
    from {
        opacity: 0;
        transform: rotate(6deg) scale(0.9);
    }
    to {
        opacity: 0.2;
        transform: rotate(6deg) scale(1);
    }
}

@keyframes cardFloat {
    from {
        opacity: 0;
        transform: translateY(25px) rotate(-3deg) scale(0.94);
    }
    to {
        opacity: 1;
        transform: translateY(0) rotate(-3deg) scale(1);
    }
}

@keyframes lineExpand {
    from {
        width: 0;
        opacity: 0;
    }
    to {
        width: var(--line-width, 100%);
        opacity: 0.3;
    }
}

@keyframes boxGrow {
    from {
        height: 0;
        opacity: 0;
    }
    to {
        height: 3.5rem;
        opacity: 0.3;
    }
}

@keyframes gentleFloat {
    0%, 100% {
        transform: translateY(0) rotate(-3deg);
    }
    50% {
        transform: translateY(-8px) rotate(-3deg);
    }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
    .hero-content,
    .hero-badge,
    .hero-title-line-1,
    .hero-title-line-2,
    .hero-title-line-3,
    .hero-line,
    .hero-description,
    .hero-magazine,
    .magazine-shadow,
    .magazine-card,
    .magazine-line-1,
    .magazine-line-2,
    .magazine-line-3,
    .magazine-box {
        animation: none;
        opacity: 1;
        transform: none;
    }
}
</style>