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

// Add breadcrumbs
useBreadcrumbs()

// SEO Meta Tags
useSeoMeta({ robots: 'index, follow' })
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
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Buffs Chicken",
        "description": "Crispy wings & comfort food in Angeles City.",
        "url": "https://www.buffschicken.com",
        "logo": "https://www.buffschicken.com/buffs-logo.webp",
        "image": "https://www.buffschicken.com/hero-main.webp",
        "priceRange": "\u20B1\u20B1",
        "servesCuisine": ["Filipino", "Chicken Wings", "Comfort Food"],
        "hasMenu": "https://www.buffschicken.com/menu",
        "acceptsReservations": false,
        "currenciesAccepted": "PHP",
        "paymentAccepted": "Cash, GCash, Maya, BPI, Maribank",
        "areaServed": {
          "@type": "City",
          "name": "Angeles City"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "15:30",
            "closes": "22:00"
          }
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "The Hood",
          "addressLocality": "Angeles City",
          "addressRegion": "Pampanga",
          "addressCountry": "PH"
        }
      }, null, 2)
    },
    {
      type: 'application/ld+json',
      // TODO: Confirm logo URL matches the file actually served from the backend
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Buffs Chicken",
        "url": "https://www.buffschicken.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.buffschicken.com/buffs-logo.webp"
        },
        "sameAs": [
          "https://www.facebook.com/buffschickenangelescity"
        ],
        "foundingLocation": {
          "@type": "Place",
          "name": "Angeles City, Pampanga, Philippines"
        }
      }, null, 2)
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