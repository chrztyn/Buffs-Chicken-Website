<template>
  <div class="min-h-screen bg-[#FBF4E5]">
    <!-- Mobile Header -->
    <div class="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="flex items-center justify-between px-4 py-4">
        <h1 class="font-['Caprasimo'] text-2xl text-[#1A4189]">Buffs</h1>
        <button
          @click="menuOpen = !menuOpen"
          class="text-2xl text-[#1A4189]"
        >
          {{ menuOpen ? '✕' : '☰' }}
        </button>
      </div>

      <!-- Mobile Menu -->
      <nav v-if="menuOpen" class="bg-white border-t border-gray-200 px-4 py-3 space-y-2">
        <NuxtLink
          to="/admin/dashboard"
          class="block px-4 py-2 rounded-lg font-['Unbounded'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
          @click="menuOpen = false"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink
          to="/admin/products"
          class="block px-4 py-2 rounded-lg font-['Unbounded'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
          @click="menuOpen = false"
        >
          Products
        </NuxtLink>
        <NuxtLink
          to="/admin/orders"
          class="block px-4 py-2 rounded-lg font-['Unbounded'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
          @click="menuOpen = false"
        >
          Orders
        </NuxtLink>
        <NuxtLink
          to="/admin/blogs"
          class="block px-4 py-2 rounded-lg font-['Unbounded'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
          @click="menuOpen = false"
        >
          Blogs
        </NuxtLink>
        <button
          @click="handleLogout"
          class="w-full text-left px-4 py-2 text-[#FE601C] font-['Unbounded'] font-semibold hover:bg-red-50 rounded-lg transition"
        >
          Logout
        </button>
      </nav>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden lg:grid grid-cols-1 lg:grid-cols-6 min-h-screen">
      <!-- Sidebar -->
      <div class="lg:col-span-1 bg-white border-r border-gray-200 sticky top-0 h-screen">
        <div class="p-6">
          <h1 class="font-['Caprasimo'] text-3xl text-[#1A4189] mb-8">Buffs</h1>
          <nav class="space-y-3">
            <NuxtLink
              to="/admin/dashboard"
              class="block px-4 py-3 rounded-lg font-['Unbounded'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/admin/products"
              class="block px-4 py-3 rounded-lg font-['Unbounded'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
            >
              Products
            </NuxtLink>
            <NuxtLink
              to="/admin/orders"
              class="block px-4 py-3 rounded-lg font-['Unbounded'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
            >
              Orders
            </NuxtLink>
            <NuxtLink
              to="/admin/blogs"
              class="block px-4 py-3 rounded-lg font-['Unbounded'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
            >
              Blogs
            </NuxtLink>
          </nav>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            class="w-full mt-8 px-4 py-3 bg-[#FE601C] text-white font-['Unbounded'] font-semibold rounded-lg hover:bg-[#e5551a] transition"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-5 overflow-y-auto">
        <slot />
      </div>
    </div>

    <!-- Mobile Content -->
    <div class="lg:hidden">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdmin } from '~/composables/useAdmin'

definePageMeta({
  middleware: 'admin-auth'
})

const router = useRouter()
const { clearToken, initToken } = useAdmin()
const menuOpen = ref(false)

const handleLogout = () => {
  clearToken()
  router.push('/admin/login')
}

onMounted(() => {
  initToken()
})
</script>
