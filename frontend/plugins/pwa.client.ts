import { Workbox } from 'workbox-window'

declare global {
  interface Window {
    wb?: Workbox
  }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  // Service Worker disabled - uncomment when PWA module is properly configured
  // Only register service worker in production and if it's supported
  /*
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    try {
      const wb = new Workbox('/sw.js')
      window.wb = wb

      // Handle waiting service worker (new version available)
      wb.addEventListener('waiting', () => {
        console.log('New Service Worker version available')
        // You can show a toast notification here to prompt user to refresh
        const event = new CustomEvent('sw-update-available')
        window.dispatchEvent(event)
      })

      // Register the service worker
      const registration = await wb.register()
      console.log('Service Worker registered:', registration)

      // Check for updates periodically (every 1 hour)
      setInterval(() => {
        wb.update()
      }, 60 * 60 * 1000)

      return {
        provide: {
          sw: {
            update: () => wb.update(),
            register: () => wb.register(),
          },
        },
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
  */
})
