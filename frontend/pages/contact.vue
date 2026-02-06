<template>
    <div class="contact-page min-h-screen bg-[#FBF4E5] overflow-x-hidden w-full max-w-[100vw]">
        <Navbar class="relative z-20" />

        <!-- Contact Top Section -->
        <div class="relative overflow-hidden min-h-screen flex items-center -translate-y-16 sm:-translate-y-20 lg:-translate-y-20">
        
            <!-- Background Image with Blur -->
            <img
                src="/contact-top-photo.jpg"
                alt="Contact Top Photo"
                class="about-bg-image absolute inset-0 w-full h-full object-cover filter"
            />

            <!-- Overlay -->
            <div class="about-overlay absolute inset-0 bg-[rgba(251,244,229,0.75)]"></div>

            <!-- Content -->
            <div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-6 w-full">
                <div class="max-w-4xl mx-auto">
                    <h1 class="text-3xl md:text-5xl font-['Unbounded'] text-[#1A4189] mb-4 drop-shadow-lg">
                    Contact Us
                    </h1>
                    <p class="text-gray-900 text-sm md:text-lg max-w-2xl mx-auto drop-shadow-md">
                    Every bite tells a story, and we'd love to help you share yours. Connect with Buffs Chicken for collaborations, features, or inquiries that bring flavor, creativity, and unforgettable moments to your table.
                    </p>
                </div>
            </div>
        </div>

        <!-- Contact Form Section -->
        <Contact />

        <Footer />
    </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'
import Contact from '~/components/Contact.vue'

export default {
  name: 'ContactPage',
  components: {
    Navbar,
    Footer,
    Contact
  }
}
</script>
