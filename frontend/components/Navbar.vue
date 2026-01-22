<template>
  <nav class="sticky top-8 z-[100] py-6">
    <div class="w-full flex justify-center px-4">
      <div class="relative w-full max-w-[1000px]">
        <!-- Navbar Container with rounded ends -->
        <div class="bg-[#f8f8f8] rounded-full px-1 sm:px-4 lg:px-10 py-0 flex justify-between items-center relative shadow-md overflow-hidden h-12 w-250 sm:h-18">
          <!-- Left Navigation Links -->
          <div class="flex items-center gap-2 sm:gap-6 lg:gap-12 flex-1 justify-start pl-2 sm:pl-8 ml-0 sm:ml-4">
            <NuxtLink to="/" class="font-['Unbounded'] font-normal text-[10px] sm:text-sm lg:text-16px text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] whitespace-nowrap">home</NuxtLink>
            <a href="#blogs" class="font-['Unbounded'] font-normal text-[10px] sm:text-sm lg:text-16px text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] whitespace-nowrap">blogs</a>
            <a href="#menu" class="font-['Unbounded'] font-normal text-[10px] sm:text-sm lg:text-16px text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] whitespace-nowrap">menu</a>
          </div>

          <!-- Spacer for logo -->
          <div class="w-10 h-10 sm:w-16 sm:h-16 lg:w-24 lg:h-24 flex-shrink-0"></div>

          <!-- Right Navigation Links and Cart Button -->
          <div class="flex items-center gap-2 sm:gap-6 lg:gap-12 flex-1 justify-end pr-2 sm:pr-0">
            <a href="#about" class="font-['Unbounded'] font-normal text-[10px] sm:text-sm lg:text-16px text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] whitespace-nowrap">about</a>
            <a href="#contact" class="font-['Unbounded'] font-normal text-[10px] sm:text-sm lg:text-16px text-black no-underline lowercase transition-colors duration-200 hover:text-[#FE601C] whitespace-nowrap">contact</a>
            <button class="w-14 font-['Unbounded'] font-semibold text-[10px] sm:text-sm lg:text-16px bg-[#1A4189] text-[#FEB90E] border-none py-1.5 sm:py-2.5 px-3 sm:px-6 rounded-full cursor-pointer lowercase transition-all duration-200 hover:bg-[#15306d] hover:shadow-lg active:scale-95 whitespace-nowrap">cart</button>
          </div>
        </div>

        <!-- Center Logo  -->
        <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div class="w-10 h-10 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-[#1A4189] flex items-center justify-center shadow-xl overflow-hidden border-2 sm:border-4 border-white">
            <img src="/logo.jpg" alt="Buff's Chicken Logo" class="w-full h-full object-contain p-1.5 sm:p-2" />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

