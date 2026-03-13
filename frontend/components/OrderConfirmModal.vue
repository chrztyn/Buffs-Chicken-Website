<template>
  <teleport to="body">
    <!-- Backdrop -->
    <transition name="fade">
      <div
        v-if="isOpen"
        @click="handleBackdropClick"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-105"
      ></div>
    </transition>

    <!-- Modal Panel -->
    <transition name="slide-scale">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-110 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          @click.stop
          class="bg-white rounded-2xl shadow-xl max-w-2xl w-full pointer-events-auto overflow-y-auto max-h-[85vh] relative"
        >
          <!-- Close Button -->
          <button
            @click="handleCloseBtn"
            class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Step Indicator -->
          <div class="flex items-center justify-center gap-2.5 pt-6 pb-0 px-6">
            <div class="flex gap-1.5 items-center">
              <div
                v-for="n in totalSteps"
                :key="n"
                :class="n <= currentStep ? 'bg-[#FE601C] w-5' : 'bg-gray-200 w-2'"
                class="h-2 rounded-full transition-all duration-300"
              ></div>
            </div>
            <span class="text-[10px] text-gray-400 font-medium">Step {{ currentStep }} of {{ totalSteps }}</span>
          </div>

          <!-- ─────────────── STEP 1: ORDER FORM ─────────────── -->
          <div v-if="currentStep === 1" class="modal-content">
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

                <!-- Payment Method -->
                <div class="form-field">
                  <label class="form-label">Payment Method *</label>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    <!-- Cash on Delivery (Coming Soon) -->
                    <div
                      class="col-span-2 sm:col-span-3 flex items-center gap-2 p-3 min-h-[64px] rounded-xl border border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed text-left"
                    >
                      <svg class="w-7 h-7 flex-shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="2"/>
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M6 12h.01M18 12h.01"/>
                      </svg>
                      <div>
                        <p class="text-sm font-bold text-gray-400">Cash on Delivery</p>
                        <p class="text-xs text-gray-400">Coming soon</p>
                      </div>
                    </div>
                    <!-- GCash -->
                    <button
                      type="button"
                      @click="selectPayment('gcash')"
                      :class="paymentMethod === 'gcash' ? 'border-2 border-[#FE601C] bg-orange-50' : 'border border-gray-200 bg-white hover:border-gray-300'"
                      class="flex flex-col items-center justify-center gap-1 p-2 min-h-[64px] rounded-xl transition-all duration-200 text-center overflow-hidden"
                    >
                      <img src="/gcash-logo.png" alt="GCash" class="w-full h-8 object-contain" />
                      <p class="text-xs font-bold text-gray-800">GCash</p>
                    </button>
                    <!-- Maya -->
                    <button
                      type="button"
                      @click="selectPayment('maya')"
                      :class="paymentMethod === 'maya' ? 'border-2 border-[#FE601C] bg-orange-50' : 'border border-gray-200 bg-white hover:border-gray-300'"
                      class="flex flex-col items-center justify-center gap-1 p-2 min-h-[64px] rounded-xl transition-all duration-200 text-center overflow-hidden"
                    >
                      <img src="/maya-logo.jpg" alt="Maya" class="w-full h-10 object-contain" />
                      <p class="text-xs font-bold text-gray-800">Maya</p>
                    </button>
                    <!-- Maribank -->
                    <button
                      type="button"
                      @click="selectPayment('maribank')"
                      :class="paymentMethod === 'maribank' ? 'border-2 border-[#FE601C] bg-orange-50' : 'border border-gray-200 bg-white hover:border-gray-300'"
                      class="flex flex-col items-center justify-center gap-1 p-2 min-h-[64px] rounded-xl transition-all duration-200 text-center overflow-hidden"
                    >
                      <img src="/maribank-logo.png" alt="Maribank" class="w-full h-10 object-contain" />
                      <p class="text-xs font-bold text-gray-800">Maribank</p>
                    </button>
                    <!-- BPI -->
                    <button
                      type="button"
                      @click="selectPayment('bpi')"
                      :class="paymentMethod === 'bpi' ? 'border-2 border-[#FE601C] bg-orange-50' : 'border border-gray-200 bg-white hover:border-gray-300'"
                      class="flex flex-col items-center justify-center gap-1 p-2 min-h-[64px] rounded-xl transition-all duration-200 text-center overflow-hidden"
                    >
                      <img src="/bpi-logo.jpg" alt="BPI" class="w-full h-10 object-contain" />
                      <p class="text-xs font-bold text-gray-800">BPI</p>
                    </button>
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
                    {{ isLoading ? 'Please wait...' : 'Confirm Order' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- ─────────────── STEP 2: OTP VERIFICATION ─────────────── -->
          <div v-if="currentStep === 2" class="modal-content otp-modal-content">
            <!-- Loading Overlay for OTP Verification + Order Creation -->
            <div v-if="isVerifying" class="loading-overlay">
              <div class="loading-spinner">
                <svg class="spinner-icon" viewBox="0 0 50 50">
                  <circle class="spinner-circle" cx="25" cy="25" r="20" fill="none" stroke-width="3"></circle>
                </svg>
                <p class="loading-text">{{ isCreatingOrder ? 'Creating your order...' : 'Verifying your code...' }}</p>
              </div>
            </div>

            <div class="otp-section" :class="{ 'opacity-50 pointer-events-none': isVerifying }">
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
                    :disabled="isVerifying"
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
                    :disabled="isVerifying"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    class="btn-confirm"
                    :disabled="isVerifying || otpCode.length !== 6"
                  >
                    {{ isVerifying ? (isCreatingOrder ? 'Creating order...' : 'Verifying...') : 'Verify & Confirm Order' }}
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
                  :disabled="isLoading || isVerifying"
                >
                  {{ isLoading ? 'Sending...' : 'Resend' }}
                </button>
              </p>
            </div>
          </div>

          <!-- ─────────────── STEP 3: QR PAYMENT + RECEIPT UPLOAD ─────────────── -->
          <div v-if="currentStep === 3 && currentPaymentConfig" class="modal-content">
            <!-- Header -->
            <div class="text-center mb-3">
              <h2 class="text-base sm:text-lg font-bold text-[#1A4189]">Almost done! Complete your payment</h2>
              <p class="text-xs text-gray-500 mt-1">Transfer via {{ currentPaymentConfig.label }} and upload your receipt below</p>
            </div>

            <!-- QR Code -->
            <div class="flex flex-col items-center">
              <img
                :src="currentPaymentConfig.qrImage"
                :alt="currentPaymentConfig.label + ' QR Code'"
                :class="paymentMethod === 'gcash' ? 'rotate-180' : ''"
                class="w-44 h-44 sm:w-48 sm:h-48 max-w-full rounded-xl object-contain border border-gray-200 bg-white"
              />

              <!-- Quick Action Buttons — must fit side-by-side at 320px -->
              <div class="flex gap-2 justify-center mt-3 w-full max-w-full overflow-hidden px-2">
                <button
                  type="button"
                  @click="downloadQR"
                  class="flex items-center gap-1 border border-[#1A4189] text-[#1A4189] bg-transparent px-3 py-1.5 rounded-full text-xs min-h-[36px] hover:bg-blue-50 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                >
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download QR
                </button>
                <button
                  type="button"
                  @click="copyNumber"
                  class="flex items-center gap-1.5 border border-[#1A4189] text-[#1A4189] bg-transparent px-3 py-1.5 rounded-full text-xs min-h-[36px] hover:bg-blue-50 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                >
                  <svg v-if="!copySuccess" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 flex-shrink-0 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span :class="copySuccess ? 'text-green-600' : ''">{{ copySuccess ? 'Copied!' : 'Copy Number' }}</span>
                </button>
              </div>

              <!-- Account Details -->
              <div class="mt-3 text-center">
                <p class="text-sm font-bold text-gray-800">{{ currentPaymentConfig.accountName }}</p>
                <p class="text-sm font-semibold text-gray-600">{{ currentPaymentConfig.accountNumber }}</p>
                <p class="text-xs text-gray-500 mt-0.5 italic">{{ currentPaymentConfig.instruction }}</p>
              </div>
            </div>

            <!-- Divider -->
            <div class="flex items-center gap-2 my-4">
              <div class="flex-1 h-px bg-gray-200"></div>
              <span class="text-xs text-gray-400 whitespace-nowrap">Then upload your receipt</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>

            <!-- Upload Zone (hidden when file already selected) -->
            <div
              v-if="!receiptFile"
              @click="openFilePicker"
              class="min-h-[80px] flex flex-col items-center justify-center border-2 border-dashed border-[#FE601C] rounded-xl p-4 cursor-pointer hover:bg-orange-50 transition-colors duration-200"
            >
              <svg class="w-8 h-8 text-[#FE601C] mb-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <p class="text-sm font-bold text-gray-700">Upload Payment Receipt</p>
              <p class="text-xs text-gray-400 mt-0.5">Tap to upload your screenshot</p>
            </div>

            <!-- Hidden File Input — capture="environment" opens camera on mobile -->
            <input
              ref="receiptInput"
              type="file"
              accept="image/*"
              capture="environment"
              class="hidden"
              @change="handleFileSelect"
            />

            <!-- Receipt Preview -->
            <div v-if="receiptFile && receiptPreviewUrl" class="mt-3">
              <img
                :src="receiptPreviewUrl"
                class="max-h-40 w-full object-contain rounded-xl border border-gray-200"
                alt="Receipt preview"
              />
              <div class="flex items-center justify-between mt-2 px-1">
                <span class="text-xs text-green-600 font-semibold flex items-center gap-1">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Receipt ready
                </span>
                <button
                  type="button"
                  @click="removeReceipt"
                  class="text-xs text-red-500 hover:text-red-700 underline transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            </div>

            <!-- Client-side / Upload Error -->
            <div v-if="receiptError" class="mt-2 p-3 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <p class="text-xs text-red-600">{{ receiptError }}</p>
            </div>

            <!-- Paid Button -->
            <button
              type="button"
              @click="paid"
              :disabled="!receiptFile || receiptUploading"
              :class="!receiptFile || receiptUploading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#FE601C] text-white hover:bg-[#e25519] hover:shadow-lg active:scale-[0.98]'"
              class="w-full mt-4 py-3.5 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg
                v-if="receiptUploading"
                class="w-5 h-5 animate-spin flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ receiptUploading ? 'Uploading...' : 'Paid' }}
            </button>
          </div>

        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const config = useRuntimeConfig()
const API_BASE_URL = config.public.apiBase
const router = useRouter()

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

// Track checkout started when the modal is opened
const { trackCheckoutStarted } = useTracking()
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      trackCheckoutStarted(props.itemsCount, props.total)
    }
  }
)

