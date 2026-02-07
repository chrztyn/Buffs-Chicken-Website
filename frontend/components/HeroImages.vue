<template>
    <div class="flex-1 flex justify-center lg:justify-end items-center order-1 lg:order-2 mt-20 sm:mt-16 md:mt-12 lg:mt-0 lg:!mt-0 max-[1023px]:mb-0 max-[1023px]:!w-full max-[1023px]:px-4 max-[639px]:mb-0 max-[639px]:!mx-auto max-[639px]:!w-full max-h-[600px]:mt-2 max-h-[600px]:scale-75 max-h-[600px]:origin-top-right">
        <div class="hero-main w-full max-w-xs sm:max-w-sm md:max-w-md max-[1023px]:max-w-lg lg:max-w-lg aspect-square overflow-visible relative lg:!-mt-[12rem] lg:!translate-x-2 md:-mt-0 md:translate-x-0 md:mb-0 md:mx-auto max-[1023px]:!z-20 max-[1023px]:mx-auto max-[639px]:mx-auto max-[639px]:flex max-[639px]:justify-center max-[639px]:items-center max-[639px]:mb-0 max-[639px]:!z-20 max-[639px]:-mt-[6rem]">
        
        <!-- Main Chicken Image -->
        <img 
        src="/hero-main.jpg" 
        alt="Buffs Chicken" 
        class="hero-chicken-img w-80 sm:w-96 md:w-[620px] max-[1023px]:w-[480px] lg:w-110 h-80 sm:h-96 md:h-100 max-[1023px]:h-[480px] lg:h-110 object-cover rounded-2xl lg:rounded-none shadow-lg md:shadow-xl lg:shadow-none !max-h-[620px]:hidden md:scale-110 md:origin-top lg:top-0 lg:scale-100 lg:origin-center" 
    />
        
        <!-- Hero Fries Image -->
        <div class="hero-fries absolute top-[-8rem] sm:top-[3rem] md:top-[-5rem] max-[1023px]:top-[-4rem] lg:top-[-5rem] left-[-8rem] sm:left-[-3.5rem] md:left-[-14rem] max-[1023px]:left-[-10rem] lg:left-[-16rem] z-20 drop-shadow-lg md:drop-shadow-xl">
            <img 
        src="/hero-fries.png" 
        alt="Buffs Fries" 
        class="w-80 sm:w-96 md:w-[500px] max-[1023px]:w-[400px] lg:w-110 h-80 sm:h-96 md:h-[500px] max-[1023px]:h-[400px] lg:h-110 object-contain -rotate-3"
        />
        </div>
        
        <!-- Add Order Button -->
        <div class="add-order-button absolute top-[6rem] sm:top-[10rem] md:top-[18rem] max-[1023px]:top-[12rem] lg:top-[15rem] left-[-0.5rem] sm:left-[-1rem] md:left-[-2rem] max-[1023px]:left-[-1.5rem] lg:left-[-5rem] z-20 -rotate-3 md:rotate-[-4deg] lg:rotate-[-3deg]">
            <NuxtLink to="/menu" class="inline-block bg-[#FE601C] text-[#1A4189] px-3 sm:px-4 md:px-4 max-[1023px]:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2 max-[1023px]:py-2 lg:py-2.5 rounded-full shadow-md hover:shadow-lg font-['Unbounded'] font-semibold text-xs sm:text-sm md:text-sm max-[1023px]:text-sm lg:text-base transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap">
                Add Order
            </NuxtLink>
        </div>
        
        <!-- Phrase Buttons -->
        <div class="phrase-button absolute top-[10rem] sm:top-[2rem] md:top-[23rem] max-[1023px]:top-[18rem] lg:top-[29rem] left-[-0.25rem] sm:left-[-0.5rem] md:left-[-1rem] max-[1023px]:left-[-0.75rem] lg:left-[-3rem] z-20 flex gap-1.5 sm:gap-2 md:gap-2 max-[1023px]:gap-2 lg:gap-2.5 flex-wrap">
            <button class="bg-[#FEB90E] text-[#FE601C] px-2.5 sm:px-3 md:px-3 max-[1023px]:px-3 lg:px-4 py-1 sm:py-1.5 md:py-1.5 max-[1023px]:py-1.5 lg:py-2 rounded-full shadow-md hover:shadow-lg font-['Unbounded'] font-semibold text-[10px] sm:text-xs md:text-xs max-[1023px]:text-xs lg:text-sm transition-all duration-200 hover:scale-105 active:scale-95">
                Brined
            </button>
            <button class="bg-[#FEB90E] text-[#FE601C] px-2.5 sm:px-3 md:px-3 max-[1023px]:px-3 lg:px-4 py-1 sm:py-1.5 md:py-1.5 max-[1023px]:py-1.5 lg:py-2 rounded-full shadow-md hover:shadow-lg font-['Unbounded'] font-semibold text-[10px] sm:text-xs md:text-xs max-[1023px]:text-xs lg:text-sm transition-all duration-200 hover:scale-105 active:scale-95">
                Spiced
            </button>
            <button class="bg-[#FEB90E] text-[#FE601C] px-2.5 sm:px-3 md:px-3 max-[1023px]:px-3 lg:px-4 py-1 sm:py-1.5 md:py-1.5 max-[1023px]:py-1.5 lg:py-2 rounded-full shadow-md hover:shadow-lg font-['Unbounded'] font-semibold text-[10px] sm:text-xs md:text-xs max-[1023px]:text-xs lg:text-sm transition-all duration-200 hover:scale-105 active:scale-95">
                Next-Level
            </button>
        </div>
        
        <!-- Hero Pesto Image -->
        <div class="hero-pesto absolute top-[3rem] sm:top-[3rem] md:top-[6rem] max-[1023px]:top-[6rem] lg:top-[14rem] right-[-10rem] sm:right-[-3.5rem] md:right-[-14rem] max-[1023px]:right-[-10rem] lg:right-[-10rem] z-20 drop-shadow-lg md:drop-shadow-xl">
            <img 
        src="/hero-pesto.png" 
        alt="Buffs Pesto" 
        class="w-80 sm:w-96 md:w-[500px] max-[1023px]:w-[400px] lg:w-110 h-80 sm:h-96 md:h-[500px] max-[1023px]:h-[400px] lg:h-110 object-contain -rotate-3"
        />
        </div>
        
        <!-- Hero Star Image -->
        <div class="hero-star absolute top-[-1rem] sm:top-[-1.5rem] md:top-[-2rem] max-[1023px]:top-[-1.5rem] lg:top-[-4rem] right-[-1rem] sm:right-[-1rem] md:right-[-1.5rem] max-[1023px]:right-[-1rem] lg:right-[-0.5rem] z-20 drop-shadow-lg md:drop-shadow-xl">
            <img 
        src="/hero-star.png" 
        alt="Buffs Star" 
        class="w-10 sm:w-12 md:w-16 max-[1023px]:w-14 lg:w-34 h-10 sm:h-12 md:h-16 max-[1023px]:h-14 lg:h-34 object-contain rotate-2" 
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
    @media (min-width: 640px) and (max-width: 767px) {
  .hero-fries {
    top: -10rem;
    left: -10rem;
  }

  .phrase-button {
    top: 20rem;
    left: -2rem;
  }

  .add-order-button {
    top: 8rem;
    left: -2rem;
  }

  .hero-pesto{
    top: 8rem;
    right: -13rem;
  }
}
    </style>