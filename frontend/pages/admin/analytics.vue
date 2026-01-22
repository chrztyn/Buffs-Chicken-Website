<template>
  <div class="p-4 lg:p-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="font-['Caprasimo'] text-4xl text-[#1A4189] mb-2">Website Analytics</h1>
      <p class="font-['Unbounded'] text-gray-600">View your website performance metrics</p>
    </div>

    <!-- Info Box -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
      <p class="text-blue-900 font-['Unbounded'] text-sm">
        📊 Analytics data is powered by Google Analytics. 
        <a 
          href="https://analytics.google.com/analytics/web/" 
          target="_blank" 
          class="text-blue-600 hover:underline font-bold"
        >
          View detailed analytics here
        </a>
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Total Visitors Card -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-['Unbounded'] text-sm text-gray-600 font-semibold">Total Visitors</p>
            <p class="font-['Caprasimo'] text-3xl text-[#1A4189] mt-2">—</p>
            <p class="text-xs text-gray-500 font-['Unbounded'] mt-2">Check Google Analytics for live data</p>
          </div>
          <div class="text-4xl">👥</div>
        </div>
      </div>

      <!-- Page Views Card -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-['Unbounded'] text-sm text-gray-600 font-semibold">Page Views</p>
            <p class="font-['Caprasimo'] text-3xl text-[#1A4189] mt-2">—</p>
            <p class="text-xs text-gray-500 font-['Unbounded'] mt-2">Check Google Analytics for live data</p>
          </div>
          <div class="text-4xl">📄</div>
        </div>
      </div>

      <!-- Bounce Rate Card -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-['Unbounded'] text-sm text-gray-600 font-semibold">Bounce Rate</p>
            <p class="font-['Caprasimo'] text-3xl text-[#1A4189] mt-2">—</p>
            <p class="text-xs text-gray-500 font-['Unbounded'] mt-2">Check Google Analytics for live data</p>
          </div>
          <div class="text-4xl">📉</div>
        </div>
      </div>

      <!-- Avg Session Duration Card -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-['Unbounded'] text-sm text-gray-600 font-semibold">Avg Session Duration</p>
            <p class="font-['Caprasimo'] text-3xl text-[#1A4189] mt-2">—</p>
            <p class="text-xs text-gray-500 font-['Unbounded'] mt-2">Check Google Analytics for live data</p>
          </div>
          <div class="text-4xl">⏱️</div>
        </div>
      </div>
    </div>

    <!-- Google Analytics Embed -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 class="font-['Caprasimo'] text-2xl text-[#1A4189] mb-4">Real-time Dashboard</h2>
      <p class="text-gray-600 font-['Unbounded'] mb-4">
        For a complete view of your analytics data including traffic sources, user behavior, and conversions, visit:
      </p>
      <a 
        href="https://analytics.google.com/analytics/web/#/p/414999518/reports/dashboard" 
        target="_blank"
        class="inline-block px-6 py-3 bg-[#FE601C] text-white font-['Unbounded'] font-bold rounded-lg hover:bg-[#e5551a] transition"
      >
        Open Google Analytics Dashboard →
      </a>
    </div>

    <!-- Top Pages Section -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 class="font-['Caprasimo'] text-2xl text-[#1A4189] mb-4">Quick Links</h2>
      <div class="space-y-2">
        <a 
          href="https://analytics.google.com/analytics/web/#/p/414999518/reports/realtime" 
          target="_blank"
          class="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition font-['Unbounded'] text-blue-600 hover:text-blue-800 font-semibold"
        >
          📊 Real-time Overview
        </a>
        <a 
          href="https://analytics.google.com/analytics/web/#/p/414999518/reports/traffic-sources" 
          target="_blank"
          class="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition font-['Unbounded'] text-green-600 hover:text-green-800 font-semibold"
        >
          🔗 Traffic Sources
        </a>
        <a 
          href="https://analytics.google.com/analytics/web/#/p/414999518/reports/audience-overview" 
          target="_blank"
          class="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition font-['Unbounded'] text-purple-600 hover:text-purple-800 font-semibold"
        >
          👤 Audience Overview
        </a>
        <a 
          href="https://analytics.google.com/analytics/web/#/p/414999518/reports/content-overview" 
          target="_blank"
          class="block p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition font-['Unbounded'] text-orange-600 hover:text-orange-800 font-semibold"
        >
          📝 Page Performance
        </a>
      </div>
    </div>

    <!-- Info Section -->
    <div class="bg-amber-50 border border-amber-200 rounded-lg p-6">
      <h3 class="font-['Caprasimo'] text-lg text-amber-900 mb-3">ℹ️ About This Page</h3>
      <p class="text-amber-800 font-['Unbounded'] text-sm mb-3">
        This page provides quick access to your Google Analytics dashboard. Your website analytics tracking ID is: <span class="font-bold">G-P48SW3GZ05</span>
      </p>
      <p class="text-amber-800 font-['Unbounded'] text-sm">
        For advanced analytics features, custom reports, and detailed insights, please visit your full Google Analytics dashboard.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
</script>
