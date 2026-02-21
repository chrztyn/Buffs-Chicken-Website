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
  head() {
    return {
      title: 'About Us - Buffs Chicken | Your Go-To Comfort Food in Angeles City',
      meta: [
        {
          name: 'description',
          content: 'Learn about Buffs Chicken at The Hood, Angeles City. We serve fresh, crispy wings and comfort food with passion. Discover our story and what makes us special.'
        },
        { name: 'keywords', content: 'about us, Buffs Chicken, Angeles City, The Hood, restaurant story' },
        { property: 'og:title', content: 'About Us - Buffs Chicken' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://www.buffschicken.com/about' }
      ],
      link: [
        { rel: 'canonical', href: 'https://www.buffschicken.com/about' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://www.buffschicken.com'
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'About',
                'item': 'https://www.buffschicken.com/about'
              }
            ]
          }, null, 2)
        }
      ]
    }
  },
  components: {
    Navbar,
    About,
    Footer
  }
}
</script>