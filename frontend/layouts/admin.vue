<template>
  <div class="min-h-screen bg-[#FBF4E5]" style="font-family: 'Poppins', sans-serif;">

    <!-- Global new-order toast (fires on any admin page) -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-[-16px] scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-[-16px] scale-95"
    >
      <div
        v-if="newOrderToast"
        @click="goToOrders"
        class="fixed top-4 right-4 z-[9999] cursor-pointer bg-[#1A4189] text-white rounded-2xl shadow-2xl p-4 w-80 flex items-start gap-3 border border-white/10"
      >
        <div class="w-9 h-9 rounded-xl bg-[#FE601C] flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-['Poppins'] font-bold text-sm">New Order Received!</p>
          <p class="font-['Poppins'] text-xs text-white/75 mt-0.5 truncate">{{ newOrderToast }}</p>
          <p class="font-['Poppins'] text-xs text-[#FEB90E] mt-1 font-semibold">Tap to view orders →</p>
        </div>
        <button
          @click.stop="newOrderToast = null"
          class="text-white/50 hover:text-white flex-shrink-0 mt-0.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </transition>
    <!-- Mobile Header -->
    <div class="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="flex items-center justify-between px-4 py-4">
        <h1 class="font-['Caprasimo'] text-2xl text-[#1A4189]">Buffs</h1>
        <button
          @click="menuOpen = !menuOpen"
          class="text-2xl text-[#1A4189]"
        >
          <svg v-if="menuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <nav v-if="menuOpen" class="bg-white border-t border-gray-200 px-4 py-3 space-y-2">
        <NuxtLink
          to="/admin/dashboard"
          class="block px-4 py-2 rounded-lg font-['Poppins'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
          @click="menuOpen = false"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink
          to="/admin/products"
          class="block px-4 py-2 rounded-lg font-['Poppins'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
          @click="menuOpen = false"
        >
          Products
        </NuxtLink>
        <NuxtLink
          to="/admin/categories"
          class="block px-4 py-2 rounded-lg font-['Poppins'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
          @click="menuOpen = false"
        >
          Categories
        </NuxtLink>
        <NuxtLink
          to="/admin/orders"
          class="block px-4 py-2 rounded-lg font-['Poppins'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
          @click="menuOpen = false"
        >
          Orders
        </NuxtLink>
        <NuxtLink
          to="/admin/blogs"
          class="block px-4 py-2 rounded-lg font-['Poppins'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
          @click="menuOpen = false"
        >
          Blogs
        </NuxtLink>
        <NuxtLink
          to="/admin/events"
          class="block px-4 py-2 rounded-lg font-['Poppins'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
          @click="menuOpen = false"
        >
          Events
        </NuxtLink>
        <NuxtLink
          to="/admin/store-hours"
          class="block px-4 py-2 rounded-lg font-['Poppins'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
          @click="menuOpen = false"
        >
          Store Hours
        </NuxtLink>
        <button
          @click="handleLogout"
          class="w-full text-left px-4 py-2 text-[#FE601C] font-['Poppins'] font-semibold hover:bg-red-50 rounded-lg transition"
        >
          Logout
        </button>
      </nav>
    </div>

    <!-- Main Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-6 min-h-screen">
      <!-- Sidebar (desktop only) -->
      <div class="hidden lg:block lg:col-span-1 bg-white border-r border-gray-200 sticky top-0 h-screen">
        <div class="p-6">
          <h1 class="font-['Caprasimo'] text-3xl text-[#1A4189] mb-8">Buffs</h1>
          <nav class="space-y-3">
            <NuxtLink
              to="/admin/dashboard"
              class="block px-4 py-3 rounded-lg font-['Poppins'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/admin/products"
              class="block px-4 py-3 rounded-lg font-['Poppins'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
            >
              Products
            </NuxtLink>
            <NuxtLink
              to="/admin/categories"
              class="block px-4 py-3 rounded-lg font-['Poppins'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
            >
              Categories
            </NuxtLink>
            <NuxtLink
              to="/admin/orders"
              class="block px-4 py-3 rounded-lg font-['Poppins'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
            >
              Orders
            </NuxtLink>
            <NuxtLink
              to="/admin/blogs"
              class="block px-4 py-3 rounded-lg font-['Poppins'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
            >
              Blogs
            </NuxtLink>
            <NuxtLink
              to="/admin/events"
              class="block px-4 py-3 rounded-lg font-['Poppins'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
            >
              Events
            </NuxtLink>
            <NuxtLink
              to="/admin/store-hours"
              class="block px-4 py-3 rounded-lg font-['Poppins'] font-semibold text-[#1A4189] hover:bg-[#FBF4E5] transition"
            >
              Store Hours
            </NuxtLink>
          </nav>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            class="w-full mt-8 px-4 py-3 bg-[#FE601C] text-white font-['Poppins'] font-semibold rounded-lg hover:bg-[#e5551a] transition"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="col-span-1 lg:col-span-5 overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAdmin } from '~/composables/useAdmin'
import io, { type Socket } from 'socket.io-client'

declare global {
  interface Window {
    gtag: Function
  }
}

const router = useRouter()
const { clearToken, initToken, token } = useAdmin()
const menuOpen = ref(false)

// ─── Global new-order notification ──────────────────────────────────────────
const newOrderToast = ref<string | null>(null)
let notifSocket: Socket | null = null
let toastTimer: ReturnType<typeof setTimeout> | null = null

const playOrderSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, ctx.currentTime)
    oscillator.frequency.setValueAtTime(1100, ctx.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.5)
  } catch {
    // AudioContext not supported — silent fail
  }
}

const goToOrders = () => {
  newOrderToast.value = null
  router.push('/admin/orders')
}

const connectNotifSocket = () => {
  if (notifSocket?.connected) return
  const socketUrl = (useRuntimeConfig().public as any).socketUrl || 'http://localhost:5001'
  notifSocket = io(socketUrl, {
    auth: { token: token.value },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10
  })
  notifSocket.on('connect', () => {
    notifSocket?.emit('join-admin-orders')
  })
  notifSocket.on('new-order', (data: any) => {
    const text = `Order #${data.orderNumber} from ${data.customerName} — ₱${data.totalAmount}`
    newOrderToast.value = text
    playOrderSound()
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => { newOrderToast.value = null }, 8000)
  })
}

// ─── Auth / lifecycle ────────────────────────────────────────────────────────
const handleLogout = () => {
  clearToken()
  notifSocket?.disconnect()
  router.push('/admin/login')
}

onMounted(() => {
  initToken()
  connectNotifSocket()

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-P48SW3GZ05', { page_path: window.location.pathname })
  }
})

onUnmounted(() => {
  notifSocket?.disconnect()
  if (toastTimer) clearTimeout(toastTimer)
})
</script>
