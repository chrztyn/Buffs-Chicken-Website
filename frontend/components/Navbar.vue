<template>
  <nav class="bg-[#FBF4E5] shadow-md relative z-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#1A4189] flex items-center justify-center overflow-hidden border-2 border-white shadow-lg hover:scale-105 transition-transform">
            <img src="/buffs-logo.webp" alt="Buff's Chicken Logo" fetchpriority="high" class="w-full h-full object-contain p-1.5" />
          </div>
          <span class="font-['Unbounded'] font-semibold text-xl text-[#1A4189] hidden sm:block">Buffs Chicken</span>
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
            to="/calendar" 
            class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] transition-colors duration-200"
          >
            Events
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
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors relative w-10 h-10 flex items-center justify-center"
          aria-label="Toggle menu"
        >
          <div class="hamburger-icon">
            <span class="hamburger-line" :class="{ 'open': menuOpen }"></span>
            <span class="hamburger-line" :class="{ 'open': menuOpen }"></span>
            <span class="hamburger-line" :class="{ 'open': menuOpen }"></span>
          </div>
        </button>
      </div>

      <!-- Mobile Menu -->
      <transition name="mobile-menu">
        <div v-if="menuOpen" class="md:hidden pb-4 overflow-hidden">
          <div class="flex flex-col gap-2 pt-2">
            <NuxtLink 
              to="/" 
              @click="menuOpen = false"
              class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors duration-200 menu-item"
              style="animation-delay: 0.05s"
            >
              Home
            </NuxtLink>
            <NuxtLink 
              to="/blogs" 
              @click="menuOpen = false"
              class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors duration-200 menu-item"
              style="animation-delay: 0.1s"
            >
              Blogs
            </NuxtLink>
            <NuxtLink 
              to="/menu" 
              @click="menuOpen = false"
              class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors duration-200 menu-item"
              style="animation-delay: 0.15s"
            >
              Menu
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              @click="menuOpen = false"
              class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors duration-200 menu-item"
              style="animation-delay: 0.2s"
            >
              About
            </NuxtLink>
            <NuxtLink 
              to="/calendar" 
              @click="menuOpen = false"
              class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors duration-200 menu-item"
              style="animation-delay: 0.225s"
            >
              Events
            </NuxtLink>
            <NuxtLink 
              to="/contact" 
              @click="menuOpen = false"
              class="font-['Unbounded'] font-normal text-sm text-gray-700 hover:text-[#FE601C] hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors duration-200 menu-item"
              style="animation-delay: 0.25s"
            >
              Contact
            </NuxtLink>
            <NuxtLink 
              to="/cart" 
              @click="menuOpen = false"
              class="relative font-['Unbounded'] font-semibold text-sm bg-[#1A4189] text-[#FEB90E] py-3 px-4 rounded-lg hover:bg-[#15306d] transition-all duration-200 text-center menu-item"
              style="animation-delay: 0.3s"
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
/* Hamburger icon styles */
.hamburger-icon {
  width: 24px;
  height: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 2.5px;
  background-color: #374151;
  border-radius: 2px;
  transition: all 0.3s ease-in-out;
  transform-origin: center;
}

/* First line - rotates and moves down */
.hamburger-line:nth-child(1).open {
  transform: translateY(7.5px) rotate(45deg);
}

/* Second line - fades out */
.hamburger-line:nth-child(2).open {
  opacity: 0;
  transform: translateX(-10px);
}

/* Third line - rotates and moves up */
.hamburger-line:nth-child(3).open {
  transform: translateY(-7.5px) rotate(-45deg);
}

/* Mobile menu transition */
.mobile-menu-enter-active {
  animation: slideDown 3s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-menu-leave-active {
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateY(-15px) scale(0.95);
    max-height: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    max-height: 500px;
  }
}

@keyframes slideUp {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
    max-height: 500px;
  }
  100% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
    max-height: 0;
  }
}

/* Staggered menu items animation */
.mobile-menu-enter-active .menu-item {
  animation: fadeInSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}

@keyframes fadeInSlide {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hamburger-line {
    transition: none;
  }
  
  .mobile-menu-enter-active,
  .mobile-menu-leave-active {
    animation: none;
    transition: none;
  }
  
  .menu-item {
    animation: none !important;
  }
}
</style>