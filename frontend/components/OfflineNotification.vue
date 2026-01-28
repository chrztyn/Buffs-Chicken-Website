<template>
  <Teleport to="body">
    <!-- Offline notification -->
    <transition name="slide-down">
      <div
        v-if="!isOnline"
        class="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-3 text-center z-50"
      >
        <p class="font-semibold">⚠️ You are offline. Some features may be limited.</p>
      </div>
    </transition>

    <!-- Update available notification -->
    <transition name="slide-down">
      <div
        v-if="updateAvailable"
        class="fixed top-12 left-0 right-0 bg-blue-500 text-white px-4 py-3 flex items-center justify-between z-50"
      >
        <p class="font-semibold">✨ A new version is available!</p>
        <button
          @click="refreshPage"
          class="ml-4 px-4 py-2 bg-white text-blue-500 rounded font-semibold hover:bg-gray-100 transition-colors"
        >
          Refresh
        </button>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
const { isOnline, updateAvailable, refreshPage } = useOfflineStatus()
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: none;
  }
}
</style>
