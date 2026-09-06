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
        class="fixed inset-0 z-110 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
      >
        <div
          @click.stop
          class="modal-panel bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-2xl w-full pointer-events-auto flex flex-col max-h-[92vh] sm:max-h-[85vh] relative"
        >
          <!-- Mobile drag handle -->
          <div class="sm:hidden mx-auto mt-3 mb-1 h-1 w-10 rounded-full bg-gray-300 flex-shrink-0"></div>

          <!-- Close Button -->
          <button
            @click="handleCloseBtn"
            class="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Step Indicator -->
          <div class="flex items-center justify-center gap-2.5 pt-4 sm:pt-6 pb-0 px-6 pr-14 flex-shrink-0">
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
                  <span class="summary-label">Subtotal:</span>
                  <span class="summary-value">₱{{ subtotal.toFixed(2) }}</span>
                </div>
                <div v-if="voucherCode" class="summary-item">
                  <span class="summary-label" style="color: #16a34a;">
                    <svg class="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    Voucher ({{ voucherCode }})
                  </span>
                  <span class="summary-value" style="color: #16a34a;">−₱{{ voucherDiscount.toFixed(2) }}</span>
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

                <!-- Delivery Location — map pin -->
                <div class="form-field">
                  <label class="form-label">Delivery Location *</label>
                  <p class="text-xs text-gray-500 mb-2">
                    Pin exactly where the rider should drop off. We use this to book your Grab Express / Maxim delivery.
                  </p>
                  <LocationField v-model="formData.location" :error="locationError" />
                  <p v-if="locationError" class="text-xs text-red-600 mt-2">{{ locationError }}</p>
                </div>

                <!-- Rider note -->
                <div class="form-field">
                  <label for="riderNote" class="form-label">Unit / Floor / Landmark *</label>
                  <textarea
                    id="riderNote"
                    v-model="formData.location.note"
                    rows="3"
                    maxlength="200"
                    placeholder="e.g. Unit 4B, 2nd flr. Blue gate beside the sari-sari store"
                    required
                    class="form-input"
                  />
                </div>

                <!-- Payment Method — QR Ph only -->
                <div class="form-field">
                  <label class="form-label">Payment Method *</label>
                  <div class="flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 border-[#FE601C] bg-orange-50">
                    <svg class="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 text-[#FE601C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1"/>
                      <rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" rx="1"/>
                      <path d="M14 14h3v3h-3zM21 14v7M17 21h4M14 21h.01"/>
                    </svg>
                    <div class="text-left">
                      <p class="text-[13px] sm:text-sm font-bold text-gray-800">QR Ph</p>
                      <p class="text-[11px] sm:text-xs text-gray-500 leading-snug">Pay with any bank or e-wallet app · auto-confirmed</p>
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
  },
  voucherCode: { 
    type: String, 
    default: '' 
  },
  voucherDiscount: { 
    type: Number, 
    default: 0 
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
      // Prevent scroll when modal opens
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      // Re-enable scroll when modal closes
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }
)

// ─── Step management ────────────────────────────────────────────────────────
const currentStep = ref(1) // 1 = form, 2 = otp, 3 = qr payment
const confirmedOrderId = ref(null)

// ─── Form state ─────────────────────────────────────────────────────────────
const emptyLocation = () => ({
  lat: null, lng: null, label: null, note: null,
  contactName: null, contactPhone: null, source: 'pin'
})

const formData = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  location: emptyLocation()
})

const locationError = ref('')

// Human-readable address string derived from the pin — used for the user record
// (check-email / send-otp `location` field). The order itself sends the full
// `location` object; the backend derives its own canonical string.
const derivedAddress = () => {
  const loc = formData.value.location || {}
  const parts = []
  if (loc.label) parts.push(loc.label)
  if (loc.note) parts.push(`(${loc.note})`)
  if (loc.lat && loc.lng) parts.push(`— ${loc.lat},${loc.lng}`)
  return parts.join(' ') || loc.label || ''
}

// Full delivery-location payload — pin + rider note + contact reused from the
// customer's own name/phone (no separate contact fields in the form).
const locationPayload = () => {
  const loc = formData.value.location || {}
  return {
    ...loc,
    contactName: loc.contactName || formData.value.name || null,
    contactPhone: loc.contactPhone || formData.value.phone || null
  }
}

