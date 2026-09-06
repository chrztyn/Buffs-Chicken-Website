<template>
  <div style="max-width: 640px; margin: 40px auto; padding: 20px; font-family: system-ui;">
    <h1 style="font-weight: 800; margin-bottom: 16px;">Pin test</h1>
    <LocationField v-model="loc" />
    <pre style="margin-top: 20px; background: #f3f4f6; padding: 12px; border-radius: 8px; font-size: 12px;">{{ loc }}</pre>
    <p style="margin-top: 12px; font-size: 13px;">
      Google Maps check:
      <a v-if="loc.lat" :href="`https://www.google.com/maps?q=${loc.lat},${loc.lng}`" target="_blank" style="color: #1A4189; font-weight: 700;">
        open {{ loc.lat }}, {{ loc.lng }}
      </a>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const loc = ref({ lat: null, lng: null, label: null, note: null, source: 'pin' })
</script>
