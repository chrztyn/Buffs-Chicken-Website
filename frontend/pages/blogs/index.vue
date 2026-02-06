<template>
    <div class="min-h-screen bg-[#FBF4E5] overflow-x-hidden max-w-[100vw]">
        <!-- Navigation Bar -->
        <Navbar class="relative z-20" />

        <!-- Blogs Top Section -->
        <div class="blogs-hero-section relative h-96 sm:h-[450px] md:h-[500px] lg:h-[550px] w-full overflow-hidden -mt-16">
        
            <!-- Background Image with Blur -->
            <img
                src="/blogs-top-photo.jpg"
                alt="Blog Top Photo"
                class="absolute inset-0 w-full h-full object-cover filter blur-sm scale-105"
            />

            <!-- Overlay -->
            <div class="about-overlay absolute inset-0 bg-[rgba(26,65,137,0.3)]"></div>

            <!-- Content -->
            <div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8">
                <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-5xl font-['Unbounded'] text-white mb-3 sm:mb-4 drop-shadow-lg leading-tight">
                Fresh Off the Fryer
                </h1>
                <p class="text-white text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl drop-shadow-md px-2 sm:px-0">
                Bringing you fresh insights, stories, and updates from the Buffs team.
                </p>
            </div>
        </div>

        <!-- Search and Topics Section -->
        <div class="blogs-search max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-14 md:-mt-16 relative z-20 mb-12 sm:mb-14 md:mb-16">
            <div class="flex flex-col gap-4 sm:gap-6 md:gap-8">
                <!-- Search Bar -->
                <div class="h-12 sm:h-13 md:h-14 bg-white rounded-full shadow-lg sm:shadow-xl px-0 sm:px-0 md:px-0 flex items-center gap-1 sm:gap-2 w-full">
                    <button class="h-full bg-[#1A4189] hover:bg-blue-700 active:scale-95 text-white font-['Unbounded'] font-semibold px-4 sm:px-5 md:px-7 rounded-full transition-all duration-200 hover:shadow-md text-xs sm:text-sm md:text-base flex items-center justify-center flex-shrink-0">
                        Search
                    </button>
                    <input 
                        type="text" 
                        placeholder="Search blog posts..."
                        class="flex-1 outline-none text-gray-700 placeholder-gray-400 text-xs sm:text-sm md:text-base bg-white h-full pr-4 sm:pr-5 rounded-full"
                    />
                </div>

                <!-- Explore Topics -->
                <div class="blogs-explore flex flex-col gap-3 sm:gap-4">
                    <span class="text-gray-800 text-xs sm:text-sm md:text-base font-['Unbounded'] font-semibold">Explore topics</span>
                    <div class="flex flex-wrap gap-2 sm:gap-3">
                        <button class="blogs-button bg-[#FEB90E] hover:bg-yellow-500 active:scale-95 text-gray-900 font-['Unbounded'] font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full transition-all duration-200 hover:shadow-md text-xs sm:text-sm md:text-base">
                            Chicken
                        </button>
                        <button class="blogs-button bg-[#FEB90E] hover:bg-yellow-500 active:scale-95 text-gray-900 font-['Unbounded'] font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full transition-all duration-200 hover:shadow-md text-xs sm:text-sm md:text-base">
                            Pop-up
                        </button>
                        <button class="blogs-button bg-[#FEB90E] hover:bg-yellow-500 active:scale-95 text-gray-900 font-['Unbounded'] font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full transition-all duration-200 hover:shadow-md text-xs sm:text-sm md:text-base">
                            Angeles
                        </button>
                    </div>
                </div>
            </div>
        </div>

    <!-- Blog Posts Section -->
    <div class="relative">
        <Blog />
        
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
import { ref } from 'vue'

const currentPage = ref(1)
const totalPages = ref(5) // Update this based on your actual total pages

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
</script>

<style scoped>
/* Keep only the global overflow fixes that can't be done with Tailwind */
html,
body,
#__nuxt {
    overflow-x: hidden !important;
    max-width: 100vw !important;
}
</style>
