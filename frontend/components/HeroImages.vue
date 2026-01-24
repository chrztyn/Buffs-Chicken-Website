<template>
    <div class="flex-1 flex justify-center lg:justify-end items-center order-1 lg:order-2 mt-20 lg:mt-0 lg:!mt-0 max-[1023px]:mb-0 max-[1023px]:!mt-8 max-[1023px]:!w-full max-[639px]:mb-0 max-[639px]:!mt-8 max-[639px]:!mx-auto max-[639px]:!w-full">
        <div class="hero-main w-full max-w-xs lg:max-w-lg aspect-square overflow-visible relative lg:!-mt-[12rem] lg:!translate-x-2 max-[1023px]:-mt-0 max-[1023px]:translate-x-0 max-[1023px]:mb-0 max-[1023px]:!z-20 max-[1023px]:!mx-auto max-[639px]:mx-auto max-[639px]:flex max-[639px]:justify-center max-[639px]:items-center max-[639px]:mb-0 max-[639px]:!z-20 max-[639px]:-mt-[6rem]">
        
        <!-- Main Chicken Image -->
        <img 
            src="/hero-main.jpg" 
            alt="Buffs Chicken" 
            class="w-110 h-110 object-cover rounded-2xl lg:rounded-none max-[1023px]:!max-w-[580px] max-[1023px]:!shadow-[0_25px_50px_rgba(26,65,137,0.18)] max-[639px]:!max-w-[320px] max-[639px]:!shadow-[0_20px_40px_rgba(26,65,137,0.15)]" 
        />
        
        <!-- Hero Fries Image -->
        <div class="hero-fries absolute top-[-0.5rem] lg:top-[-5rem] left-[-2rem] sm:left-[-3rem] lg:left-[-16rem] z-20 max-[1023px]:drop-shadow-[0_6px_16px_rgba(0,0,0,0.12)] max-[639px]:drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-[1023px]:top-[0.5rem] max-[1023px]:left-[-1.5rem] max-[639px]:top-[0.25rem] max-[639px]:left-[-1rem]">
            <img 
            src="/hero-fries.png" 
            alt="Buffs Fries" 
            class="w-12 h-12 sm:w-14 sm:h-14 lg:w-110 lg:h-110 object-contain -rotate-3 max-[1023px]:!w-[clamp(70px,16vw,100px)] max-[1023px]:!h-auto max-[639px]:!w-[clamp(50px,14vw,70px)] max-[639px]:!h-auto" 
            />
        </div>
        
        <!-- Add Order Button -->
        <div class="add-order-button absolute top-[6rem] sm:top-[7rem] lg:top-[15rem] left-[-0.5rem] sm:left-[-1rem] lg:left-[-5rem] z-20 -rotate-3 max-[1023px]:top-[6rem] max-[1023px]:left-[-0.75rem] max-[1023px]:rotate-[-4deg] max-[639px]:top-[5.5rem] max-[639px]:left-[-0.25rem] max-[639px]:rotate-[-3deg]">
            <button class="bg-[#FE601C] text-[#1A4189]
            px-2 py-1 sm:px-3 sm:py-1.5 lg:px-8 lg:py-3
            rounded-full shadow-xl font-['Unbounded']
            w-14 h-7
            md:w-20 md:h-9
            lg:w-24 lg:h-12
            text-[6px] sm:text-xs lg:text-sm">
            Add <br/>Order
            </button>
        </div>
        
        <!-- Phrase Buttons -->
        <div class="add-order-button absolute top-[10rem] sm:top-[12rem] lg:top-[29rem] left-[-0.25rem] sm:left-[-0.5rem] lg:left-[-3rem] z-20 flex gap-1 sm:gap-1.5 lg:gap-4 flex-wrap max-[1023px]:top-[9.5rem] max-[1023px]:left-[-0.5rem] max-[1023px]:gap-1.25 max-[1023px]:flex-wrap max-[639px]:top-[8.5rem] max-[639px]:left-[-0.125rem] max-[639px]:gap-0.75">
            <button class="bg-[#FEB90E] text-[#FE601C] px-2 py-1 sm:px-3 sm:py-1.5 lg:px-8 lg:py-3 rounded-full shadow-xl font-['Unbounded']
            w-10 h-5 md:w-20 md:h-7 lg:w-28 lg:h-8 text-[7px] md:text-[8px] lg:text-sm">
            Brined
            </button>
            <button class="bg-[#FEB90E] text-[#FE601C] px-2 py-1 sm:px-3 sm:py-1.5 lg:px-8 lg:py-3 rounded-full shadow-xl font-['Unbounded']
            w-12 h-5 md:w-22 md:h-7 lg:w-28 lg:h-8 text-[7px] md:text-[8px] lg:text-sm">
            Spiced
            </button>
            <button class="bg-[#FEB90E] text-[#FE601C] px-2 py-1 sm:px-3 sm:py-1.5 lg:px-8 lg:py-3 rounded-full shadow-xl font-['Unbounded']
            w-14 h-5 md:w-26 md:h-7 lg:w-28 lg:h-8 text-[7px] md:text-[8px] lg:text-sm">
            Next-Level
            </button>
        </div>
        
        <!-- Hero Pesto Image -->
        <div class="hero-pesto absolute top-24 sm:top-32 lg:top-60 right-[-2.5rem] sm:right-[-3rem] lg:right-[-9rem] z-20 max-[1023px]:drop-shadow-[0_6px_16px_rgba(0,0,0,0.12)] max-[639px]:drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-[1023px]:bottom-[2rem] max-[1023px]:top-auto max-[1023px]:right-[-0.75rem] max-[639px]:bottom-[75px] max-[639px]:top-auto max-[639px]:right-[1rem]">
            <img 
            src="/hero-pesto.png" 
            alt="Buffs Pesto" 
            class="w-12 h-12 sm:w-14 sm:h-14 lg:w-110 lg:h-110 object-contain -rotate-3 scale-x-[-1] max-[1023px]:!w-[clamp(70px,16vw,100px)] max-[1023px]:!h-auto max-[639px]:!w-[clamp(50px,14vw,70px)] max-[639px]:!h-auto" 
            />
        </div>
        
        <!-- Hero Star Image -->
        <div class="hero-star absolute top-[-1rem] sm:top-[-1.5rem] lg:top-[-4rem] right-[-1rem] sm:right-[-1rem] lg:right-[-0.5rem] z-20 max-[1023px]:drop-shadow-[0_6px_16px_rgba(0,0,0,0.12)] max-[639px]:drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-[1023px]:top-[0.5rem] max-[1023px]:right-[0.5rem] max-[639px]:top-[0.25rem] max-[639px]:right-[0.25rem]">
            <img 
            src="/hero-star.png" 
            alt="Buffs Star" 
            class="w-10 h-10 sm:w-12 sm:h-12 lg:w-34 lg:h-34 object-contain rotate-2 max-[1023px]:!w-[clamp(60px,14vw,80px)] max-[1023px]:!h-auto max-[639px]:!w-[clamp(45px,12vw,60px)] max-[639px]:!h-auto" 
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