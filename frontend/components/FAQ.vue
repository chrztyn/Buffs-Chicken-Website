<template>
    <section class="faq-section bg-[#FBF4E5] py-12 lg:py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Main Title -->
            <h2 
                ref="title"
                class="text-3xl md:text-4xl lg:text-5xl text-[#2B5B9E] mb-10 md:mb-14 font-['Unbounded'] text-center font-bold opacity-0 transform translate-y-12 transition-all duration-1000 ease-out"
                :class="{ 'opacity-100 translate-y-0': titleVisible }"
            >
                Frequently Asked Questions
            </h2>

            <!-- FAQ Accordion -->
            <div class="faq-accordion flex flex-col space-y-4 md:space-y-5">
                <div
                    v-for="(faq, index) in faqs"
                    :key="faq.id"
                    :ref="el => { if (el) faqRefs[index] = el }"
                    class="faq-item bg-white/80 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg border-0 opacity-0 transform translate-y-12"
                    :class="[
                        faq.isOpen ? 'shadow-md' : '',
                        faq.isVisible ? 'opacity-100 translate-y-0' : ''
                    ]"
                    :style="{ 
                        transitionDelay: faq.isVisible ? `${index * 150}ms` : '0ms',
                        transitionDuration: '0.8s'
                    }"
                >
                    <button
                        @click="toggleFaq(index)"
                        class="w-full flex items-start justify-between p-5 md:p-6 text-left transition-all group focus:outline-none rounded-xl border-0"
                        :class="faq.isOpen ? 'pb-4' : 'pb-5 md:pb-6'"
                    >
                        <div class="flex items-start gap-4 flex-1 pr-4">
                            <span class="faq-number text-xs md:text-sm font-semibold text-gray-400 font-['Unbounded'] mt-1 flex-shrink-0">
                                {{ String(index + 1).padStart(2, '0') }}
                            </span>
                            <span class="text-xs md:text-sm lg:text-base font-medium text-gray-800 font-['Unbounded'] flex-1 text-left leading-relaxed">
                                {{ faq.question }}
                            </span>
                        </div>
                        <div class="faq-icon flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-50 flex items-center justify-center transition-all duration-300 group-hover:bg-gray-100 mt-1">
                            <svg v-if="faq.isOpen" class="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 transition-transform duration-300 rotate-180" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                            </svg>
                            <svg v-else class="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </button>
                    <div
                        class="faq-answer overflow-hidden transition-all duration-300 ease-in-out"
                        :class="faq.isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
                    >
                        <div class="text-sm md:text-base px-5 md:px-6 pb-5 md:pb-6 text-gray-600 leading-relaxed font-['Unbounded'] pl-14 md:pl-16">
                            {{ faq.answer }}
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
            titleVisible: false,
            faqRefs: [],
            faqs: [
                {
                    id: 1,
                    question: 'Where is Buffs Chicken located?',
                    answer: 'Buffs Chicken is located at The Hood, Angeles City. We are easily accessible and welcome walk-in customers.',
                    isOpen: false,
                    isVisible: false
                },
                {
                    id: 2,
                    question: 'Do you deliver?',
                    answer: "Yes, we accept delivery by placing an order through this website. Once your order is submitted, we'll confirm it with you shortly.",
                    isOpen: false,
                    isVisible: false
                },
                {
                    id: 3,
                    question: 'Can I order for take-out?',
                    answer: 'Absolutely! We offer take-out services. You can place your order by calling us or visiting our location. We recommend calling ahead for faster service, especially during peak hours.',
                    isOpen: false,
                    isVisible: false
                },
                {
                    id: 4,
                    question: 'Do you join pop-ups or food events?',
                    answer: 'Yes, we participate in various pop-ups and food events. For inquiries about our participation in events or to invite us to your event, please contact us through email or our social media channels.',
                    isOpen: false,
                    isVisible: false
                },
                {
                    id: 5,
                    question: 'What makes Buffs Chicken special?',
                    answer: 'Buffs Chicken stands out with our signature brined and spiced chicken that delivers next-level flavor. Every meal is cooked fresh to order, ensuring the crispiest and juiciest chicken experience. From our OG Buffs poppers to our loaded combos, we focus on quality ingredients and authentic flavors.',
                    isOpen: false,
                    isVisible: false
                }
            ]
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.setupScrollObserver();
        });
    },
    beforeUnmount() {
        if (this.titleObserver) {
            this.titleObserver.disconnect();
        }
        if (this.faqObserver) {
            this.faqObserver.disconnect();
        }
    },
    methods: {
        toggleFaq(index) {
            this.faqs[index].isOpen = !this.faqs[index].isOpen;
        },
        setupScrollObserver() {
            // Observer for title with higher threshold
            const titleOptions = {
                root: null,
                rootMargin: '-100px 0px -100px 0px',
                threshold: 0.3
            };

            this.titleObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.titleVisible = true;
                    } else {
                        this.titleVisible = false;
                    }
                });
            }, titleOptions);

            // Observer for FAQ items
            const faqOptions = {
                root: null,
                rootMargin: '-50px 0px -100px 0px',
                threshold: 0.2
            };

            this.faqObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const index = this.faqRefs.indexOf(entry.target);
                    if (index !== -1) {
                        if (entry.isIntersecting) {
                            this.faqs[index].isVisible = true;
                        } else {
                            this.faqs[index].isVisible = false;
                        }
                    }
                });
            }, faqOptions);

            // Observe title
            if (this.$refs.title) {
                this.titleObserver.observe(this.$refs.title);
            }

            // Observe FAQ items
            this.faqRefs.forEach(ref => {
                if (ref) {
                    this.faqObserver.observe(ref);
                }
            });
        }
    }
}
</script>

<style scoped>
.faq-answer {
    transition: max-height 0.3s ease, opacity 0.3s ease;
}

.faq-item {
    position: relative;
    border: none;
    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item button {
    border: none;
    border-bottom: none;
}

.faq-item::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 2px;
    transition: width 0.3s ease;
}

.faq-item:hover::after {
    width: 100%;
}

.faq-number {
    transition: color 0.3s ease;
}

.faq-item:hover .faq-number {
    color: #2B5B9E;
}

.faq-icon {
    transition: transform 0.3s ease, background-color 0.3s ease;
}

.faq-item:hover .faq-icon {
    transform: translateY(-1px);
}

.faq-item[class*="shadow-md"] .faq-number {
    color: #2B5B9E;
}
</style>