<template>
  <Transition name="cart-btn-fade">
    <button
      v-if="!isOnCartPage"
      @click="navigateTo('/cart')"
      class="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-50 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#FE601C] shadow-lg hover:bg-[#e5540a] active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#FE601C] focus:ring-offset-2"
      aria-label="View cart"
    >
      <!-- Cart icon -->
      <svg
        class="w-5 h-5 lg:w-6 lg:h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      <!-- Item count badge -->
      <span
        v-if="cartCount > 0"
        class="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#FEB90E] flex items-center justify-center text-xs font-bold text-[#1A4189]"
        :class="{ 'animate-bounce': isBouncing }"
      >
        {{ cartCount > 99 ? '99+' : cartCount }}
      </span>
    </button>
  </Transition>
</template>

<script setup lang="ts">
interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  notes: string
  selectedVariants: Record<string, string>
  selectedAddons: unknown[]
  selectedSauces: Record<string, string>
  basePrice: number
  addonsCost: number
  totalPrice: number
  customizationKey: string
}

const route = useRoute()
const isOnCartPage = computed(() => route.path === '/cart')

const cartCount = ref(0)
const isBouncing = ref(false)
let bounceTimer: ReturnType<typeof setTimeout> | null = null

function readCart(): void {
  if (!import.meta.client) return
  try {
    const saved = localStorage.getItem('buffs_cart')
    const items: CartItem[] = saved ? JSON.parse(saved) : []
    const newCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0)
    if (newCount > cartCount.value) {
      triggerBounce()
    }
    cartCount.value = newCount
  } catch {
    cartCount.value = 0
  }
}

function triggerBounce(): void {
  isBouncing.value = true
  if (bounceTimer) clearTimeout(bounceTimer)
  bounceTimer = setTimeout(() => {
    isBouncing.value = false
    bounceTimer = null
  }, 1000)
}

const storageHandler = (e: StorageEvent): void => {
  if (e.key === 'buffs_cart') readCart()
}

onMounted(() => {
  readCart()
  window.addEventListener('cart-updated', readCart)
  window.addEventListener('storage', storageHandler)
})

onUnmounted(() => {
  window.removeEventListener('cart-updated', readCart)
  window.removeEventListener('storage', storageHandler)
  if (bounceTimer) clearTimeout(bounceTimer)
})
</script>

<style scoped>
.cart-btn-fade-enter-active,
.cart-btn-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.cart-btn-fade-enter-from,
.cart-btn-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
