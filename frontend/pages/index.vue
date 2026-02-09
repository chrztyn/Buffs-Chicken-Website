<template>
  <NuxtLayout>
    <div class="min-h-screen bg-[#FBF4E5] overflow-x-hidden max-w-[100vw]">
      <!-- Navigation Bar -->
      <Navbar />

    <!-- Hero Section -->
    <section class="w-full h-[calc(100vh-7rem)] px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-40 overflow-x-hidden overflow-y-hidden flex flex-col justify-center lg:!pt-[300px] lg:!pl-[100px]">
      <div class="max-w-7xl mx-auto w-full">
        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-0.5 sm:gap-2 max-[1023px]:gap-2 lg:gap-4">

          <!-- Hero Image Component -->
          <HeroImages />

          <!-- Text Content -->
          <div class="text-content-container flex-1 max-w-xl lg:max-w-5xl space-y-2 sm:space-y-3 lg:space-y-6 relative order-2 lg:order-1 lg:mt-40 -mt-20 sm:-mt-24 lg:-mt-0 z-20 sm:z-30 lg:z-0 mx-auto text-center">

            <!-- Main Heading -->
            <h1 class="font-['Caprasimo'] text-5xl sm:text-6xl md:text-7xl lg:text-7xl text-[#1A4189] leading-none z-20 sm:z-30 lg:z-0 relative lg:text-left">
              Buffs<br />Chicken
            </h1>
            
            <!-- Subheading -->
            <h2 class="font-['Unbounded'] text-base sm:text-2xl max-[1023px]:text-2xl lg:text-3xl font-bold text-[#FE601C] leading-tight mt-2 sm:mt-4 max-[1023px]:mt-4 lg:mt-6 lg:text-left">
              your go-to comfort
            </h2>
            
            <!-- Description Paragraph -->
            <p class="description-paragraph font-['Unbounded'] text-xs sm:text-base max-[1023px]:text-base lg:text-lg text-gray-500 max-[1023px]:text-gray-600 lg:text-gray-700 leading-relaxed w-full max-w-2xl max-[1023px]:max-w-3xl mx-auto lg:mx-0 lg:text-left">
              Welcome to Buffs Chicken, your go-to spot at The Hood, Angeles City for the crispiest and juiciest chicken around. From signature OG Buffs wings to cheesy pastas and loaded combos, every meal is cooked fresh and packed with flavor.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Picks Section -->
    <PopularPicks />

    <!-- Blog Section -->
    <h2 class="blog-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#2B5B9E] mb-8 sm:mb-10 lg:mb-12 font-['Unbounded'] px-6 sm:px-8 md:px-10 lg:pl-20">
      The latest from Buffs
    </h2>
    <Blog />

    <!-- FAQ Section -->
    <FAQ />

    <!-- Footer Section -->
    <Footer />

  </div>
</NuxtLayout>    
</template>

<script setup>
// Eager load (needed above fold)
import Navbar from '~/components/Navbar.vue'
import HeroImages from '~/components/HeroImages.vue'

// Lazy load (below fold)
const PopularPicks = defineAsyncComponent(() => import('~/components/PopularPicks.vue'))
const Blog = defineAsyncComponent(() => import('~/components/Blog.vue'))
const FAQ = defineAsyncComponent(() => import('~/components/FAQ.vue'))
const Footer = defineAsyncComponent(() => import('~/components/Footer.vue'))

// SEO Meta Tags
useHead({
  title: 'Buffs Chicken - Crispy Wings & Comfort Food in Angeles City',
  meta: [
    {
      name: 'description',
      content: 'Buffs Chicken at The Hood, Angeles City serves crispy and juicy signature OG Buffs wings, cheesy pastas, and loaded combos. Fresh, flavorful comfort food delivered to your door.'
    },
    {
      name: 'keywords',
      content: 'Buffs Chicken, chicken wings, Angeles City, The Hood, comfort food, crispy chicken, OG Buffs, food delivery'
    },
    { property: 'og:title', content: 'Buffs Chicken - Crispy Wings & Comfort Food in Angeles City' },
    { property: 'og:description', content: 'Crispy and juicy signature OG Buffs wings, cheesy pastas, and loaded combos at The Hood, Angeles City' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://buffschicken.com' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})

</script>

<style scoped>
/* Keep only the global overflow fixes that can't be done with Tailwind */
html,
body,
#__nuxt {
  overflow-x: hidden;
  max-width: 100vw;
}
</style>