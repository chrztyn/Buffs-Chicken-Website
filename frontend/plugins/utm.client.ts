export default defineNuxtPlugin(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('utm_campaign')) {
    localStorage.setItem('utm_data', JSON.stringify({
      source: params.get('utm_source'),
      medium: params.get('utm_medium'),
      campaign: params.get('utm_campaign')
    }))
  }
})