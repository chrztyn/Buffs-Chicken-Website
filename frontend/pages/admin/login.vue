<template>
  <div class="min-h-screen bg-[#FBF4E5] flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo/Title -->
      <div class="text-center mb-8">
        <h1 class="font-['Caprasimo'] text-5xl text-[#1A4189] mb-2">Buffs</h1>
        <p class="font-['Unbounded'] text-[#FE601C] text-lg font-bold">Admin Dashboard</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <h2 class="font-['Unbounded'] text-2xl font-bold text-[#1A4189] mb-6 text-center">Admin Login</h2>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ error }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block font-['Unbounded'] text-sm font-semibold text-[#1A4189] mb-2">
              Username
            </label>
            <input
              v-model="form.username"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] transition"
            />
          </div>

          <div>
            <label class="block font-['Unbounded'] text-sm font-semibold text-[#1A4189] mb-2">
              Password
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] transition"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2 bg-[#FE601C] text-white font-['Unbounded'] font-bold rounded-lg hover:bg-[#e5551a] disabled:opacity-50 transition"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center text-gray-600 text-sm font-['Unbounded']">
        <NuxtLink to="/" class="text-[#FE601C] hover:underline font-bold">
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdmin } from '~/composables/useAdmin'
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: false
})

const router = useRouter()
const { saveToken, admin: adminRef, initToken, isAuthenticated } = useAdmin()
const { adminLogin } = useApi()

const form = ref({
  username: '',
  password: ''
})

const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    error.value = 'Please fill in all fields'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await adminLogin(form.value.username, form.value.password)
    const { token, admin } = response.data

    // Save token and admin info
    saveToken(token)
    adminRef.value = admin

    // Redirect to dashboard
    await router.push('/admin/dashboard')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Initialize on mount
onMounted(() => {
  if (isAuthenticated.value) {
    navigateTo('/admin/dashboard')
  }
})
</script>
