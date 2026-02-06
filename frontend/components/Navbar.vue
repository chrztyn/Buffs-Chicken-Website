<template>
  <nav class="bg-[#FBF4E5] shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#1A4189] flex items-center justify-center overflow-hidden border-2 border-white shadow-lg hover:scale-105 transition-transform">
            <NuxtImg src="/logo.png" alt="Buff's Chicken Logo" class="w-full h-full object-contain p-1.5" />
          </div>
          <span class="font-['Unbounded'] font-semibold text-xl text-[#1A4189] hidden sm:block">Buff's Chicken</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <NuxtLink 
            to="/" 
            class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] transition-colors duration-200"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/blogs" 
            class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] transition-colors duration-200"
          >
            Blogs
          </NuxtLink>
          <NuxtLink 
            to="/menu" 
            class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] transition-colors duration-200"
          >
            Menu
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] transition-colors duration-200"
          >
            About
          </NuxtLink>
          <NuxtLink 
            to="/contact" 
            class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] transition-colors duration-200"
          >
            Contact
          </NuxtLink>
          
          <!-- Cart Button -->
          <NuxtLink 
            to="/cart" 
            class="relative font-['Unbounded'] font-semibold text-sm bg-[#1A4189] text-[#FEB90E] py-2 px-6 rounded-full hover:bg-[#15306d] transition-all duration-200 hover:shadow-lg"
          >
            Cart
            <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-[#FEB90E] text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
              {{ cartCount }}
            </span>
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button 
          @click="menuOpen = !menuOpen"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg 
            class="w-6 h-6 text-gray-700"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              v-if="!menuOpen"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path 
              v-else
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <transition name="mobile-menu">
        <div v-if="menuOpen" class="md:hidden pb-4">
          <div class="flex flex-col gap-2">
            <NuxtLink 
              to="/" 
              @click="menuOpen = false"
              class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Home
            </NuxtLink>
            <NuxtLink 
              to="/blogs" 
              @click="menuOpen = false"
              class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Blogs
            </NuxtLink>
            <NuxtLink 
              to="/menu" 
              @click="menuOpen = false"
              class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Menu
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              @click="menuOpen = false"
              class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors duration-200"
            >
              About
            </NuxtLink>
            <NuxtLink 
              to="/contact" 
              @click="menuOpen = false"
              class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Contact
            </NuxtLink>
            <NuxtLink 
              to="/cart" 
              @click="menuOpen = false"
              class="relative font-['Unbounded'] font-semibold text-sm bg-[#1A4189] text-[#FEB90E] py-3 px-4 rounded-lg hover:bg-[#15306d] transition-all duration-200 text-center"
            >
              Cart
              <span v-if="cartCount > 0" class="ml-2 bg-[#FEB90E] text-gray-900 text-xs font-bold rounded-full px-2 py-0.5">
                {{ cartCount }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const menuOpen = ref(false)
const cartCount = ref(0)

const loadCartCount = () => {
  try {
    const cart = localStorage.getItem('buffs_cart')
    if (cart) {
      const cartItems = JSON.parse(cart)
      cartCount.value = Array.isArray(cartItems) ? cartItems.length : 0
    } else {
      cartCount.value = 0
    }
  } catch (error) {
    console.error('Error loading cart count:', error)
    cartCount.value = 0
  }
}

onMounted(() => {
  loadCartCount()
  
  window.addEventListener('storage', loadCartCount)
  window.addEventListener('cart-updated', loadCartCount)
  
  return () => {
    window.removeEventListener('storage', loadCartCount)
    window.removeEventListener('cart-updated', loadCartCount)
  }
})
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  max-height: 0;
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  max-height: 500px;
}

@media (prefers-reduced-motion: reduce) {
  .mobile-menu-enter-active,
  .mobile-menu-leave-active {
    transition: none;
  }
}
</style>