import { Workbox } from 'workbox-window'

declare global {
  interface Window {
    wb?: Workbox
  }
}

export default defineNuxtPlugin(async (nuxtApp) => {

})
