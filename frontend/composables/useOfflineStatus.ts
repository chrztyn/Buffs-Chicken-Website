export const useOfflineStatus = () => {
  const isOnline = ref(true)
  const updateAvailable = ref(false)

  const handleOnline = () => {
    isOnline.value = true
  }

  const handleOffline = () => {
    isOnline.value = false
  }

  const handleSWUpdate = () => {
    updateAvailable.value = true
  }

  const refreshPage = () => {
    window.location.reload()
  }

  onMounted(() => {
    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Listen for service worker updates
    window.addEventListener('sw-update-available', handleSWUpdate)

    // Set initial state
    isOnline.value = navigator.onLine
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
    window.removeEventListener('sw-update-available', handleSWUpdate)
  })

  return {
    isOnline: readonly(isOnline),
    updateAvailable: readonly(updateAvailable),
    refreshPage,
  }
}