// Returns an error message string if the pinned location is incomplete, else ''.
const validateLocation = () => {
  const loc = formData.value.location || {}
  if (!loc.lat || !loc.lng) return 'Please pin your delivery location on the map.'
  if (!loc.note || !loc.note.trim()) return 'Please add a unit / floor / house number or a landmark for the rider.'
  return ''
}

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

// ─── Payment state — QR Ph only ──────────────────────────────────────────────
const paymentMethod = ref('qrph')

const totalSteps = computed(() => 2)

// ─── Backdrop & close button behaviour ───────────────────────────────────────
const handleBackdropClick = () => {
  if (currentStep.value === 1) closeModal()
  else if (currentStep.value === 2) goBackToDelivery()
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
        location: derivedAddress()
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

    if (!formData.value.name || !formData.value.email || !formData.value.phone) {
      otpError.value = 'Please fill in all fields'
      return
    }
    const locErr = validateLocation()
    if (locErr) { otpError.value = locErr; return }

    isLoading.value = true
    otpError.value = ''

    const response = await fetch(`${API_BASE_URL}/users/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
        location: derivedAddress()
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to send OTP')
    }

    const data = await response.json()
    console.log('OTP sent successfully:', data)
    userId.value = data.userId
    currentStep.value = 2 
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

  console.log('[createOrderForQR] voucherCode prop:', props.voucherCode)
  console.log('[createOrderForQR] voucherDiscount prop:', props.voucherDiscount)

  const payload = {
    userId: userId.value,
    name: formData.value.name,
    email: formData.value.email,
    phone: formData.value.phone,
    address: derivedAddress(),
    deliveryLocation: locationPayload(),
    cartItems: transformedCartItems,
    subtotal: props.subtotal,
    total: props.total,
    notes: '',
    paymentMethod: paymentMethod.value,
    paymentReference: null,
    gcashReference: null,
    // Use explicit string check — not || null which swallows empty strings
    voucherCode: (typeof props.voucherCode === 'string' && props.voucherCode.trim())
      ? props.voucherCode.trim()
      : null,
    voucherDiscount: props.voucherDiscount || 0
  }
  
  console.log('[createOrderForQR] payload.voucherCode:', payload.voucherCode)

  const response = await fetch(`${API_BASE_URL}/orders/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
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
      total: props.total,
      itemsCount: props.cartItems.length,
      status: 'pending',
      timestamp: new Date().toISOString(),
      customer: { ...formData.value, userId: userId.value },
      verificationStatus: 'verified',
      paymentMethod: paymentMethod.value,
      deliveryAddress: derivedAddress(),
      deliveryLocation: locationPayload(),
      customerEmail: formData.value.email,
      voucher: props.voucherCode
        ? { code: props.voucherCode, discountAmount: props.voucherDiscount }
        : null
    }
    localStorage.setItem('buffs_order', JSON.stringify(orderData))
    localStorage.setItem('buffs_cart', JSON.stringify([]))
    localStorage.removeItem('buffs_voucher')
    window.dispatchEvent(new Event('cart-updated'))
  }

  confirmedOrderId.value = data.order._id
}