// ─── Step management ────────────────────────────────────────────────────────
const currentStep = ref(1) // 1 = form, 2 = otp, 3 = qr payment
const confirmedOrderId = ref(null)

// ─── Form state ─────────────────────────────────────────────────────────────
const formData = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

// ─── OTP state ──────────────────────────────────────────────────────────────
const otpCode = ref('')
const otpError = ref('')
const isLoading = ref(false)
const isVerifying = ref(false)
const isCreatingOrder = ref(false)
const otpTimer = ref(600)
const otpTimerInterval = ref(null)
const userId = ref(null)
const isReturningCustomer = ref(false)
const requiresOTP = ref(false)

// ─── Payment state ───────────────────────────────────────────────────────────
const paymentMethod = ref('gcash')

// ─── Receipt state (Step 3) ──────────────────────────────────────────────────
const receiptFile = ref(null)
const receiptPreviewUrl = ref(null)
const receiptUploading = ref(false)
const receiptError = ref(null)
const receiptInput = ref(null)
const copySuccess = ref(false)

// ─── Payment config ──────────────────────────────────────────────────────────
const paymentConfig = {
  gcash: {
    label: 'GCash',
    qrImage: '/gcash-qr.jpg',
    accountName: 'Buffs Chicken',
    accountNumber: '0927 064 3105',
    instruction: 'Scan with your GCash app',
    color: '#007DFF'
  },
  maya: {
    label: 'Maya',
    qrImage: '/maya-qr.jpg',
    accountName: 'Buffs Chicken',
    accountNumber: '0917 182 0520',
    instruction: 'Scan with your Maya app',
    color: '#42A647'
  },
  maribank: {
    label: 'Maribank',
    qrImage: '/maribank-qr.jpg',
    accountName: 'Buffs Chicken',
    accountNumber: '18172480645',
    instruction: 'Scan with your Maribank app',
    color: '#6B21A8'
  },
  bpi: {
    label: 'BPI',
    qrImage: '/bpi-qr.jpg',
    accountName: 'Buffs Chicken',
    accountNumber: '2569295354',
    instruction: 'Scan with your BPI app',
    color: '#CC0000'
  }
}

