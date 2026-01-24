<template>
    <div class="min-h-screen bg-[#FBF4E5] overflow-x-hidden max-w-[100vw]">
        <!-- Navigation Bar -->
        <Navbar class="relative z-20" />

        <!-- Blogs Top Section -->
        <div class="blogs-hero-section relative h-[500px] md:h-[550px] w-full overflow-hidden -mt-16">
        
            <!-- Background Image with Blur -->
            <img
                src="/blogs-top-photo.jpg"
                alt="Blog Top Photo"
                class="absolute inset-0 w-full h-full object-cover filter blur-sm scale-105"
            />

            <!-- Overlay -->
            <div class="about-overlay absolute inset-0 bg-[rgba(26,65,137,0.3)]"></div>

            <!-- Content -->
            <div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-6">
                <h1 class="text-6xl md:text-7xl font-['Caprasimo'] text-white mb-4 drop-shadow-lg">
                Fresh Off the Fryer
                </h1>
                <p class="text-white text-lg md:text-xl max-w-2xl drop-shadow-md">
                Bringing you fresh insights, stories, and updates from the Buffs team.
                </p>
            </div>
        </div>

        <!-- Search and Topics Section -->
        <div class="blogs-search max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 mb-16">
            <div class="flex flex-col lg:flex-row items-start lg:items-left gap-6 md:gap-8">
                <!-- Search Bar -->
                <div class="h-12 md:h-14 bg-white rounded-full shadow-xl px-4 py-3 flex items-left gap-3 flex-1 w-full">
                    <button class="w-30 h-12 md:h-14 bg-[#1A4189] hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:shadow-md flex-shrink-0 text-sm md:text-base">
                        Search
                    </button>
                    <input 
                        type="text" 
                        placeholder="Search for blog posts..."
                        class="flex-1 outline-none text-gray-700 placeholder-gray-400 text-xs md:text-sm px-2"
                    />
                </div>

        <!-- Explore Topics -->
                <div class="blogs-explore flex flex-col items-start gap-3 flex-shrink-0">
                <span class="text-gray-800 text-xs md:text-sm">Explore topics</span>
                <div class="flex flex-wrap gap-3">
                    <button class="blogs-button w-18 bg-[#FEB90E] hover:bg-yellow-500 text-white font-semibold px-10 py-4 rounded-full transition-all duration-200 hover:shadow-md text-xs md:text-sm">
                        Chicken
                    </button>
                    <button class="blogs-button w-18 bg-[#FEB90E] hover:bg-yellow-500 text-white font-semibold px-10 py-4 rounded-full transition-all duration-200 hover:shadow-md text-xs md:text-sm">
                        Pop-up
                    </button>
                    <button class="blogs-button w-18 bg-[#FEB90E] hover:bg-yellow-500 text-white font-semibold px-10 py-4 rounded-full transition-all duration-200 hover:shadow-md text-xs md:text-sm">
                        Angeles
                    </button>
                </div>
            </div>
            </div>
        </div>

    <!-- Blog Posts Section -->
    <div class="relative">
        <Blog />
        
        <!-- Navigation Buttons - Bottom Right -->
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            <div class="flex justify-end items-center gap-3 md:gap-4" style="padding-bottom: 2rem; margin-right: -12rem;">
                <!-- Previous Button -->
                <button 
                    @click="handlePrevious"
                    :disabled="currentPage === 1"
                    :class="[
                        'w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center group',
                        currentPage === 1 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-white hover:bg-gray-50 text-[#1A4189] hover:shadow-xl'
                    ]"
                    aria-label="Previous page"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" :class="['h-6 w-6 transition-transform duration-200', currentPage !== 1 && 'group-hover:-translate-x-0.5']" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </button>

                <!-- Next Button -->
                <button 
                    @click="handleNext"
                    :disabled="currentPage === totalPages"
                    :class="[
                        'w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center group',
                        currentPage === totalPages 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-white hover:bg-gray-50 text-[#1A4189] hover:shadow-xl'
                    ]"
                    aria-label="Next page"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" :class="['h-6 w-6 transition-transform duration-200', currentPage !== totalPages && 'group-hover:translate-x-0.5']" viewBox="0 0 20 20" fill="currentColor">
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


<script>
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';

export default {
    components: {
        Navbar,
        Footer
    },
    data() {
        return {
            currentPage: 1,
            totalPages: 5 // Update this based on your actual total pages
        };
    },
    methods: {
        handleNext() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                // Add your pagination logic here
                console.log('Next page:', this.currentPage);
                // Example: this.$router.push({ query: { page: this.currentPage } })
            }
        },
        handlePrevious() {
            if (this.currentPage > 1) {
                this.currentPage--;
                // Add your pagination logic here
                console.log('Previous page:', this.currentPage);
                // Example: this.$router.push({ query: { page: this.currentPage } })
            }
        }
    }
};
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