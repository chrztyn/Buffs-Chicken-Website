<template>
  <NuxtPage />
</template>

<script setup lang="ts">
import { useAdmin } from '~/composables/useAdmin'
import { useRouter } from 'vue-router'

const router = useRouter()
const { isAuthenticated, initToken } = useAdmin()

// Check if trying to access login page specifically
const isLoginPage = () => router.currentRoute.value.path === '/admin/login'

// Initialize on mount
onMounted(async () => {
  // Initialize token from localStorage
  await initToken()
  
  // If not on login page and not authenticated, redirect to login
  if (!isLoginPage() && !isAuthenticated.value) {
    await navigateTo('/admin/login')
  }
})
</script>