const isQrPayment = computed(() => ['gcash', 'maya', 'maribank', 'bpi'].includes(paymentMethod.value))
const currentPaymentConfig = computed(() => paymentConfig[paymentMethod.value] || null)
const totalSteps = computed(() => isQrPayment.value ? 3 : 2)

const selectPayment = (method) => {
  paymentMethod.value = method
}

// ─── Backdrop & close button behaviour ───────────────────────────────────────
const handleBackdropClick = () => {
  if (currentStep.value === 1) closeModal()
  else if (currentStep.value === 2) goBackToDelivery()
  // Step 3: order already placed — do nothing on backdrop click
}

const handleCloseBtn = () => {
  if (currentStep.value === 2) goBackToDelivery()
  else closeModal()
}

// ─── OTP timer ───────────────────────────────────────────────────────────────
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

// ─── Email check ─────────────────────────────────────────────────────────────
const checkEmailExists = async () => {
  try {
    console.log('Checking if email exists:', formData.value.email)

    const response = await fetch(`${API_BASE_URL}/users/check-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.value.email,
        name: formData.value.name,
        phone: formData.value.phone,
        location: formData.value.address
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to check email')
    }

    const data = await response.json()
    console.log('Email check result:', data)

    if (data.exists) {
      isReturningCustomer.value = true
      requiresOTP.value = false
      userId.value = data.userId
      formData.value.name = data.name || formData.value.name
      formData.value.phone = data.phone || formData.value.phone
      formData.value.address = data.location || formData.value.address
      await proceedToCheckout()
    } else {
      isReturningCustomer.value = false
      requiresOTP.value = true
      await sendOTPForNewUser()
    }
  } catch (error) {
    console.error('Error checking email:', error)
    otpError.value = error.message || 'Failed to verify email. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// ─── OTP send ────────────────────────────────────────────────────────────────
const sendOTPForNewUser = async () => {
  try {
    console.log('Sending OTP for new user:', formData.value.email)

    if (!formData.value.name || !formData.value.email || !formData.value.phone || !formData.value.address) {
      otpError.value = 'Please fill in all fields'
      return
    }

    isLoading.value = true
    otpError.value = ''

    const response = await fetch(`${API_BASE_URL}/users/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    console.log('OTP sent successfully:', data)
    userId.value = data.userId
    currentStep.value = 2 // advance to OTP step
    startOTPTimer()
  } catch (error) {
    console.error('Error sending OTP:', error)
    otpError.value = error.message || 'Failed to send OTP. Please try again.'
    isReturningCustomer.value = false
    requiresOTP.value = false
  } finally {
    isLoading.value = false
  }
}

// ─── OTP verify ──────────────────────────────────────────────────────────────
const verifyOTP = async () => {
  try {
    isVerifying.value = true
    otpError.value = ''

    const response = await fetch(`${API_BASE_URL}/users/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId.value,
        otp: otpCode.value
      })
    })

    if (!response.ok) {
      let errorData
      try { errorData = await response.json() } catch (e) { errorData = { message: 'Invalid OTP' } }
      console.error('OTP Verification Error:', { status: response.status, error: errorData })
      throw new Error(errorData.message || `Invalid OTP (${response.status})`)
    }

    // OTP verified — proceed to checkout
    clearInterval(otpTimerInterval.value)
    await proceedToCheckout()
  } catch (error) {
    otpError.value = error.message || 'Invalid OTP. Please try again.'
  } finally {
    isVerifying.value = false
    isCreatingOrder.value = false
  }
}

// ─── Cart item transformation (mirrors Cart.vue logic) ───────────────────────
const transformCartItems = () => {
  return props.cartItems.map(item => {
    const selectedAddonsArray = item.selectedAddons || []
    const itemAddons = item.addons || []
    const itemSauces = item.sauces || []
    const selectedSaucesObj = item.selectedSauces || {}

    const transformedAddons = selectedAddonsArray.map(addonName => {
      if (typeof addonName === 'object' && addonName !== null) return addonName
      const addonObj = itemAddons.find(a => a.name === addonName)
      return { name: addonName, price: addonObj ? addonObj.price : 0 }
    })

    let transformedSauces = []
    if (Array.isArray(selectedSaucesObj) && selectedSaucesObj.length > 0) {
      transformedSauces = selectedSaucesObj
    } else if (typeof selectedSaucesObj === 'object' && Object.keys(selectedSaucesObj).length > 0) {
      Object.entries(selectedSaucesObj).forEach(([sauceName, selectedOptions]) => {
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
          selectedOptions.forEach(optionName => {
            const sauceGroup = itemSauces.find(s => s.name === sauceName)
            if (sauceGroup) {
              const sauceOption = sauceGroup.options.find(o => o.name === optionName)
              if (sauceOption) {
                transformedSauces.push({ name: optionName, price: sauceOption.price || 0 })
              }
            }
          })
        }
      })
    }

    return { ...item, selectedAddons: transformedAddons, selectedSauces: transformedSauces }
  })
}

// ─── Create order for QR payment (stores orderId, clears cart localStorage) ──
const createOrderForQR = async () => {
  const transformedCartItems = transformCartItems()

  const response = await fetch(`${API_BASE_URL}/orders/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: userId.value,
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      address: formData.value.address,
      cartItems: transformedCartItems,
      subtotal: props.subtotal,
      deliveryFee: props.deliveryFee,
      total: props.total,
      notes: '',
      paymentMethod: paymentMethod.value,
      paymentReference: null,
      gcashReference: null
    })
  })

  if (!response.ok) {
    const errData = await response.json()
    if (errData.storeClosed) {
      alert('Store is Currently Closed\n\n' + errData.message + '\n\nPlease check our operating hours and try again when we\'re open.')
      if (process.client) window.location.reload()
      return
    }
    throw new Error(errData.message || 'Failed to create order')
  }

  const data = await response.json()

  // Save order data and clear cart in localStorage
  if (process.client) {
    const orderData = {
      orderId: data.order._id,
      orderNumber: data.orderNumber,
      userId: userId.value,
      items: props.cartItems,
      subtotal: props.subtotal,
      deliveryFee: props.deliveryFee,
      total: props.total,
      itemsCount: props.cartItems.length,
      status: 'pending',
      timestamp: new Date().toISOString(),
      customer: { ...formData.value, userId: userId.value },
      verificationStatus: 'verified'
    }
    localStorage.setItem('buffs_order', JSON.stringify(orderData))
    localStorage.setItem('buffs_cart', JSON.stringify([]))
    window.dispatchEvent(new Event('cart-updated'))
  }

  confirmedOrderId.value = data.order._id
}

