<template>
  <NuxtLayout>
    <div class="min-h-screen bg-[#FBF4E5] overflow-x-hidden max-w-[100vw]">
      <!-- Navigation Bar -->
      <Navbar />

      <!-- Hero Image Component -->
      <HeroSection />


    <!-- Popular Picks Section -->
    <PopularPicks />

    <!-- Blog Section -->
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
import HeroSection from '~/components/HeroSection.vue'

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
    { property: 'og:url', content: 'https://www.buffschicken.com' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Buffs Chicken",
        "description": "Crispy wings & comfort food in Angeles City.",
        "url": "https://www.buffschicken.com",
        "logo": "https://www.buffschicken.com/buffs-logo.webp",
        "image": "https://www.buffschicken.com/hero-main.webp",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "The Hood",
          "addressLocality": "Angeles City",
          "addressRegion": "Pampanga",
          "addressCountry": "PH"
        }
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Buffs Chicken",
        "url": "https://www.buffschicken.com",
        "logo": "https://www.buffschicken.com/buffs-logo.webp"
      })
    }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.buffschicken.com' }
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