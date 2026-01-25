<template>
  <teleport to="body">
    <!-- DELIVERY INFO MODAL -->
    <transition name="fade">
      <div 
        v-if="isOpen && !otpSent"
        @click="closeModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-105"
      ></div>
    </transition>

    <transition name="slide-scale">
      <div 
        v-if="isOpen && !otpSent"
        class="fixed inset-0 z-110 flex items-center justify-center p-4 pointer-events-none"
      >
        <div 
          @click.stop
          class="bg-white rounded-2xl shadow-xl max-w-2xl w-full pointer-events-auto overflow-y-auto max-h-[85vh]"
        >
          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Content -->
          <div class="modal-content">
            <!-- Order Summary -->
            <div class="order-summary-section">
              <h2 class="section-title">Confirm Order</h2>
              <div class="summary-items">
                <div class="summary-item">
                  <span class="summary-label">Items:</span>
                  <span class="summary-value">{{ itemsCount }} {{ itemsCount === 1 ? 'Item' : 'Items' }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Subtotal:</span>
                  <span class="summary-value">₱{{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Delivery Fee:</span>
                  <span class="summary-value">₱{{ deliveryFee.toFixed(2) }}</span>
                </div>
                <div class="summary-divider"></div>
                <span class="summary-label font-bold">Total Amount:</span>
                <span class="summary-total-amount">₱{{ total.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Delivery Information Form -->
            <div class="delivery-section">
              <h3 class="section-title">Delivery Information</h3>
              
              <form @submit.prevent="confirmOrder" class="form-group">
                <!-- Full Name -->
                <div class="form-field">
                  <label for="name" class="form-label">Full Name *</label>
                  <input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    class="form-input"
                  />
                </div>

                <!-- Email Address -->
                <div class="form-field">
                  <label for="email" class="form-label">Email Address *</label>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    class="form-input"
                  />
                </div>

                <!-- Phone Number -->
                <div class="form-field">
                  <label for="phone" class="form-label">Phone Number *</label>
                  <input
                    id="phone"
                    v-model="formData.phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    required
                    class="form-input"
                  />
                </div>

                <!-- Delivery Address -->
                <div class="form-field">
                  <label for="address" class="form-label">Delivery Address *</label>
                  <textarea
                    id="address"
                    v-model="formData.address"
                    placeholder="Enter your complete delivery address"
                    required
                    rows="4"
                    class="form-input resize-none"
                  ></textarea>
                </div>

                <!-- Payment Method Info -->
                <div class="payment-info">
                  <div class="payment-info-content">
                    <svg class="payment-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z" clip-rule="evenodd"></path>
                    </svg>
                    <div>
                      <h3 class="payment-title">Payment Method</h3>
                      <p class="payment-description">Cash on Delivery - You can pay when your order arrives</p>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons">
                  <button
                    type="button"
                    @click="closeModal"
                    class="btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    @click="handleSendOTP"
                    class="btn-confirm"
                    :disabled="isLoading"
                  >
                    {{ isLoading ? 'Sending OTP...' : 'Send OTP' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- OTP VERIFICATION MODAL -->
    <transition name="fade">
      <div 
        v-if="otpSent"
        @click="goBackToDelivery"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-105"
      ></div>
    </transition>

    <transition name="slide-scale">
      <div 
        v-if="otpSent"
        class="fixed inset-0 z-110 flex items-center justify-center p-4 pointer-events-none"
      >
        <div 
          @click.stop
          class="bg-white rounded-2xl shadow-xl max-w-2xl w-full pointer-events-auto overflow-y-auto max-h-[85vh]"
        >
          <!-- Close Button -->
          <button
            @click="goBackToDelivery"
            class="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- OTP Content -->
          <div class="modal-content otp-modal-content">
            <div class="otp-section">
              <!-- Header Icon -->
              <div class="otp-header">
                <svg class="otp-check-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
              </div>

              <h2 class="otp-modal-title">Verify Your Email</h2>
              <p class="otp-description">
                We've sent a verification code to<br><strong>{{ formData.email }}</strong>
              </p>
              
              <form @submit.prevent="verifyOTP" class="form-group">
                <!-- OTP Input -->
                <div class="form-field">
                  <label for="otp" class="form-label">Enter Verification Code *</label>
                  <input
                    id="otp"
                    v-model="otpCode"
                    type="text"
                    placeholder="000000"
                    maxlength="6"
                    pattern="\d{6}"
                    required
                    class="form-input otp-input"
                  />
                  <p class="otp-timer">
                    OTP expires in <span class="timer-number">{{ otpTimer }}</span>s
                  </p>
                </div>

                <!-- Error Message -->
                <div v-if="otpError" class="error-message">
                  <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{{ otpError }}</span>
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons">
                  <button
                    type="button"
                    @click="goBackToDelivery"
                    class="btn-cancel"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    class="btn-confirm"
                    :disabled="isVerifying || otpCode.length !== 6"
                  >
                    {{ isVerifying ? 'Verifying...' : 'Verify & Confirm Order' }}
                  </button>
                </div>
              </form>

              <!-- Resend Option -->
              <p class="resend-text">
                Didn't receive the code?
                <button
                  type="button"
                  @click="resendOTP"
                  class="resend-button"
                  :disabled="isLoading"
                >
                  {{ isLoading ? 'Sending...' : 'Resend' }}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const config = useRuntimeConfig()
const API_BASE_URL = config.public.apiBase

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  subtotal: {
    type: Number,
    default: 0
  },
  deliveryFee: {
    type: Number,
    default: 40
  },
  total: {
    type: Number,
    default: 0
  },
  itemsCount: {
    type: Number,
    default: 0
  },
  cartItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'confirm'])

const formData = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const otpSent = ref(false)
const otpCode = ref('')
const otpError = ref('')
const isLoading = ref(false)
const isVerifying = ref(false)
const otpTimer = ref(600) // 10 minutes
const otpTimerInterval = ref(null)
const userId = ref(null)

// Start OTP timer
const startOTPTimer = () => {
  otpTimer.value = 600
  otpTimerInterval.value = setInterval(() => {
    otpTimer.value--
    if (otpTimer.value <= 0) {
      clearInterval(otpTimerInterval.value)
      otpError.value = 'OTP has expired. Please request a new one.'
    }
  }, 1000)
}

// Send OTP
const sendOTP = async () => {
  try {
    console.log('🔵 Starting sendOTP with data:', {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      location: formData.value.address
    })
    
    // Validate form
    if (!formData.value.name || !formData.value.email || !formData.value.phone || !formData.value.address) {
      otpError.value = 'Please fill in all fields'
      console.warn('⚠️ Form validation failed')
      return
    }

    isLoading.value = true
    otpError.value = ''

    console.log('🔵 Making API call to /users/send-otp')
    const response = await fetch(`${API_BASE_URL}/users/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
        location: formData.value.address
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to send OTP')
    }

    const data = await response.json()
    console.log('✅ OTP sent successfully:', data)
    userId.value = data.userId
    otpSent.value = true
    startOTPTimer()
  } catch (error) {
    console.error('❌ Error sending OTP:', error)
    otpError.value = error.message || 'Failed to send OTP. Please try again.'
    console.error('Error details:', {
      message: error.message
    })
  } finally {
    isLoading.value = false
  }
}

// Verify OTP
const verifyOTP = async () => {
  try {
    isVerifying.value = true
    otpError.value = ''

    const response = await fetch(`${API_BASE_URL}/users/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId.value,
        otp: otpCode.value
      })
    })

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        errorData = { message: 'Invalid OTP' }
      }
      console.error('OTP Verification Error:', { status: response.status, error: errorData })
      throw new Error(errorData.message || `Invalid OTP (${response.status})`)
    }

    const data = await response.json()

    // OTP verified successfully, create the order
    clearInterval(otpTimerInterval.value)
    
    // Emit order data with user verification
    emit('confirm', {
      ...formData.value,
      userId: data.user.id,
      verificationStatus: 'verified',
      cartItems: props.cartItems,
      subtotal: props.subtotal,
      deliveryFee: props.deliveryFee,
      total: props.total
    })
    
    resetModal()
    closeModal()
  } catch (error) {
    otpError.value = error.message || 'Invalid OTP. Please try again.'
  } finally {
    isVerifying.value = false
  }
}