// ─── Proceed to checkout (split by payment method) ────────────────────────────
const proceedToCheckout = async () => {
  try {
    isCreatingOrder.value = true

    if (isQrPayment.value) {
      await createOrderForQR()
      clearInterval(otpTimerInterval.value)
      currentStep.value = 3
    } else {
      // Cash on Delivery — keep existing flow, Cart.vue handles everything
      emit('confirm', {
        ...formData.value,
        userId: userId.value,
        verificationStatus: 'verified',
        cartItems: props.cartItems,
        subtotal: props.subtotal,
        deliveryFee: props.deliveryFee,
        total: props.total,
        isReturningCustomer: isReturningCustomer.value,
        paymentMethod: paymentMethod.value,
        paymentReference: null,
        gcashReference: null
      })
      resetModal()
      emit('close')
    }
  } catch (error) {
    console.error('Error proceeding to checkout:', error)
    otpError.value = error.message || 'Failed to proceed. Please try again.'
  } finally {
    isCreatingOrder.value = false
  }
}

// ─── OTP helpers ─────────────────────────────────────────────────────────────
const resetOTP = () => {
  otpCode.value = ''
  otpError.value = ''
  clearInterval(otpTimerInterval.value)
}

const goBackToDelivery = () => {
  resetOTP()
  currentStep.value = 1
}

