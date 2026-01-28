<template>
  <NuxtLayout>
    <div class="min-h-screen bg-[#FBF4E5] overflow-x-hidden max-w-[100vw]">
      <!-- Navigation Bar -->
      <Navbar />

    <!-- Hero Section -->
    <section class="w-full h-[calc(100vh-7rem)] px-4 lg:px-8 py-12 lg:py-40 overflow-x-hidden overflow-y-hidden flex flex-col justify-center max-w-[100vw] !p-0 lg:!pt-[300px] lg:!pl-[100px] max-[1023px]:!p-[1.5rem_2rem] max-[1023px]:!pb-8 max-[1023px]:!pt-16 max-[639px]:!p-4 max-[639px]:!pb-10 max-[639px]:!pt-12">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4 max-[1023px]:gap-0.5 max-[639px]:gap-0.5 lg:gap-4">

          <!-- Hero Image Component -->
          <HeroImages />

          <!-- Text Content -->
          <div class="text-content-container flex-1 max-w-xl lg:max-w-5xl space-y-6 relative order-2 lg:order-1 [&>*+*]:!mt-2 max-[639px]:[&>*+*]:!mt-6 lg:!mt-40 max-[1023px]:!-mt-[10rem] max-[1023px]:!z-40 max-[639px]:!-mt-[8rem] max-[639px]:!z-30">

            <!-- Hero Buffs Chicken Image -->
            <div class="hero-buffs-chicken absolute -top-32 lg:-top-93 left-[-12rem] z-10 lg:!block lg:!opacity-100 lg:!visible max-[1023px]:!hidden">
              <NuxtImg src="/hero-buffs-chicken.png" alt="Buffs Chicken" class="w-50 h-50 lg:w-115 lg:h-115 object-contain max-[1023px]:!w-[clamp(200px,32vw,300px)] max-[1023px]:!h-auto" />
            </div>

            <!-- Main Heading -->
            <h1 class="font-['Caprasimo'] text-5xl sm:text-5xl lg:text-7xl text-[#1A4189] leading-tight !leading-none max-[1023px]:!text-[clamp(3.5rem,10vw,4.5rem)] max-[1023px]:!leading-[1.05] max-[1023px]:tracking-[-0.02em] max-[1023px]:!text-center max-[1023px]:!z-41 max-[1023px]:!relative max-[1023px]:!mt-8 max-[639px]:!text-[3rem] max-[639px]:!text-center max-[639px]:!z-31 max-[639px]:!relative">
              Buffs<br />Chicken
            </h1>
            
            <!-- Subheading -->
            <h2 class="font-['Unbounded'] text-2xl sm:text-2xl lg:text-3xl font-bold text-[#FE601C] leading-tight max-[1023px]:!text-[1.75rem] max-[1023px]:!text-center max-[1023px]:!font-bold max-[1023px]:!mb-4 max-[1023px]:!mt-6 max-[1023px]:!z-41 max-[1023px]:!relative max-[639px]:!text-[1.5rem] max-[639px]:!text-center max-[639px]:!mb-5 max-[639px]:!mt-1 max-[639px]:!z-31 max-[639px]:!relative">
              your go-to comfort
            </h2>
            
            <!-- Description Paragraph -->
            <p class="description-paragraph font-['Unbounded'] text-xs lg:text-sm text-gray-500 leading-relaxed w-full max-w-full max-[1023px]:!text-[0.95rem] max-[1023px]:!text-center max-[1023px]:!leading-[1.7] max-[1023px]:!text-[#4B5563] max-[1023px]:!pb-2 max-[1023px]:!font-normal max-[1023px]:!mt-0 max-[1023px]:!z-41 max-[1023px]:!relative max-[639px]:!text-[0.8rem] max-[639px]:!text-center max-[639px]:!leading-[1.7] max-[639px]:!text-[#4B5563] max-[639px]:!pb-1 max-[639px]:!font-normal max-[639px]:!mt-0 max-[639px]:!z-31 max-[639px]:!relative">
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
// Eager load (needed above fold)
import Navbar from '~/components/Navbar.vue'
import HeroImages from '~/components/HeroImages.vue'

// Lazy load (below fold)
const PopularPicks = defineAsyncComponent(() => import('~/components/PopularPicks.vue'))
const Blog = defineAsyncComponent(() => import('~/components/Blog.vue'))
const FAQ = defineAsyncComponent(() => import('~/components/FAQ.vue'))
const Footer = defineAsyncComponent(() => import('~/components/Footer.vue'))

export default {
  components: {
    Navbar,
    HeroImages,
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
  overflow-x: hidden;
  max-width: 100vw;
}
</style>