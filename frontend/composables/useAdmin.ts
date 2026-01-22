import { ref, computed } from 'vue'

// Shared singleton state
let sharedToken = ref<string | null>(null)
let sharedAdmin = ref<any>(null)
let clientInitialized = false

export const useAdmin = () => {
  const token = sharedToken
  const admin = sharedAdmin
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Load token from localStorage on init
  const initToken = () => {
    if (!process.client) {
      return
    }
    
    // Only initialize once per client session
    if (clientInitialized) {
      return
    }
    
    const savedToken = localStorage.getItem('admin_token')
    if (savedToken) {
      token.value = savedToken
    }
    
    clientInitialized = true
  }

  // Check if admin is authenticated
  const isAuthenticated = computed(() => !!token.value)

  // Save token to localStorage
  const saveToken = (newToken: string) => {
    token.value = newToken
    if (process.client) {
      localStorage.setItem('admin_token', newToken)
    }
  }

  // Clear token (logout)
  const clearToken = () => {
    token.value = null
    admin.value = null
    clientInitialized = false // Reset so token can be reloaded on next login
    if (process.client) {
      localStorage.removeItem('admin_token')
    }
  }

  // Get authorization header
  const getAuthHeader = () => {
    return {
      'Authorization': `Bearer ${token.value}`
    }
  }

  return {
    token,
    admin,
    isLoading,
    error,
    isAuthenticated,
    initToken,
    saveToken,
    clearToken,
    getAuthHeader
  }
}
