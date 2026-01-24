<template>
    <div class="overflow-x-hidden w-full" style="margin: 0; padding: 0; width: 100vw; max-width: 100vw; position: relative;">
        <!-- Navigation Bar - Overlapping on top -->
        <Navbar class="relative z-50" />
        <!-- About Section - Full Screen -->
        <About class="relative z-10" style="position: relative;" />
        <!-- Footer - Below About Section -->
        <Footer class="relative z-20" />
    </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue'
import About from '~/components/About.vue'
import Footer from '~/components/Footer.vue'

export default {
  name: 'AboutPage',
  components: {
    Navbar,
    About,
    Footer
  }
}
</script>