const resetModal = () => {
  formData.value = { name: '', email: '', phone: '', address: '' }
  currentStep.value = 1
  confirmedOrderId.value = null
  isReturningCustomer.value = false
  requiresOTP.value = false
  paymentMethod.value = 'gcash'
  if (receiptPreviewUrl.value) URL.revokeObjectURL(receiptPreviewUrl.value)
  receiptFile.value = null
  receiptPreviewUrl.value = null
  copySuccess.value = false
  receiptUploading.value = false
  receiptError.value = null
  resetOTP()
}

const closeModal = () => {
  resetModal()
  emit('close')
}

const confirmOrder = () => {
  console.log('confirmOrder called')
  checkEmailExists()
}

const handleSendOTP = () => {
  console.log('handleSendOTP clicked')
  isLoading.value = true
  otpError.value = ''
  checkEmailExists()
}

const resendOTP = async () => {
  console.log('Resending OTP')
  resetOTP()
  await sendOTPForNewUser()
}

// ─── Step 3: QR quick actions ─────────────────────────────────────────────────
const downloadQR = () => {
  if (!currentPaymentConfig.value) return
  const link = document.createElement('a')
  link.href = currentPaymentConfig.value.qrImage
  link.download = `buffs-chicken-${paymentMethod.value}-qr.jpg`
  link.click()
}

