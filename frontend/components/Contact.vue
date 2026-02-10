<template>
    <section class="bg-gradient-to-br from-[#FBF4E5] via-[#FFFBF0] to-[#FBF4E5] contact-section-padding relative overflow-hidden">
        <!-- Decorative Background Elements -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="absolute -top-40 -right-40 w-80 h-80 bg-[#1A4189]/5 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-[#1A4189]/5 rounded-full blur-3xl"></div>
        </div>

        <!-- Get In Touch Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <!-- Section Header -->
            <div class="text-center mb-12 lg:mb-16 animate-fade-in">
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A4189] mb-4 tracking-tight">
                    Get In Touch
                </h2>
                <p class="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                    Have a question or planning something special? We'd love to hear from you. Drop us a message and we'll get back to you as soon as possible.
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <!-- Left Side - Contact Info (Takes 5 columns on lg screens) -->
                <div class="lg:col-span-5 space-y-8 animate-slide-in-left">
                    <!-- Contact Details Cards -->
                    <div class="space-y-4">
                        <!-- Address Card -->
                        <div class="contact-card group">
                            <div class="flex items-start gap-4">
                                <div class="icon-wrapper bg-gradient-to-br from-[#1A4189] to-[#2d5bb8]">
                                    <svg class="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <h3 class="contact-label">Address</h3>
                                    <p class="contact-value">The Hood, Angeles City, Pampanga</p>
                                </div>
                            </div>
                        </div>

                        <!-- Phone Card -->
                        <div class="contact-card group">
                            <div class="flex items-start gap-4">
                                <div class="icon-wrapper bg-gradient-to-br from-[#1A4189] to-[#2d5bb8]">
                                    <svg class="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.59a1 1 0 01-.25 1.01l-2.2 2.19z"/>
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <h3 class="contact-label">Phone Number</h3>
                                    <a href="tel:09171940749" class="contact-value hover:text-[#1A4189] transition-colors">
                                        0917 194 0749
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Email Card -->
                        <div class="contact-card group">
                            <div class="flex items-start gap-4">
                                <div class="icon-wrapper bg-gradient-to-br from-[#1A4189] to-[#2d5bb8]">
                                    <svg class="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <h3 class="contact-label">Email</h3>
                                    <a href="mailto:buffs.ph@gmail.com" class="contact-value hover:text-[#1A4189] transition-colors break-all">
                                        buffs.ph@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Map -->
                    <div class="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.1891755037027!2d120.59417325667147!3d15.127690310311404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f3000a5c1e93%3A0x78ed42ac651f2ff5!2sBuffs%20Chicken%20-%20Angeles!5e0!3m2!1sen!2sph!4v1769182104695!5m2!1sen!2sph" 
                            width="100%"
                            height="100%"
                            style="border: 0"
                            allowfullscreen=""
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                            class="rounded-xl"
                        ></iframe>
                    </div>

                    <!-- Social Media -->
                    <div class="social-section">
                        <h3 class="social-label">Connect With Us</h3>
                        <div class="flex gap-3 flex-wrap">
                            <a
                                href="https://www.facebook.com/buffs.chicken"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="social-icon"
                                title="Follow us on Facebook"
                                aria-label="Facebook"
                            >
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a
                                href="https://www.instagram.com/buffschickenph/"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="social-icon"
                                title="Follow us on Instagram"
                                aria-label="Instagram"
                            >
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a
                                href="https://www.tiktok.com/@buffschickenph"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="social-icon"
                                title="Follow us on TikTok"
                                aria-label="TikTok"
                            >
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Right Side - Contact Form (Takes 7 columns on lg screens) -->
                <div class="lg:col-span-7 animate-slide-in-right">
                    <div class="contact-form-container">
                        <div class="form-header">
                            <h3 class="form-title">Send Us a Message</h3>
                            <p class="form-subtitle">Fill out the form below and we'll respond within 24 hours</p>
                        </div>

                        <form @submit.prevent="submitForm" class="contact-form">
                            <!-- Name and Email Grid -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <!-- Name Field -->
                                <div class="form-group">
                                    <label for="name" class="form-label">Full Name</label>
                                    <div class="input-wrapper">
                                        <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                        <input
                                            v-model="form.name"
                                            type="text"
                                            id="name"
                                            placeholder="your name"
                                            class="form-input"
                                            required
                                        />
                                    </div>
                                </div>

                                <!-- Email Field -->
                                <div class="form-group">
                                    <label for="email" class="form-label">Email Address</label>
                                    <div class="input-wrapper">
                                        <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                        <input
                                            v-model="form.email"
                                            type="email"
                                            id="email"
                                            placeholder="email@example.com"
                                            class="form-input"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Message Field -->
                            <div class="form-group">
                                <label for="message" class="form-label">Your Message</label>
                                <div class="input-wrapper">
                                    <svg class="input-icon textarea-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                                    </svg>
                                    <textarea
                                        v-model="form.message"
                                        id="message"
                                        placeholder="Tell us about your inquiry or feedback..."
                                        rows="6"
                                        class="form-textarea"
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <!-- Privacy Notice -->
                            <div class="privacy-notice">
                                <svg class="w-4 h-4 text-[#1A4189] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                </svg>
                                <p class="text-xs text-gray-600 leading-relaxed">
                                    By submitting this form, you agree to the processing of your details for your order, inquiries, and related services. Your information is secure and will never be shared.
                                </p>
                            </div>

                            <!-- Submit Button -->
                            <button
                                type="submit"
                                :disabled="isSubmitting"
                                class="submit-button group"
                            >
                                <span class="button-text">{{ isSubmitting ? 'Sending Message...' : 'Send Message' }}</span>
                                <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                                </svg>
                            </button>

                            <!-- Success Message -->
                            <transition name="fade-slide">
                                <div v-if="successMessage" class="alert alert-success">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                    </svg>
                                    <span>{{ successMessage }}</span>
                                </div>
                            </transition>

                            <!-- Error Message -->
                            <transition name="fade-slide">
                                <div v-if="errorMessage" class="alert alert-error">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                                    </svg>
                                    <span>{{ errorMessage }}</span>
                                </div>
                            </transition>
                        </form>
                    </div>
                </div>
            </div>
        </div>
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

                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.form.email)) {
                    this.errorMessage = 'Please enter a valid email address.';
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
                this.errorMessage = error.response?.data?.message || 'Unable to send message. Please try again later.';
                console.error('Form submission error:', error);
            } finally {
                this.isSubmitting = false;
            }
        }
    }
}
</script>

