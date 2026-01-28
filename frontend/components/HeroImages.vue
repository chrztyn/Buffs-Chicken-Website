<template>
    <div class="flex-1 flex justify-center lg:justify-end items-center order-1 lg:order-2 mt-20 sm:mt-16 md:mt-12 lg:mt-0 lg:!mt-0 max-[1023px]:mb-0 max-[1023px]:!w-full max-[639px]:mb-0 max-[639px]:!mx-auto max-[639px]:!w-full">
        <div class="hero-main w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square overflow-visible relative lg:!-mt-[12rem] lg:!translate-x-2 md:-mt-0 md:translate-x-0 md:mb-0 md:mx-auto max-[1023px]:!z-20 max-[639px]:mx-auto max-[639px]:flex max-[639px]:justify-center max-[639px]:items-center max-[639px]:mb-0 max-[639px]:!z-20 max-[639px]:-mt-[6rem]">
        
        <!-- Main Chicken Image -->
        <NuxtImg 
            src="/hero-main.jpg" 
            alt="Buffs Chicken" 
            class="w-80 sm:w-96 md:w-[620px] lg:w-110 h-80 sm:h-96 md:h-[620px] lg:h-110 object-cover rounded-2xl lg:rounded-none shadow-lg md:shadow-xl lg:shadow-none" 
        />
        
        <!-- Hero Fries Image -->
        <div class="hero-fries absolute top-[-8rem] sm:top-[3rem] md:top-[-6rem] lg:top-[-5rem] left-[-8rem] sm:left-[-3.5rem] md:left-[-14rem] lg:left-[-16rem] z-20 drop-shadow-lg md:drop-shadow-xl">
            <NuxtImg 
            src="/hero-fries.png" 
            alt="Buffs Fries" 
            class="w-80 sm:w-96 md:w-[500px] lg:w-110 h-80 sm:h-96 md:h-[500px] lg:h-110 object-contain -rotate-3"
            />
        </div>
        
        <!-- Add Order Button -->
        <div class="add-order-button absolute top-[6rem] sm:top-[7rem] md:top-[16rem] lg:top-[15rem] left-[-0.5rem] sm:left-[-1rem] md:left-[-2rem] lg:left-[-5rem] z-20 -rotate-3 md:rotate-[-4deg] lg:rotate-[-3deg]">
            <NuxtLink to="/menu" class="inline-block bg-[#FE601C] text-[#1A4189] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2 lg:py-2.5 rounded-full shadow-md hover:shadow-lg font-['Unbounded'] font-semibold text-xs sm:text-sm md:text-sm lg:text-base transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap">
                Add Order
            </NuxtLink>
        </div>
        
        <!-- Phrase Buttons -->
        <div class="add-order-button absolute top-[10rem] sm:top-[12rem] md:top-[24rem] lg:top-[29rem] left-[-0.25rem] sm:left-[-0.5rem] md:left-[-1rem] lg:left-[-3rem] z-20 flex gap-1.5 sm:gap-2 md:gap-2 lg:gap-2.5 flex-wrap">
            <button class="bg-[#FEB90E] text-[#FE601C] px-2.5 sm:px-3 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-1.5 lg:py-2 rounded-full shadow-md hover:shadow-lg font-['Unbounded'] font-semibold text-[10px] sm:text-xs md:text-xs lg:text-sm transition-all duration-200 hover:scale-105 active:scale-95">
                Brined
            </button>
            <button class="bg-[#FEB90E] text-[#FE601C] px-2.5 sm:px-3 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-1.5 lg:py-2 rounded-full shadow-md hover:shadow-lg font-['Unbounded'] font-semibold text-[10px] sm:text-xs md:text-xs lg:text-sm transition-all duration-200 hover:scale-105 active:scale-95">
                Spiced
            </button>
            <button class="bg-[#FEB90E] text-[#FE601C] px-2.5 sm:px-3 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-1.5 lg:py-2 rounded-full shadow-md hover:shadow-lg font-['Unbounded'] font-semibold text-[10px] sm:text-xs md:text-xs lg:text-sm transition-all duration-200 hover:scale-105 active:scale-95">
                Next-Level
            </button>
        </div>
        
        <!-- Hero Pesto Image -->
        <div class="hero-pesto absolute top-[3rem] sm:top-[3rem] md:top-[8rem] lg:top-[14rem] right-[-10rem] sm:right-[-3.5rem] md:right-[-14rem] lg:right-[-10rem] z-20 drop-shadow-lg md:drop-shadow-xl">
            <NuxtImg 
            src="/hero-pesto.png" 
            class="w-80 sm:w-96 md:w-[500px] lg:w-110 h-80 sm:h-96 md:h-[500px] lg:h-110 object-contain -rotate-3"
            />
        </div>
        
        <!-- Hero Star Image -->
        <div class="hero-star absolute top-[-1rem] sm:top-[-1.5rem] md:top-[-2rem] lg:top-[-4rem] right-[-1rem] sm:right-[-1rem] md:right-[-1.5rem] lg:right-[-0.5rem] z-20 drop-shadow-lg md:drop-shadow-xl">
            <NuxtImg 
            src="/hero-star.png" 
            alt="Buffs Star" 
            class="w-10 sm:w-12 md:w-16 lg:w-34 h-10 sm:h-12 md:h-16 lg:h-34 object-contain rotate-2" 
            />
        </div>
        </div>
    </div>
</template>

    <script>
    export default {
    name: 'HeroImages'
    };
    </script>

    <style scoped>
    /* Component-specific styles if needed */
    </style>