const copyNumber = async () => {
  if (!currentPaymentConfig.value) return
  try {
    await navigator.clipboard.writeText(currentPaymentConfig.value.accountNumber)
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  } catch {
    // Silent fail — clipboard not supported on all browsers
  }
}

// ─── Step 3: Receipt upload ───────────────────────────────────────────────────
const openFilePicker = () => {
  receiptInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target?.files?.[0]
  receiptError.value = null

  if (!file) return

  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
  if (!validTypes.includes(file.type) && !file.type.startsWith('image/')) {
    receiptError.value = 'Please upload an image file'
    if (event.target) event.target.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    receiptError.value = 'Image too large. Please upload under 5MB'
    if (event.target) event.target.value = ''
    return
  }

  receiptFile.value = file
  if (receiptPreviewUrl.value) URL.revokeObjectURL(receiptPreviewUrl.value)
  receiptPreviewUrl.value = URL.createObjectURL(file)
}

const removeReceipt = () => {
  if (receiptPreviewUrl.value) URL.revokeObjectURL(receiptPreviewUrl.value)
  receiptFile.value = null
  receiptPreviewUrl.value = null
  receiptError.value = null
  if (receiptInput.value) receiptInput.value.value = ''
}

// ─── Step 3: Paid button ──────────────────────────────────────────────────────
const paid = async () => {
  receiptUploading.value = true
  receiptError.value = null
  let uploadFailed = false

  try {
    const fd = new FormData()
    fd.append('receipt', receiptFile.value)
    const response = await fetch(`${API_BASE_URL}/orders/${confirmedOrderId.value}/receipt`, {
      method: 'POST',
      body: fd
    })
    if (!response.ok) uploadFailed = true
  } catch {
    uploadFailed = true
  }

  if (uploadFailed) {
    receiptError.value = 'Receipt upload failed. Please message us on Facebook.'
    await new Promise(resolve => setTimeout(resolve, 2500))
  }

  // Always redirect — never block on upload failure
  router.push('/order-status')
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────
onUnmounted(() => {
  if (otpTimerInterval.value) clearInterval(otpTimerInterval.value)
  if (receiptPreviewUrl.value) URL.revokeObjectURL(receiptPreviewUrl.value)
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

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  z-index: 50;
  backdrop-filter: blur(2px);
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner-icon {
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.spinner-circle {
  stroke: #FE601C;
  stroke-dasharray: 31.4;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
}

.loading-text {
  font-size: 0.95rem;
  color: #1f2937;
  font-weight: 600;
  font-family: 'Unbounded', sans-serif;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 31.4;
  }
  50% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -31.4;
  }
}

</style>