// ─── Proceed to checkout — QR Ph only, redirect to dedicated payment page ─────
const proceedToCheckout = async () => {
  try {
    isCreatingOrder.value = true

    await createOrderForQR()
    clearInterval(otpTimerInterval.value)
    resetModal()
    emit('close')
    router.push('/qr-payment')
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
  formData.value = { name: '', email: '', phone: '', address: '', location: emptyLocation() }
  locationError.value = ''
  currentStep.value = 1
  confirmedOrderId.value = null
  isReturningCustomer.value = false
  requiresOTP.value = false
  paymentMethod.value = 'qrph'
  resetOTP()
}

const closeModal = () => {
  resetModal()
  emit('close')
}

const confirmOrder = () => {
  console.log('confirmOrder called')
  const locErr = validateLocation()
  if (locErr) { locationError.value = locErr; otpError.value = locErr; return }
  locationError.value = ''
  checkEmailExists()
}

const handleSendOTP = () => {
  console.log('handleSendOTP clicked')
  const locErr = validateLocation()
  if (locErr) { locationError.value = locErr; otpError.value = locErr; return }
  locationError.value = ''
  isLoading.value = true
  otpError.value = ''
  checkEmailExists()
}

const resendOTP = async () => {
  console.log('Resending OTP')
  resetOTP()
  await sendOTPForNewUser()
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────
onUnmounted(() => {
  if (otpTimerInterval.value) clearInterval(otpTimerInterval.value)
  // Clean up scroll prevention
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Modal Container */
.modal-panel {
  overscroll-behavior: contain;
}

.modal-content {
  padding: 1.5rem 2rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1 1 auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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

textarea.form-input {
  min-height: 74px;
  line-height: 1.45;
  resize: none;
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

/* ─────────────── Mobile tuning ───────────────
   Compact mobile type scale, matched to Cart.vue so the two screens
   feel like one product. Only the <input> font stays at 16px — below
   that, iOS Safari auto-zooms the viewport on focus.
     section title .......... 13px / 700
     input text ............. 16px / 400   ← keep at 16, no lower
     field label ............ 10px / 600 uppercase
     helper / caption ....... 11px / 400
     summary rows ........... 12px
     button ................. 14px / 600
     step / fine print ...... 10px
     total-amount emphasis .. 20px / 700
*/
@media (max-width: 640px) {
  .modal-content {
    padding: 0.9rem 1rem 0;
    gap: 1rem;
  }

  .section-title {
    font-size: 0.8125rem; /* 13px */
    letter-spacing: 0.2px;
    margin-bottom: 0.55rem;
  }

  .summary-items {
    padding: 0.85rem;
    gap: 0.5rem;
  }

  .summary-label,
  .summary-value {
    font-size: 0.75rem; /* 12px */
  }

  .summary-total-amount {
    font-size: 1.25rem; /* 20px */
  }

  .form-group {
    gap: 0.55rem;
  }

  .form-label {
    font-size: 0.625rem; /* 10px */
    letter-spacing: 0.2px;
    margin-bottom: 0.3rem;
  }

  /* Helper / hint line under a label (e.g. delivery-location note) */
  .form-field p.text-xs {
    font-size: 0.6875rem; /* 11px */
    line-height: 1.4;
  }

  .form-input {
    font-size: 1rem; /* 16px — do NOT reduce, prevents iOS focus zoom */
    padding: 0.6rem 0.85rem;
  }

  /* Placeholder can be smaller than the input without triggering the
     iOS zoom (that keys off the input's own font-size, not this). */
  .form-input::placeholder {
    font-size: 0.8125rem; /* 13px */
  }

  textarea.form-input {
    min-height: 76px;
  }

  /* Sticky bottom action bar so Confirm is always reachable */
  .action-buttons {
    position: sticky;
    bottom: 0;
    margin: 0.25rem -1.1rem 0;
    padding: 0.8rem 1.1rem calc(0.8rem + env(safe-area-inset-bottom, 0px));
    background: #fff;
    border-top: 1px solid #f0f0f0;
    box-shadow: 0 -4px 14px rgba(0, 0, 0, 0.06);
    z-index: 5;
  }

  .btn-cancel,
  .btn-confirm {
    padding: 0.72rem 0.75rem;
    font-size: 0.875rem; /* 14px */
    white-space: nowrap;
    border-radius: 10px;
  }

  .btn-cancel {
    flex: 0 0 auto;
    min-width: 92px;
  }

  .btn-confirm {
    flex: 1 1 auto;
  }

  .otp-header {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
  }

  .otp-check-icon {
    width: 32px;
    height: 32px;
  }

  .otp-modal-title {
    font-size: 1.25rem;
  }

  .otp-description {
    font-size: 0.85rem;
    margin-bottom: 1.15rem;
  }

  .otp-input {
    font-size: 1.6rem;
    letter-spacing: 0.5rem;
  }

  .otp-input::placeholder {
    font-size: 1.6rem;
    letter-spacing: 0.5rem;
  }
}

</style>