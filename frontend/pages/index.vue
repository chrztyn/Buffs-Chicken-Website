<template>
  <div class="min-h-screen bg-[#FBF4E5] overflow-x-hidden">
    <!-- Navigation Bar -->
    <Navbar />

    <!-- Hero Section -->
    <section class="w-full px-4 lg:px-8 py-12 lg:py-40 overflow-x-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">

          <!-- Hero Image - First on mobile, second on desktop -->
          <div class="flex-1 flex justify-center lg:justify-end items-center order-1 lg:order-2 mt-0 lg:mt-0">
            <div class="hero-main w-full max-w-xs lg:max-w-lg aspect-square overflow-visible relative">
              <img src="/hero-main.jpg" alt="Buffs Chicken" class="w-full h-full object-cover rounded-2xl lg:rounded-none" />
              <!-- Hero Fries Image -->
              <div class="hero-fries absolute top-[-0.5rem] lg:top-[-3rem] left-[-2rem] sm:left-[-3rem] lg:left-[-20rem] z-20">
                <img src="/hero-fries.png" alt="Buffs Fries" class="w-12 h-12 sm:w-14 sm:h-14 lg:w-130 lg:h-130 object-contain -rotate-3" />
              </div>
              <!-- Add Order Button -->
              <div class="add-order-button absolute top-[6rem] sm:top-[7rem] lg:top-[20rem] left-[-0.5rem] sm:left-[-1rem] lg:left-[-5rem] z-20 -rotate-3">
                <button class="bg-[#FE601C] text-[#1A4189] px-2 py-1 sm:px-3 sm:py-1.5 lg:px-8 lg:py-3 rounded-full shadow-xl font-['Unbounded'] w-14 h-7 sm:w-18 sm:h-8 lg:w-28 lg:h-12 text-[10px] sm:text-xs lg:text-sm hover:bg-[#e5551a] transition-colors">
                  Add <br/>Order
                </button>
              </div>
              <!-- Phrase Button -->
              <div class="add-order-button absolute top-[10rem] sm:top-[12rem] lg:top-[34rem] left-[-0.25rem] sm:left-[-0.5rem] lg:left-[-3rem] z-20 flex gap-1 sm:gap-1.5 lg:gap-4 flex-wrap">
                <button class="bg-[#FEB90E] text-[#FE601C] px-2 py-1 sm:px-3 sm:py-1.5 lg:px-8 lg:py-3 rounded-full shadow-xl font-['Unbounded'] w-12 h-5 sm:w-14 sm:h-6 lg:w-28 lg:h-8 text-[9px] sm:text-xs lg:text-sm">
                  Brined
                </button>
                <button class="bg-[#FEB90E] text-[#FE601C] px-2 py-1 sm:px-3 sm:py-1.5 lg:px-8 lg:py-3 rounded-full shadow-xl font-['Unbounded'] w-12 h-5 sm:w-14 sm:h-6 lg:w-28 lg:h-8 text-[9px] sm:text-xs lg:text-sm">
                  Spiced
                </button>
                <button class="bg-[#FEB90E] text-[#FE601C] px-2 py-1 sm:px-3 sm:py-1.5 lg:px-8 lg:py-3 rounded-full shadow-xl font-['Unbounded'] w-14 h-5 sm:w-16 sm:h-6 lg:w-28 lg:h-8 text-[9px] sm:text-xs lg:text-sm">
                  Next-Level
                </button>
              </div>
              <!-- Hero Pesto Image -->
              <div class="hero-pesto absolute top-24 sm:top-28 lg:top-60 right-[-2.5rem] sm:right-[-3rem] lg:right-[-16rem] z-20">
                <img src="/hero-pesto.png" alt="Buffs Pesto" class="w-12 h-12 sm:w-14 sm:h-14 lg:w-130 lg:h-130 object-contain -rotate-3 scale-x-[-1]" />
              </div>
              <!-- Hero Star Image -->
              <div class="hero-star absolute top-[-1rem] sm:top-[-1.5rem] lg:top-[-5rem] right-[-1rem] sm:right-[-1.25rem] lg:right-[-5rem] z-20">
                <img src="/hero-star.png" alt="Buffs Star" class="w-10 h-10 sm:w-12 sm:h-12 lg:w-38 lg:h-38 object-contain rotate-2" />
              </div>
            </div>
          </div>

          <!-- Text Content - Second on mobile, first on desktop -->
          <div class="text-content-container flex-1 max-w-xl lg:max-w-5xl space-y-6 relative order-2 lg:order-1">

            <!-- Hero Buffs Chicken Image -->
            <div class="hero-buffs-chicken absolute -top-48 lg:-top-120 left-[-13rem] z-10">
              <img src="/hero-buffs-chicken.png" alt="Buffs Chicken" class="w-72 h-72 lg:w-140 lg:h-140 object-contain" />
            </div>

            <!-- Main Heading -->
            <h1 class="font-['Caprasimo'] text-5xl sm:text-6xl lg:text-8xl text-[#1A4189] leading-tight">
              Buffs<br />Chicken
            </h1>
            
            <!-- Subheading -->
            <h2 class="font-['Unbounded'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FE601C] leading-tight">
              your go-to comfort
            </h2>
            
            <!-- Description Paragraph -->
            <p class="description-paragraph font-['Unbounded'] text-lg lg:text-xl text-gray-700 leading-relaxed w-full">
              Welcome to Buffs Chicken, your go-to spot at The Hood, Angeles City for the crispiest and juiciest chicken around. From signature OG Buffs wings to cheesy pastas and loaded combos, every meal is cooked fresh and packed with flavor.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
