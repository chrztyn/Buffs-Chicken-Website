<template>
  <div id="app">
    <OfflineNotification />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Root app component
useHead({
  title: "Buffs Chicken - Crispy Wings & Comfort Food",
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: "Welcome to Buffs Chicken Philippines — home of the crispiest chicken pops and wings, pasta, and affordable comfort meals loved by Filipinos. Explore our menu, discover our best-selling flavors, and find Buffs Chicken branches near you." },
    { name: 'theme-color', content: '#000000' },
    
    // Open Graph tags for Google and social media
    { property: 'og:type', content: 'business.business' },
    { property: 'og:url', content: 'https://www.buffschicken.com' },
    { property: 'og:title', content: 'Buffs Chicken - Crispy Wings & Comfort Food' },
    { property: 'og:description', content: "Welcome to Buffs Chicken Philippines — home of the crispiest chicken pops and wings, pasta, and affordable comfort meals loved by Filipinos. Explore our menu, discover our best-selling flavors, and find Buffs Chicken branches near you." },
    { property: 'og:image', content: 'https://www.buffschicken.com/buffs-logo.webp' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:site_name', content: 'Buffs Chicken' },
    
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Buffs Chicken - Crispy Wings & Comfort Food' },
    { name: 'twitter:description', content: "Welcome to Buffs Chicken Philippines — home of the crispiest chicken pops and wings, pasta, and affordable comfort meals loved by Filipinos. Explore our menu, discover our best-selling flavors, and find Buffs Chicken branches near you." },
    { name: 'twitter:image', content: 'https://www.buffschicken.com/buffs-logo.webp' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico?v=4' },
    { rel: 'apple-touch-icon', href: '/icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
    // Preconnect to Google Tag Manager for faster analytics loading
    { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
    // Preload critical LCP images
    { rel: 'preload', as: 'image', href: '/buffs-logo.webp', fetchpriority: 'high' },
    { rel: 'preload', as: 'image', href: '/hero-main.webp', fetchpriority: 'high' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        'name': 'Buffs Chicken',
        'image': 'https://www.buffschicken.com/buffs-logo.webp',
        'description': 'Welcome to Buffs Chicken Philippines — home of the crispiest chicken pops and wings, pasta, and affordable comfort meals loved by Filipinos. Explore our menu, discover our best-selling flavors, and find Buffs Chicken branches near you.',
        'url': 'https://www.buffschicken.com',
        'logo': 'https://www.buffschicken.com/buffs-logo.webp',
        'telephone': '+63 917 194 0749', 
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'The Hood, Angeles City',
          'addressLocality': 'Angeles City',
          'addressRegion': 'Pampanga',
          'postalCode': '2009',
          'addressCountry': 'PH'
        },
        'priceRange': '$$',
        'servesCuisine': 'Filipino, American, Comfort Food',
        'sameAs': [
          'https://www.facebook.com/buffschicken',
          'https://www.instagram.com/buffschickenph'
        ]
      })
    }
  ]
})

// Defer Google Analytics loading until after page interaction
if (process.client) {
  useScript({
    key: 'google-analytics',
    src: 'https://www.googletagmanager.com/gtag/js?id=G-P48SW3GZ05',
  }, {
    trigger: 'onNuxtReady', // Load after Nuxt is ready, not blocking initial render
    use() {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-P48SW3GZ05');
    }
  })
}
</script>

<style>
/* * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
} */

body {
  font-family: 'Unbounded', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
</style>

