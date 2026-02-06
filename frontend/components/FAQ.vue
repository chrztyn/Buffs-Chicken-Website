<template>
        <section class="faq-section bg-[#FBF4E5] py-12 lg:py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 lg:items-start">
                <!-- Left Column: Title and Contact Box -->
                <div class="flex flex-col w-full h-full">
                    <!-- Main Title -->
                    <h2 class="text-3xl md:text-4xl lg:text-5xl text-[#2B5B9E] mb-12 font-['Unbounded'] break-words">
                        Frequently asked<br />questions
                    </h2>

                    <!-- Spacer to push contact box to bottom -->
                    <div class="flex-grow"></div>

                    <!-- Contact Box -->
                    <div class="faq-contact-box bg-[#F8F4ED] rounded-xl p-6 lg:p-8 shadow-lg w-full h-auto flex flex-col items-left text-left box-border">
                        <h3 class="text-xl font-bold text-gray-900 mb-4 font-['Unbounded'] break-words">
                            Still have a questions?
                        </h3>
                        <p class="text-sm text-gray-600 mb-6 leading-relaxed font-['Unbounded'] break-words">
                            Can't find the answer to your question? Send us an email and we'll get back to you as soon as possible!
                        </p>
                        <NuxtLink to="/contact" class="inline-block w-30 h-10 bg-[#2B5B9E] text-white px-6 py-3.5 rounded-sm font-['Unbounded'] font-semibold text-sm hover:bg-[#1A4189] transition-colors shadow-md text-center leading-3">
                            Send Email
                        </NuxtLink>
                    </div>
                </div>

                <!-- Right Column: FAQ Accordion -->
                <div class="faq-accordion flex flex-col space-y-4">
                    <div
                        v-for="(faq, index) in faqs"
                        :key="faq.id"
                        class="faq-item bg-[#F8F4ED] rounded-xl shadow-lg overflow-hidden transition-all duration-200"
                    >
                        <button
                            @click="toggleFaq(index)"
                            class="w-full flex items-center justify-between p-5 lg:p-6 text-left transition-colors group"
                        >
                            <span class="text-[14px] md:text-[14px] font-sm text-gray-900 font-['Unbounded'] pr-6 flex-1">
                                {{ faq.question }}
                            </span>
                            <div class="faq-icon flex-shrink-0 w-9 h-9 rounded-full border-2 border-[#2B5B9E] bg-[#E3F2FD] flex items-center justify-center transition-all group-hover:bg-[#BBDEFB]">
                                <svg v-if="faq.isOpen" class="w-5 h-5 text-[#2B5B9E]" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 12h12"></path>
                                </svg>
                                <svg v-else class="w-5 h-5 text-[#2B5B9E]" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12M6 12h12"></path>
                                </svg>
                            </div>
                        </button>
                        <div
                            class="faq-answer overflow-hidden transition-all duration-300 ease-in-out"
                            :class="faq.isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
                        >
                            <div class="text-[14px] md:text-[12px] font-sm px-5 lg:px-6 pb-5 lg:pb-6 text-sm text-gray-700 leading-relaxed font-['Unbounded']">
                                {{ faq.answer }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'FAQ',
    data() {
        return {
            faqs: [
                {
                    id: 1,
                    question: 'Where is Buffs Chicken located?',
                    answer: 'Buffs Chicken is located at The Hood, Angeles City. We are easily accessible and welcome walk-in customers.',
                    isOpen: false
                },
                {
                    id: 2,
                    question: 'Do you deliver?',
                    answer: 'Yes, we accept delivery by placing an order through this website. Once your order is submitted, we’ll confirm it with you shortly.',
                    isOpen: false
                },
                {
                    id: 3,
                    question: 'Can I order for take-out?',
                    answer: 'Absolutely! We offer take-out services. You can place your order by calling us or visiting our location. We recommend calling ahead for faster service, especially during peak hours.',
                    isOpen: false
                },
                {
                    id: 4,
                    question: 'Do you join pop-ups or food events?',
                    answer: 'Yes, we participate in various pop-ups and food events. For inquiries about our participation in events or to invite us to your event, please contact us through email or our social media channels.',
                    isOpen: false
                },
                {
                    id: 5,
                    question: 'What makes Buffs Chicken special?',
                    answer: 'Buffs Chicken stands out with our signature brined and spiced chicken that delivers next-level flavor. Every meal is cooked fresh to order, ensuring the crispiest and juiciest chicken experience. From our OG Buffs poppers to our loaded combos, we focus on quality ingredients and authentic flavors.',
                    isOpen: false
                }
            ]
        }
    },
    methods: {
        toggleFaq(index) {
            this.faqs[index].isOpen = !this.faqs[index].isOpen;
        }
    }
}
</script>

<style scoped>

.faq-answer {
    transition: max-height 0.3s ease, opacity 0.3s ease;
}
</style>
