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
  title: "Buffs Chicken",
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/buffs-logo.png' },
    // Preload critical LCP images
    { rel: 'preload', as: 'image', href: '/buffs-logo.webp', fetchpriority: 'high' },
    { rel: 'preload', as: 'image', href: '/hero-main.webp', fetchpriority: 'high' }
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

