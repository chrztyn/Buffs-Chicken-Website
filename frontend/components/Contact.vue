<template>
    <section class="bg-[#FBF4E5] py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <!-- Get In Touch Section -->
        <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-6 items-start lg:items-center">
                <!-- Left Side - Contact Info -->
                <div class="flex flex-col items-start text-left w-full order-1 lg:order-1 lg:col-span-3">
                    <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A4189] mb-3 sm:mb-4">Get In Touch</h2>
                    <p class="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed max-w-lg">
                        Have a question or planning something? Drop us a message and we'll get back to you shortly.
                    </p>

                    <!-- Contact Details -->
                    <div class="contact-details space-y-4 sm:space-y-5 md:space-y-6 mb-6 sm:mb-8 w-full">
                <!-- Address -->
                <div class="flex items-start gap-3 sm:gap-4 justify-start">
                    <div class="flex-shrink-0 w-8 sm:w-9 h-8 sm:h-9 bg-[#1A4189] rounded-full flex items-center justify-center hover:bg-[#1A4189] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
                        <svg class="w-4 sm:w-5 h-4 sm:h-5" fill="white" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="text-xs sm:text-sm font-bold text-[#1A4189] mb-0.5 sm:mb-1">Address</h3>
                        <p class="text-gray-700 text-xs break-words">The Hood, Angeles City, Pampanga</p>
                    </div>
                </div>

                <!-- Phone -->
                <div class="flex items-start gap-3 sm:gap-4 justify-start">
                    <div class="flex-shrink-0 w-8 sm:w-9 h-8 sm:h-9 bg-[#1A4189] rounded-full flex items-center justify-center hover:bg-[#1A4189] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
                        <svg class="w-4 sm:w-5 h-4 sm:h-5" fill="white" viewBox="0 0 24 24">
                            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.59a1 1 0 01-.25 1.01l-2.2 2.19z"/>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="text-xs sm:text-sm font-bold text-[#1A4189] mb-0.5 sm:mb-1">Phone Number</h3>
                        <p class="text-gray-700 hover:text-[#1A4189] transition-colors text-xs">0917 194 0749</p>
                    </div>
                </div>

                <!-- Email -->
                <div class="flex items-start gap-3 sm:gap-4 justify-start">
                    <div class="flex-shrink-0 w-8 sm:w-9 h-8 sm:h-9 bg-[#1A4189] rounded-full flex items-center justify-center hover:bg-[#1A4189] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
                        <svg class="w-4 sm:w-5 h-4 sm:h-5" fill="white" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="text-xs sm:text-sm font-bold text-[#1A4189] mb-0.5 sm:mb-1">Email</h3>
                        <a href="mailto:buffs.ph@gmail.com" class="text-gray-700 hover:text-[#1A4189] transition-colors text-xs break-all">buffs.ph@gmail.com</a>
                    </div>
                </div>
            </div>

            <!-- Map -->
            <div class="mb-6 sm:mb-8 rounded-2xl overflow-hidden w-full max-w-lg shadow-lg h-48 sm:h-56 md:h-64">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.1891755037027!2d120.59417325667147!3d15.127690310311404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f3000a5c1e93%3A0x78ed42ac651f2ff5!2sBuffs%20Chicken%20-%20Angeles!5e0!3m2!1sen!2sph!4v1769182104695!5m2!1sen!2sph" 
                    width="100%"
                    height="100%"
                    style="border: 0"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            <!-- Social Media -->
            <div class="contact-media w-full">
                <h3 class="text-gray-700 text-xs font-bold mb-2 sm:mb-3 text-start uppercase tracking-widest follow-us-heading">Follow Us:</h3>
                <div class="flex gap-2 sm:gap-3 justify-start flex-wrap">
                <a
                    href="https://www.facebook.com/buffs.chicken"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="social-icon w-8 h-8 sm:w-9 sm:h-9 bg-[#1A4189] rounded-full flex items-center justify-center hover:bg-[#1A4189] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                    title="Facebook"
                >
                    <svg class="w-4 sm:w-4 h-4 sm:h-4" fill="white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                </a>
                <a
                    href="https://www.instagram.com/buffs.chicken"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="social-icon w-8 h-8 sm:w-9 sm:h-9 bg-[#1A4189] rounded-full flex items-center justify-center hover:bg-[#1A4189] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                    title="Instagram"
                >
                    <svg class="w-4 sm:w-4 h-4 sm:h-4" fill="white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </a>
                <a
                    href="https://www.tiktok.com/@buffs.chicken"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="social-icon w-8 h-8 sm:w-9 sm:h-9 bg-[#1A4189] rounded-full flex items-center justify-center hover:bg-[#1A4189] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                    title="TikTok"
                >
                    <svg class="w-4 sm:w-4 h-4 sm:h-4" fill="white" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/>
                    </svg>
                </a>
                </div>
            </div>
            </div>

            <!-- Right Side - Contact Form -->
            <div class="contact-form-box w-full order-2 lg:order-2 lg:col-span-2">
                <h3 class="contact-form-title">Send a Message</h3>

                <form @submit.prevent="submitForm" class="contact-form">
                    <!-- Name Field -->
                    <div class="form-field">
                        <input
                            v-model="form.name"
                            type="text"
                            placeholder="Name"
                            class="form-input"
                            required
                        />
                    </div>

                    <!-- Email Field -->
                    <div class="form-field">
                        <input
                            v-model="form.email"
                            type="email"
                            placeholder="Email"
                            class="form-input"
                            required
                        />
                    </div>

                    <!-- Message Field -->
                    <div class="form-field">
                        <textarea
                            v-model="form.message"
                            placeholder="Message"
                            rows="4"
                            class="form-textarea"
                            required
                        ></textarea>
                    </div>

                    <!-- Disclaimer -->
                    <p class="form-disclaimer">
                        By submitting this form, you agree to the processing of your details for your order, inquiries and related services.
                    </p>

                    <!-- Submit Button -->
                    <div class="form-button-wrapper">
                        <button
                            type="submit"
                            :disabled="isSubmitting"
                            class="form-submit-btn text-xs sm:text-sm"
                        >
                            {{ isSubmitting ? 'Sending...' : 'Submit' }}
                        </button>
                    </div>

                    <!-- Success Message -->
                    <div v-if="successMessage" class="text-white text-xs bg-green-500/40 p-2 sm:p-3 rounded-lg mt-3 border border-white/20">
                        ✓ {{ successMessage }}
                    </div>

                    <!-- Error Message -->
                    <div v-if="errorMessage" class="text-white text-xs bg-red-500/40 p-2 sm:p-3 rounded-lg mt-3 border border-white/20">
                        ✕ {{ errorMessage }}
                    </div>
                </form>
            </div>            </div>        </div>
    </section>
</template>

    <script>
    import { useApi } from '~/composables/useApi'
    
    export default {
    name: 'Contact',
    data() {
        return {
        form: {
            name: '',
            email: '',
            message: ''
        },
        successMessage: '',
        errorMessage: '',
        isSubmitting: false
        }
    },
    methods: {
        async submitForm() {
        try {
            this.errorMessage = '';
            this.successMessage = '';

            // Validate form
            if (!this.form.name || !this.form.email || !this.form.message) {
            this.errorMessage = 'Please fill in all fields.';
            return;
            }

            // Set loading state
            this.isSubmitting = true;

            // Use useApi composable for API call
            const { submitContactForm } = useApi();
            const response = await submitContactForm(this.form);

            if (response.data?.success) {
              this.successMessage = response.data.message || 'Thank you for your message! We\'ll get back to you shortly.';
              
              // Reset form
              this.form = {
                name: '',
                email: '',
                message: ''
              };

              // Clear success message after 5 seconds
              setTimeout(() => {
                this.successMessage = '';
              }, 5000);
            } else {
              this.errorMessage = response.data?.message || 'An error occurred. Please try again.';
            }
        } catch (error) {
            this.errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
            console.error('Form submission error:', error);
        } finally {
            this.isSubmitting = false;
        }
        }
    }
    }
    </script>

    <style scoped>
    /* ===== RESPONSIVE LAYOUT ===== */
    @media (max-width: 768px) {
        section {
            padding: 2rem 1rem !important;
        }
    }

    @media (max-width: 640px) {
        section {
            padding: 1.5rem 1rem !important;
        }
    }

    /* ===== CONTACT DETAILS STYLING ===== */
    .contact-details {
        animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .contact-details > div {
        border-left: 3px solid transparent;
        padding-left: 1rem;
        transition: all 0.3s ease;
    }

    .contact-details > div:hover {
        border-left-color: #1A4189;
        transform: translateX(8px);
    }

    .contact-details h3 {
        font-size: 0.875rem;
        letter-spacing: 0.5px;
    }

    .contact-details p,
    .contact-details a {
        font-size: 0.8125rem;
        line-height: 1.5;
    }

    /* ===== ICON STYLING ===== */
    .contact-details .flex-shrink-0 {
        background: linear-gradient(135deg, #1A4189 0%, #2d5bb8 100%);
        box-shadow: 0 4px 15px rgba(26, 65, 137, 0.2);
    }

    .contact-details .flex-shrink-0:hover {
        box-shadow: 0 8px 25px rgba(26, 65, 137, 0.35);
    }

    /* ===== MAP STYLING ===== */
    .mb-12.rounded-2xl {
        aspect-ratio: 4/3;
        min-height: 200px;
        overflow: hidden;
        border: none;
        box-shadow: 0 10px 30px rgba(26, 65, 137, 0.15);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .mb-12.rounded-2xl:hover {
        transform: translateY(-4px);
        box-shadow: 0 15px 40px rgba(26, 65, 137, 0.25);
    }

    /* ===== SOCIAL MEDIA STYLING ===== */
    .contact-media {
        margin-top: 0.5rem;
    }

    .contact-media h3 {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #666;
        margin-bottom: 1rem;
    }

    .contact-media .flex {
        gap: 1rem;
        flex-wrap: wrap;
    }

    .social-icon {
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        background: linear-gradient(135deg, #1A4189 0%, #2d5bb8 100%);
        border: 2px solid transparent;
    }

    .social-icon:hover {
        transform: scale(1.15) translateY(-3px);
        box-shadow: 0 8px 20px rgba(26, 65, 137, 0.4);
        border-color: rgba(26, 65, 137, 0.2);
    }

    /* ===== CONTACT FORM STYLING ===== */
    .contact-form-box {
        background: linear-gradient(135deg, #ffffff 0%, #f9f5ed 100%);
        padding: 1.5rem;
        border-radius: 1.25rem;
        box-shadow: 0 10px 40px rgba(26, 65, 137, 0.08);
        border: 1px solid rgba(26, 65, 137, 0.05);
        transition: all 0.3s ease;
        max-width: 100%;
    }

    .contact-form-box:hover {
        box-shadow: 0 15px 50px rgba(26, 65, 137, 0.12);
        transform: translateY(-4px);
    }

    .contact-form-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1A4189;
        margin-bottom: 1rem;
        letter-spacing: 0.5px;
    }

    /* ===== FORM FIELDS STYLING ===== */
    .form-field {
        margin-bottom: 0.875rem;
    }

    .form-input,
    .form-textarea {
        width: 100%;
        padding: 0.625rem 0.875rem;
        border: 2px solid #e5ddd0;
        border-radius: 0.625rem;
        font-size: 0.875rem;
        font-family: inherit;
        background-color: #ffffff;
        color: #333;
        transition: all 0.3s ease;
    }

    .form-input::placeholder,
    .form-textarea::placeholder {
        color: #999;
    }

    .form-input:focus,
    .form-textarea:focus {
        outline: none;
        border-color: #1A4189;
        background-color: #ffffff;
        box-shadow: 0 0 0 3px rgba(26, 65, 137, 0.1);
        transform: translateY(-2px);
    }

    .form-input:hover:not(:focus),
    .form-textarea:hover:not(:focus) {
        border-color: #1A4189;
        background-color: #fdfbf8;
    }

    .form-textarea {
        resize: vertical;
        min-height: 100px;
        font-size: 0.875rem;
        line-height: 1.5;
    }

    /* ===== FORM DISCLAIMER ===== */
    .form-disclaimer {
        font-size: 0.75rem;
        color: #666;
        line-height: 1.5;
        margin-bottom: 1rem;
        padding: 0.75rem;
        background-color: rgba(26, 65, 137, 0.03);
        border-left: 3px solid #1A4189;
        border-radius: 0.5rem;
    }

    /* ===== SUBMIT BUTTON ===== */
    .form-button-wrapper {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 0.75rem;
    }

    .form-submit-btn {
        background: linear-gradient(135deg, #1A4189 0%, #2d5bb8 100%);
        color: white;
        padding: 0.625rem 2rem;
        border: none;
        border-radius: 0.625rem;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 15px rgba(26, 65, 137, 0.3);
    }

    .form-submit-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(26, 65, 137, 0.45);
    }

    .form-submit-btn:active {
        transform: translateY(-1px);
    }

    .form-submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }

    /* ===== MESSAGE NOTIFICATIONS ===== */
    .text-white {
        border-radius: 0.75rem;
        animation: slideInUp 0.4s ease-out;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* ===== INPUT & TEXTAREA TRANSITIONS ===== */
    input, textarea {
        transition: all 0.3s ease;
    }

    input:focus::placeholder,
    textarea:focus::placeholder {
        color: transparent;
    }

    /* ===== CUSTOM SCROLLBAR FOR TEXTAREA ===== */
    textarea::-webkit-scrollbar {
        width: 6px;
    }

    textarea::-webkit-scrollbar-track {
        background: transparent;
    }

    textarea::-webkit-scrollbar-thumb {
        background: rgba(26, 65, 137, 0.2);
        border-radius: 3px;
    }

    textarea::-webkit-scrollbar-thumb:hover {
        background: rgba(26, 65, 137, 0.4);
    }

    /* ===== RESPONSIVE ADJUSTMENTS ===== */
    @media (max-width: 1024px) {
        .contact-form-box {
            padding: 1.25rem;
        }

        .contact-form-title {
            font-size: 1.125rem;
        }
    }

    @media (max-width: 768px) {
        .contact-form-box {
            padding: 1.125rem;
        }

        .contact-form-title {
            font-size: 1rem;
        }

        .mb-12.rounded-2xl {
            min-height: 200px;
            margin-top: 1rem;
            margin-bottom: 1rem;
        }

        .contact-media {
            margin-top: 1.5rem;
        }
    }

    @media (max-width: 640px) {
        .contact-form-box {
            padding: 1rem;
        }

        .contact-form-title {
            font-size: 0.9375rem;
        }

        .form-input,
        .form-textarea {
            padding: 0.5625rem 0.75rem;
            font-size: 0.8125rem;
        }

        .form-textarea {
            min-height: 90px;
        }

        .form-submit-btn {
            padding: 0.5625rem 1.5rem;
            font-size: 0.8125rem;
        }

        .form-disclaimer {
            font-size: 0.6875rem;
            padding: 0.625rem;
        }

        .contact-details > div {
            padding-left: 0.75rem;
        }

        .contact-details > div:hover {
            transform: translateX(4px);
        }

        .social-icon {
            width: 36px;
            height: 36px;
        }

        .social-icon svg {
            width: 18px;
            height: 18px;
        }
    }
    </style>
