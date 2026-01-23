<template>
  <nav class="sticky top-8 z-[100] py-6">
    <div class="w-full flex justify-center px-4">
      <div class="relative w-full max-w-[1000px]">
        <!-- Navbar Container -->
        <div class="bg-[#f8f8f8] rounded-full px-1 sm:px-4 lg:px-10 py-0 flex justify-between items-center relative shadow-md overflow-visible h-12 sm:h-18">
          
          <!-- Mobile/Tablet: Hamburger Menu Button (Left) -->
          <button 
            @click="menuOpen = !menuOpen"
            class="hamburger-btn flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <svg 
              class="w-6 h-6 text-black"
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

          <!-- Desktop: Left Navigation Links (hidden on mobile/tablet) -->
          <div class="hidden lg:flex items-center gap-2 sm:gap-6 lg:gap-14 flex-1 justify-start pl-2 sm:pl-8 ml-0 sm:ml-4">
            <NuxtLink to="/" class="font-['Unbounded'] font-normal text-[10px] sm:text-sm lg:text-16px text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] whitespace-nowrap">home</NuxtLink>
            <NuxtLink to="/blogs" class="font-['Unbounded'] font-normal text-[10px] sm:text-sm lg:text-16px text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] whitespace-nowrap">blogs</NuxtLink>
            <NuxtLink to="/menu" class="font-['Unbounded'] font-normal text-[10px] sm:text-sm lg:text-16px text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] whitespace-nowrap">menu</NuxtLink>
          </div>

          <!-- Spacer for logo -->
          <div class="w-10 h-10 sm:w-16 sm:h-16 lg:w-24 lg:h-24 flex-shrink-0"></div>

          <!-- Desktop: Right Navigation Links and Cart Button (hidden on mobile/tablet) -->
          <div class="hidden lg:flex items-center gap-2 sm:gap-6 lg:gap-14 flex-1 justify-end pr-2 sm:pr-0">
            <NuxtLink to="/about" class="font-['Unbounded'] font-normal text-[10px] sm:text-sm lg:text-16px text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] whitespace-nowrap">about</NuxtLink>
            <NuxtLink to="/contact" class="font-['Unbounded'] font-normal text-[10px] sm:text-sm lg:text-16px text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] whitespace-nowrap">contact</NuxtLink>
            <NuxtLink to="/cart" class="w-14 font-['Unbounded'] font-semibold text-[10px] sm:text-sm lg:text-16px bg-[#1A4189] text-[#FEB90E] border-none py-1.5 sm:py-2.5 px-3 sm:px-6 rounded-full cursor-pointer lowercase transition-all duration-200 hover:bg-[#15306d] hover:shadow-lg active:scale-95 whitespace-nowrap inline-block text-center">cart</NuxtLink>
          </div>

          <!-- Mobile/Tablet: Cart Button (Right) -->
          <NuxtLink 
            to="/cart" 
            class="cart-icon-mobile lg:hidden bg-[#1A4189] text-[#FEB90E] border-none p-2.5 rounded-full cursor-pointer transition-all duration-200 hover:bg-[#15306d] hover:shadow-lg active:scale-95 inline-flex items-center justify-center"
          >
            <svg 
              class="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </NuxtLink>
        </div>

        <!-- Center Logo -->
        <div class="absolute left-1/2 top-1/2 transform -translate-x-[60%] -translate-y-1/2 z-20">
          <NuxtLink to="/">
            <div class="w-10 h-10 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-[#1A4189] flex items-center justify-center shadow-xl overflow-hidden border-2 sm:border-4 border-white cursor-pointer hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Buff's Chicken Logo" class="w-full h-full object-contain p-1.5 sm:p-2" />
            </div>
          </NuxtLink>
        </div>

        <!-- Mobile/Tablet: Dropdown Menu -->
        <transition name="menu-slide">
          <div 
            v-if="menuOpen"
            class="mobile-menu absolute top-full left-0 right-0 mt-4 bg-[#f8f8f8] shadow-2xl overflow-hidden lg:hidden"
          >
            <div class="menu-open flex flex-col py-6 pr-6 pl-16 gap-4">
              <NuxtLink 
                to="/" 
                @click="menuOpen = false"
                class="font-['Unbounded'] font-normal text-base text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] py-3 px-4 hover:bg-gray-100 rounded-xl"
              >
                home
              </NuxtLink>
              <NuxtLink 
                to="/blogs" 
                @click="menuOpen = false"
                class="font-['Unbounded'] font-normal text-base text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] py-3 px-4 hover:bg-gray-100 rounded-xl"
              >
                blogs
              </NuxtLink>
              <NuxtLink 
                to="/menu" 
                @click="menuOpen = false"
                class="font-['Unbounded'] font-normal text-base text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] py-3 px-4 hover:bg-gray-100 rounded-xl"
              >
                menu
              </NuxtLink>
              <NuxtLink 
                to="/about" 
                @click="menuOpen = false"
                class="font-['Unbounded'] font-normal text-base text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] py-3 px-4 hover:bg-gray-100 rounded-xl"
              >
                about
              </NuxtLink>
              <NuxtLink 
                to="/contact" 
                @click="menuOpen = false"
                class="font-['Unbounded'] font-normal text-base text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] py-3 px-4 hover:bg-gray-100 rounded-xl"
              >
                contact
              </NuxtLink>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
</script>

<style scoped>
/* Menu slide animation */
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: all 0.3s ease;
}

.menu-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
