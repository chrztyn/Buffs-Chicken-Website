<template>
    <div class="contact-page min-h-screen bg-[#FBF4E5] overflow-x-hidden w-full max-w-[100vw]">
        <Navbar class="relative z-20" />

    <!-- Contact Top Section -->
        <div class="contact-hero-section relative bg-gradient-to-br from-[#1A4189] via-[#2A5199] to-[#1A4189] overflow-hidden">
            <!-- Background Pattern -->
            <div class="hero-pattern absolute inset-0"></div>
            
            <div class="relative z-10 min-h-[36vh] flex items-center">
                <div class="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div class="max-w-6xl mx-auto">
                        <div class="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-center">
                            
                            <!-- Left: Graphic element - Phone/Message style -->
                            <div class="hero-graphic hidden lg:block relative">
                                <div class="graphic-shadow absolute inset-0 bg-[#FEB90E] transform -rotate-6 opacity-25 rounded-3xl"></div>
                                <div class="graphic-card relative bg-white/10 backdrop-blur-md border-[4px] border-white/30 p-6 rounded-3xl transform rotate-3">
                                    <div class="space-y-2">
                                        <div class="message-bubble bg-white/20 rounded-2xl p-3 transform -rotate-2">
                                            <div class="h-1.5 bg-white/40 w-4/5 mb-1.5"></div>
                                            <div class="h-1.5 bg-white/40 w-3/5"></div>
                                        </div>
                                        <div class="message-bubble bg-[#FEB90E]/30 rounded-2xl p-3 transform rotate-1 ml-auto w-4/5">
                                            <div class="h-1.5 bg-white/50 w-full mb-1.5"></div>
                                            <div class="h-1.5 bg-white/50 w-2/3"></div>
                                        </div>
                                        <div class="contact-icon-box h-12 bg-white/15 rounded-xl flex items-center justify-center mt-3">
                                            <div class="w-8 h-8 bg-[#FEB90E] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Right: Text content -->
                            <div class="hero-content lg:text-right">
                                <!-- Badge -->
                                <div class="mb-4 lg:flex lg:justify-end">
                                    <div class="hero-badge inline-block px-3 py-1 bg-[#FEB90E] text-[#1A4189] font-['Unbounded'] font-extrabold text-[10px] uppercase tracking-[0.2em] transform rotate-1 shadow-lg">
                                        Get In Touch
                                    </div>
                                </div>
                                
                                <!-- Title -->
                                <h1 class="font-['Unbounded'] font-black text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl leading-[0.9] text-white mb-4">
                                    <span class="hero-title-line-1 inline-block">LET'S</span><br/>
                                    <span class="hero-title-line-2 inline-block text-[#FEB90E]">CONNECT &</span><br/>
                                    <span class="hero-title-line-3 inline-block">SERVE</span>
                                </h1>
                                
                                <div class="hero-line w-full lg:ml-auto h-1.5 bg-gradient-to-r from-[#FEB90E] to-white/50 mb-4 lg:w-5/6"></div>
                                
                            </div>
                            
                        </div>
                    </div>
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
  head() {
    return {
      title: 'Contact Us - Buffs Chicken | Get in Touch',
      meta: [
        {
          name: 'description',
          content: 'Contact Buffs Chicken at The Hood, Angeles City. Send us a message for inquiries, feedback, or orders. We love hearing from you!'
        },
        { name: 'keywords', content: 'contact, Buffs Chicken, Angeles City, customer support, inquiries' },
        { property: 'og:title', content: 'Contact Us - Buffs Chicken' },
        { property: 'og:type', content: 'website' }
      ]
    }
  },
  components: {
    Navbar,
    Footer,
    Contact
  }
}
</script>

<style scoped>
.hero-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.03;
    background-image: repeating-linear-gradient(
        45deg,
        #FEB90E 0,
        #FEB90E 2px,
        transparent 2px,
        transparent 20px
    );
}
</style>