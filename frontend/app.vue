<template>
  <div id="app">
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
  script: [
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-P48SW3GZ05',
      async: true
    },
    {
      innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-P48SW3GZ05');`
    }
  ]
})


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