// Reset OTP
const resetOTP = () => {
  otpCode.value = ''
  otpError.value = ''
  clearInterval(otpTimerInterval.value)
}

const goBackToDelivery = () => {
  resetOTP()
  otpSent.value = false
}

const resetModal = () => {
  formData.value = { name: '', email: '', phone: '', address: '' }
  otpSent.value = false
  resetOTP()
}

const closeModal = () => {
  resetModal()
  emit('close')
}

// Handle form submission - just send OTP first
const confirmOrder = () => {
  console.log('📝 confirmOrder called')
  sendOTP()
}

const handleSendOTP = () => {
  console.log('🔘 handleSendOTP clicked')
  sendOTP()
}

// Resend OTP
const resendOTP = async () => {
  console.log('🔄 Resending OTP')
  resetOTP()
  await sendOTP()
}

// Cleanup on component unmount
onUnmounted(() => {
  if (otpTimerInterval.value) {
    clearInterval(otpTimerInterval.value)
  }
})
</script>

<style scoped>
/* Modal Container */
.modal-content {
  padding: 1.5rem 2rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Section Titles */
.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Order Summary Section */
.order-summary-section {
  padding: 0;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: linear-gradient(135deg, #FBF4E5 0%, #f5ead9 100%);
  padding: 1.25rem;
  border-radius: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.summary-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f2937;
}

.summary-divider {
  height: 1px;
  background: #d1d5db;
  margin: 0.5rem 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 2px solid #d1d5db;
}

.summary-total-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: #FE601C;
}

/* Delivery Section */
.delivery-section {
  padding: 0;
}

/* Form Styling */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #1f2937;
  background: white;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #1A4189;
  box-shadow: 0 0 0 3px rgba(254, 96, 28, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

/* Payment Info */
.payment-info {
  padding: 1rem;
  background: linear-gradient(135deg, #ebeff7 0%, #dde9fb 100%);
  border-radius: 12px;
  border: 1.5px solid #ccdeff;
}

.payment-info-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.payment-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #1A4189;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.payment-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1A4189;
  margin-bottom: 0.25rem;
}

.payment-description {
  font-size: 0.75rem;
  color: #666;
  line-height: 1.4;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1.5px solid #d1d5db;
  background: white;
  color: #374151;
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.btn-cancel:active {
  transform: scale(0.98);
}

.btn-confirm {
  flex: 1;
  padding: 0.75rem 1rem;
  background: linear-gradient(to right, #1A4189, #2356b4);
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(254, 96, 28, 0.2);
  transition: all 0.2s;
}

.btn-confirm:hover {
  box-shadow: 0 6px 12px rgba(28, 77, 254, 0.3);
  transform: translateY(-1px);
}

.btn-confirm:active {
  transform: scale(0.98);
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-scale-enter-active,
.slide-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-scale-enter-from {
  opacity: 0;
  transform: scale(0.7) translateY(20px);
}

.slide-scale-leave-to {
  opacity: 0;
  transform: scale(0.7) translateY(20px);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #545353;
  border-radius: 10px;
}

/* OTP Section */
.otp-section {
  padding: 0;
  animation: slideIn 0.3s ease;
}

.otp-modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: auto;
}

.otp-header {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.otp-check-icon {
  width: 40px;
  height: 40px;
  color: #10b981;
}

.otp-modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 0.75rem;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.otp-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  text-align: center;
}

.otp-input {
  font-size: 2rem;
  letter-spacing: 0.75rem;
  text-align: center;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
}

.otp-input::placeholder {
  letter-spacing: 0.75rem;
  font-size: 2rem;
  opacity: 0.3;
}

.otp-timer {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.75rem;
  text-align: center;
}

.timer-number {
  font-weight: bold;
  color: #FE601C;
  min-width: 35px;
  display: inline-block;
  font-size: 0.9rem;
}

.resend-text {
  font-size: 0.85rem;
  color: #666;
  text-align: center;
  margin-top: 1.5rem;
}

.resend-button {
  color: #1A4189;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.2s;
  padding: 0;
  font-size: inherit;
}

.resend-button:hover:not(:disabled) {
  color: #0f2c5a;
}

.resend-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #fee2e2;
  border-radius: 8px;
  border-left: 4px solid #dc2626;
  color: #991b1b;
  font-weight: 500;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  animation: slideIn 0.3s ease;
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #dc2626;
}

</style>