<style scoped>
/* ===== SECTION PADDING ===== */
.contact-section-padding {
    padding: 4rem 0 6rem;
}

@media (min-width: 640px) {
    .contact-section-padding {
        padding: 5rem 0 7rem;
    }
}

@media (min-width: 1024px) {
    .contact-section-padding {
        padding: 6rem 0 8rem;
    }
}

/* ===== ANIMATIONS ===== */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.6s ease-out;
}

.animate-slide-in-left {
    animation: slideInLeft 0.7s ease-out;
}

.animate-slide-in-right {
    animation: slideInRight 0.7s ease-out;
}

/* ===== CONTACT CARDS ===== */
.contact-card {
    background: white;
    padding: 1.25rem;
    border-radius: 1rem;
    border: 1px solid rgba(26, 65, 137, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.contact-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(26, 65, 137, 0.15);
    border-color: rgba(26, 65, 137, 0.2);
}

.icon-wrapper {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(26, 65, 137, 0.2);
    transition: all 0.3s ease;
}

.contact-card:hover .icon-wrapper {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 6px 16px rgba(26, 65, 137, 0.3);
}

.contact-label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #1A4189;
    margin-bottom: 0.25rem;
}

.contact-value {
    font-size: 0.9375rem;
    color: #374151;
    font-weight: 500;
    line-height: 1.5;
}

/* ===== MAP CONTAINER ===== */
.map-container {
    width: 100%;
    height: 215px;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(26, 65, 137, 0.12);
    border: 1px solid rgba(26, 65, 137, 0.1);
    transition: all 0.3s ease;
}

.map-container:hover {
    box-shadow: 0 8px 24px rgba(26, 65, 137, 0.2);
    transform: translateY(-2px);
}

/* ===== SOCIAL SECTION ===== */
.social-section {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px solid rgba(26, 65, 137, 0.1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.social-label {
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #1A4189;
    margin-bottom: 1rem;
}

.social-icon {
    width: 2.75rem;
    height: 2.75rem;
    background: linear-gradient(135deg, #1A4189 0%, #2d5bb8 100%);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(26, 65, 137, 0.2);
}

.social-icon:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 20px rgba(26, 65, 137, 0.35);
}

/* ===== CONTACT FORM CONTAINER ===== */
.contact-form-container {
    background: white;
    padding: 2rem;
    border-radius: 1.5rem;
    box-shadow: 0 4px 24px rgba(26, 65, 137, 0.08);
    border: 1px solid rgba(26, 65, 137, 0.1);
    transition: all 0.3s ease;
}

.contact-form-container:hover {
    box-shadow: 0 8px 32px rgba(26, 65, 137, 0.12);
}

@media (min-width: 640px) {
    .contact-form-container {
        padding: 2.5rem;
    }
}

@media (min-width: 1024px) {
    .contact-form-container {
        padding: 3rem;
    }
}

/* ===== FORM HEADER ===== */
.form-header {
    margin-bottom: 2rem;
    text-align: center;
}

.form-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1A4189;
    margin-bottom: 0.5rem;
}

.form-subtitle {
    font-size: 0.875rem;
    color: #6B7280;
}

@media (min-width: 640px) {
    .form-title {
        font-size: 1.75rem;
    }
    .form-subtitle {
        font-size: 0.9375rem;
    }
}

/* ===== FORM GROUPS ===== */
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.01em;
}

