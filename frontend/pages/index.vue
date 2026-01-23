<template>
  <NuxtLayout>
    <div class="min-h-screen bg-[#FBF4E5] overflow-x-hidden max-w-[100vw]">
      <!-- Navigation Bar -->
      <Navbar />

    <!-- Hero Section -->
    <section class="w-full h-[calc(100vh-7rem)] px-4 lg:px-8 py-12 lg:py-40 overflow-x-hidden overflow-y-hidden flex flex-col justify-center max-w-[100vw] !p-0 lg:!pt-[300px] lg:!pl-[100px] max-[1023px]:!p-[1.5rem_2rem] max-[1023px]:!pb-12 max-[1023px]:!pt-8 max-[639px]:!p-4 max-[639px]:!pb-10 max-[639px]:!pt-12">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4 max-[1023px]:gap-0.5 max-[639px]:gap-0.5 lg:gap-4">

          <!-- Hero Image - First on mobile, second on desktop -->
          <div class="flex-1 flex justify-center lg:justify-end items-center order-1 lg:order-2 mt-20 lg:mt-0 lg:!mt-0 max-[1023px]:mb-0 max-[1023px]:!mt-8 max-[1023px]:!w-full max-[639px]:mb-0 max-[639px]:!mt-8 max-[639px]:!mx-auto max-[639px]:!w-full">
            <div class="hero-main w-full max-w-xs lg:max-w-lg aspect-square overflow-visible relative lg:!-mt-[12rem] lg:!translate-x-2 max-[1023px]:-mt-0 max-[1023px]:translate-x-0 max-[1023px]:mb-0 max-[1023px]:!z-20 max-[1023px]:!mx-auto max-[639px]:mx-auto max-[639px]:flex max-[639px]:justify-center max-[639px]:items-center max-[639px]:mb-0 max-[639px]:!z-20 max-[639px]:-mt-[6rem]">
              <img src="/hero-main.jpg" alt="Buffs Chicken" class="w-110 h-110 object-cover rounded-2xl lg:rounded-none max-[1023px]:!max-w-[580px] max-[1023px]:!shadow-[0_25px_50px_rgba(26,65,137,0.18)] max-[639px]:!max-w-[320px] max-[639px]:!shadow-[0_20px_40px_rgba(26,65,137,0.15)]" />
              <!-- Hero Fries Image -->
              <div class="hero-fries absolute top-[-0.5rem] lg:top-[-5rem] left-[-2rem] sm:left-[-3rem] lg:left-[-16rem] z-20 max-[1023px]:drop-shadow-[0_6px_16px_rgba(0,0,0,0.12)] max-[639px]:drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-[1023px]:top-[0.5rem] max-[1023px]:left-[-1.5rem] max-[639px]:top-[0.25rem] max-[639px]:left-[-1rem]">
                <img src="/hero-fries.png" alt="Buffs Fries" class="w-12 h-12 sm:w-14 sm:h-14 lg:w-110 lg:h-110 object-contain -rotate-3 max-[1023px]:!w-[clamp(70px,16vw,100px)] max-[1023px]:!h-auto max-[639px]:!w-[clamp(50px,14vw,70px)] max-[639px]:!h-auto" />
              </div>
              <!-- Add Order Button -->
              <div class="add-order-button absolute top-[6rem] sm:top-[7rem] lg:top-[15rem] left-[-0.5rem] sm:left-[-1rem] lg:left-[-5rem] z-20 -rotate-3 max-[1023px]:top-[6rem] max-[1023px]:left-[-0.75rem] max-[1023px]:rotate-[-4deg] max-[639px]:top-[5.5rem] max-[639px]:left-[-0.25rem] max-[639px]:rotate-[-3deg]">
                <button class="bg-[#FE601C] text-[#1A4189] px-2 py-1 sm:px-3 sm:py-1.5 lg:px-8 lg:py-3 rounded-full shadow-xl font-['Unbounded'] w-14 h-7 sm:w-14 sm:h-8 lg:w-24 lg:h-12 text-[6px] sm:text-xs lg:text-sm 
                  max-[1023px]:w-28 max-[1023px]:h-14
                  max-[639px]:w-14 max-[639px]:h-7">
                  Add <br/>Order
                </button>

              </div>
              <!-- Phrase Button -->
              <div class="add-order-button absolute top-[10rem] sm:top-[12rem] lg:top-[29rem] left-[-0.25rem] sm:left-[-0.5rem] lg:left-[-3rem] z-20 flex gap-1 sm:gap-1.5 lg:gap-4 flex-wrap max-[1023px]:top-[9.5rem] max-[1023px]:left-[-0.5rem] max-[1023px]:gap-1.25 max-[1023px]:flex-wrap max-[639px]:top-[8.5rem] max-[639px]:left-[-0.125rem] max-[639px]:gap-0.75">
                <button class="bg-[#FEB90E] text-[#FE601C] px-2 py-1 sm:px-3 sm:py-1.5 lg:px-8 lg:py-3 rounded-full shadow-xl font-['Unbounded'] w-12 h-5 sm:w-14 sm:h-6 lg:w-28 lg:h-8 text-[9px] sm:text-xs lg:text-sm max-[1023px]:font-semibold max-[1023px]:tracking-[0.02em] max-[1023px]:shadow-[0_4px_12px_rgba(0,0,0,0.15)] max-[1023px]:hover:translate-y-[-2px] max-[1023px]:hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] max-[639px]:font-semibold max-[639px]:tracking-[0.02em] max-[639px]:active:scale-95 max-[1023px]:w-16 max-[1023px]:h-7 max-[1023px]:text-[8px] max-[639px]:w-12 max-[639px]:h-5 max-[639px]:text-[7px]">
                  Brined
                </button>
                <button class="bg-[#FEB90E] text-[#FE601C] px-2 py-1 sm:px-3 sm:py-1.5 lg:px-8 lg:py-3 rounded-full shadow-xl font-['Unbounded'] w-12 h-5 sm:w-14 sm:h-6 lg:w-28 lg:h-8 text-[9px] sm:text-xs lg:text-sm max-[1023px]:font-semibold max-[1023px]:tracking-[0.02em] max-[1023px]:shadow-[0_4px_12px_rgba(0,0,0,0.15)] max-[1023px]:hover:translate-y-[-2px] max-[1023px]:hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] max-[639px]:font-semibold max-[639px]:tracking-[0.02em] max-[639px]:active:scale-95 max-[1023px]:w-16 max-[1023px]:h-7 max-[1023px]:text-[8px] max-[639px]:w-12 max-[639px]:h-5 max-[639px]:text-[7px]">
                  Spiced
                </button>
                <button class="bg-[#FEB90E] text-[#FE601C] px-2 py-1 sm:px-3 sm:py-1.5 lg:px-8 lg:py-3 rounded-full shadow-xl font-['Unbounded'] w-14 h-5 sm:w-16 sm:h-6 lg:w-28 lg:h-8 text-[9px] sm:text-xs lg:text-sm max-[1023px]:font-semibold max-[1023px]:tracking-[0.02em] max-[1023px]:shadow-[0_4px_12px_rgba(0,0,0,0.15)] max-[1023px]:hover:translate-y-[-2px] max-[1023px]:hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] max-[639px]:font-semibold max-[639px]:tracking-[0.02em] max-[639px]:active:scale-95 max-[1023px]:w-20 max-[1023px]:h-7 max-[1023px]:text-[8px] max-[639px]:w-16 max-[639px]:h-5 max-[639px]:text-[7px]">
                  Next-Level
                </button>
              </div>
              <!-- Hero Pesto Image -->
              <div class="hero-pesto absolute top-24 sm:top-32 lg:top-60 right-[-2.5rem] sm:right-[-3rem] lg:right-[-9rem] z-20 max-[1023px]:drop-shadow-[0_6px_16px_rgba(0,0,0,0.12)] max-[639px]:drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-[1023px]:bottom-[2rem] max-[1023px]:top-auto max-[1023px]:right-[-0.75rem] max-[639px]:bottom-[75px] max-[639px]:top-auto max-[639px]:right-[1rem]">
                <img src="/hero-pesto.png" alt="Buffs Pesto" class="w-12 h-12 sm:w-14 sm:h-14 lg:w-110 lg:h-110 object-contain -rotate-3 scale-x-[-1] max-[1023px]:!w-[clamp(70px,16vw,100px)] max-[1023px]:!h-auto max-[639px]:!w-[clamp(50px,14vw,70px)] max-[639px]:!h-auto" />
              </div>
              <!-- Hero Star Image -->
              <div class="hero-star absolute top-[-1rem] sm:top-[-1.5rem] lg:top-[-4rem] right-[-1rem] sm:right-[-1rem] lg:right-[-0.5rem] z-20 max-[1023px]:drop-shadow-[0_6px_16px_rgba(0,0,0,0.12)] max-[639px]:drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-[1023px]:top-[0.5rem] max-[1023px]:right-[0.5rem] max-[639px]:top-[0.25rem] max-[639px]:right-[0.25rem]">
                <img src="/hero-star.png" alt="Buffs Star" class="w-10 h-10 sm:w-12 sm:h-12 lg:w-34 lg:h-34 object-contain rotate-2 max-[1023px]:!w-[clamp(60px,14vw,80px)] max-[1023px]:!h-auto max-[639px]:!w-[clamp(45px,12vw,60px)] max-[639px]:!h-auto" />
              </div>
            </div>
          </div>

          <div class="text-content-container flex-1 max-w-xl lg:max-w-5xl space-y-6 relative order-2 lg:order-1 [&>*+*]:!mt-2 max-[639px]:[&>*+*]:!mt-6 lg:!mt-40 max-[1023px]:!-mt-[14rem] max-[1023px]:!z-40 max-[639px]:!-mt-[8rem] max-[639px]:!z-30">


            <!-- Hero Buffs Chicken Image -->
            <div class="hero-buffs-chicken absolute -top-32 lg:-top-93 left-[-12rem] z-10 lg:!block lg:!opacity-100 lg:!visible max-[1023px]:!hidden">
              <img src="/hero-buffs-chicken.png" alt="Buffs Chicken" class="w-50 h-50 lg:w-115 lg:h-115 object-contain max-[1023px]:!w-[clamp(200px,32vw,300px)] max-[1023px]:!h-auto" />
            </div>

            <!-- Main Heading -->
            <h1 class="font-['Caprasimo'] text-5xl sm:text-5xl lg:text-7xl text-[#1A4189] leading-tight !leading-none max-[1023px]:!text-[clamp(3.5rem,10vw,4.5rem)] max-[1023px]:!leading-[1.05] max-[1023px]:tracking-[-0.02em] max-[1023px]:!z-41 max-[1023px]:!relative max-[639px]:!text-[3.75rem] max-[639px]:!z-31 max-[639px]:!relative">
              Buffs<br />Chicken
            </h1>
            
            <!-- Subheading -->
            <h2 class="font-['Unbounded'] text-2xl sm:text-2xl lg:text-3xl font-bold text-[#FE601C] leading-tight max-[1023px]:!text-[1.75rem] max-[1023px]:!font-bold max-[1023px]:!mb-4 max-[1023px]:!mt-0 max-[1023px]:!z-41 max-[1023px]:!relative max-[639px]:!text-[1.75rem] max-[639px]:!mb-5 max-[639px]:!mt-1 max-[639px]:!z-31 max-[639px]:!relative">
              your go-to comfort
            </h2>
            
            <!-- Description Paragraph -->
            <p class="description-paragraph font-['Unbounded'] text-xs lg:text-sm text-gray-500 leading-relaxed w-full max-w-full max-[1023px]:!text-[0.95rem] max-[1023px]:!leading-[1.7] max-[1023px]:!text-[#4B5563] max-[1023px]:!pb-2 max-[1023px]:!font-normal max-[1023px]:!mt-0 max-[1023px]:!z-41 max-[1023px]:!relative max-[639px]:!text-[0.95rem] max-[639px]:!leading-[1.7] max-[639px]:!text-[#4B5563] max-[639px]:!pb-1 max-[639px]:!font-normal max-[639px]:!mt-0 max-[639px]:!z-31 max-[639px]:!relative">
              Welcome to Buffs Chicken, your go-to spot at The Hood, Angeles City for the crispiest and juiciest chicken around. From signature OG Buffs wings to cheesy pastas and loaded combos, every meal is cooked fresh and packed with flavor.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Picks Section -->
    <PopularPicks />

    <!-- Blog Section -->
    <h2 class="blog-title text-3xl md:text-4xl lg:text-5xl text-[#2B5B9E] mb-12 font-['Unbounded'] px-4">
                The latest from Buffs
    </h2>
    <Blog />

    <!-- FAQ Section -->
    <FAQ />

    <!-- Footer Section -->
    <Footer />

  </div>
</NuxtLayout>    
</template>

<script>
import Blog from '~/components/Blog.vue';
import FAQ from '~/components/FAQ.vue';
import Footer from '~/components/Footer.vue';
import Navbar from '~/components/Navbar.vue';
import PopularPicks from '~/components/PopularPicks.vue';

export default {
  components: {
    Navbar,
    PopularPicks,
    Blog,
    FAQ,
    Footer
  }
};
</script>

<style scoped>
/* Keep only the global overflow fixes that can't be done with Tailwind */
html,
body,
#__nuxt {
  overflow-x: hidden !important;
  max-width: 100vw !important;
}
</style>