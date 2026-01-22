export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, initToken } = useAdmin()

  // Only run on client side
  if (process.client) {
    initToken()
  }

  // Check if authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/admin/login')
  }
})
