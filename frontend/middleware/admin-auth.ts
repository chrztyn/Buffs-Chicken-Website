export default defineNuxtRouteMiddleware((to, from) => {
  // Skip authentication check on server-side
  if (!process.client) {
    return
  }

  const { isAuthenticated, initToken } = useAdmin()
  
  // Load token from localStorage
  initToken()

  // Check if authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/admin/login')
  }
})