/* ===== INPUT WRAPPER ===== */
.input-wrapper {
    position: relative;
}

.input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.125rem;
    height: 1.125rem;
    color: #9CA3AF;
    pointer-events: none;
    transition: color 0.3s ease;
}

.textarea-icon {
    top: 1rem;
    transform: none;
}

/* ===== FORM INPUTS ===== */
.form-input,
.form-textarea {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 2.75rem;
    border: 2px solid #E5E7EB;
    border-radius: 0.75rem;
    font-size: 0.9375rem;
    font-family: inherit;
    background-color: #F9FAFB;
    color: #1F2937;
    transition: all 0.3s ease;
    outline: none;
}

.form-textarea {
    resize: vertical;
    min-height: 140px;
    line-height: 1.6;
}

.form-input:focus,
.form-textarea:focus {
    background-color: white;
    border-color: #1A4189;
    box-shadow: 0 0 0 3px rgba(26, 65, 137, 0.1);
}

.form-input:focus + .input-icon,
.form-textarea:focus + .input-icon {
    color: #1A4189;
}

.form-input::placeholder,
.form-textarea::placeholder {
    color: #9CA3AF;
}

/* ===== PRIVACY NOTICE ===== */
.privacy-notice {
    display: flex;
    gap: 0.75rem;
    padding: 1rem;
    background: linear-gradient(135deg, rgba(26, 65, 137, 0.05) 0%, rgba(26, 65, 137, 0.02) 100%);
    border-radius: 0.75rem;
    border-left: 3px solid #1A4189;
}

/* ===== SUBMIT BUTTON ===== */
.submit-button {
    width: 100%;
    background: linear-gradient(135deg, #1A4189 0%, #2d5bb8 100%);
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 16px rgba(26, 65, 137, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    position: relative;
    overflow: hidden;
}

.submit-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
}

.submit-button:hover::before {
    left: 100%;
}

.submit-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(26, 65, 137, 0.4);
}

.submit-button:active {
    transform: translateY(0);
}

.submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.button-text {
    position: relative;
    z-index: 1;
}

.button-icon {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.3s ease;
}

.submit-button:hover .button-icon {
    transform: translateX(4px);
}

/* ===== ALERTS ===== */
.alert {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.alert-success {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
    color: #065F46;
    border: 1px solid rgba(16, 185, 129, 0.3);
}

.alert-error {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
    color: #991B1B;
    border: 1px solid rgba(239, 68, 68, 0.3);
}

/* ===== TRANSITIONS ===== */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

/* ===== CUSTOM SCROLLBAR ===== */
.form-textarea::-webkit-scrollbar {
    width: 6px;
}

.form-textarea::-webkit-scrollbar-track {
    background: transparent;
}

.form-textarea::-webkit-scrollbar-thumb {
    background: rgba(26, 65, 137, 0.2);
    border-radius: 3px;
}

.form-textarea::-webkit-scrollbar-thumb:hover {
    background: rgba(26, 65, 137, 0.4);
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 640px) {
    .contact-card {
        padding: 1rem;
    }

    .icon-wrapper {
        width: 2.5rem;
        height: 2.5rem;
    }

    .icon-wrapper svg {
        width: 1.125rem;
        height: 1.125rem;
    }

    .contact-label {
        font-size: 0.6875rem;
    }

    .contact-value {
        font-size: 0.875rem;
    }

    .map-container {
        height: 220px;
    }

    .social-icon {
        width: 2.5rem;
        height: 2.5rem;
    }

    .social-icon svg {
        width: 1.125rem;
        height: 1.125rem;
    }

    .contact-form-container {
        padding: 1.5rem;
    }

    .form-title {
        font-size: 1.25rem;
    }

    .form-subtitle {
        font-size: 0.8125rem;
    }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Focus visible for keyboard navigation */
.form-input:focus-visible,
.form-textarea:focus-visible,
.submit-button:focus-visible,
.social-icon:focus-visible {
    outline: 2px solid #1A4189;
    outline-offset: 2px;
}
</style>