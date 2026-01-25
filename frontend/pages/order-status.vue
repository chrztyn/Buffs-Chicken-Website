<template>
  <div class="order-status-container bg-gradient-to-br from-[#FBF4E5] via-[#fef9ed] to-[#f5ead9] min-h-screen flex flex-col relative overflow-hidden">
    <!-- Decorative Background Elements -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#2356b4]/5 to-transparent rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#1A4189]/5 to-transparent rounded-full blur-3xl"></div>
    
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <div class="flex-1 py-8 relative z-10">
      <div class="content-wrapper">
        <!-- Header Card -->
        <div class="status-header text-white px-8 py-8 rounded-2xl mb-10 shadow-2xl relative overflow-hidden">
          <div class="relative z-10 flex items-center gap-4">
            <div class="flex items-center justify-center">
              <svg class="button-checkmark w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-xl sm:text-2xl font-bold mb-1">Order Confirmed!</h1>
              <p class="text-white/80 text-xs font-medium">Track your order status in real-time</p>
            </div>
          </div>
        </div>

        <!-- No Order State with Enhanced Design -->
        <div v-if="!hasOrder" class="flex flex-col items-center justify-center py-20 px-6">
          <div class="relative mb-8">
            <div class="absolute inset-0 bg-gradient-to-br from-[#2356b4]/20 to-[#1A4189]/20 rounded-full blur-2xl"></div>
            <div class="relative w-32 h-32 bg-gradient-to-br from-white to-[#f5ead9] rounded-full flex items-center justify-center shadow-xl border-4 border-white/50">
              <svg class="w-16 h-16 text-[#1A4189]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <h2 class="text-3xl sm:text-4xl font-['Unbounded'] font-bold text-gray-800 mb-3 text-center">No Active Order</h2>
          <p class="text-gray-600 text-center mb-10 max-w-md text-lg leading-relaxed">You don't have any active orders. Start ordering from our menu and experience delicious flavors!</p>
          <NuxtLink
            to="/menu"
            class="group px-10 py-4 bg-gradient-to-r from-[#1A4189] to-[#2356b4] text-white rounded-xl font-['Unbounded'] font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
          >
            <span class="relative z-10 flex items-center gap-2">
              Browse Menu
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </span>
            <div class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </NuxtLink>
        </div>

        <!-- Order Details -->
        <div v-else>
          <!-- Progress Timeline Section with Modern Design -->
          <div class="mb-10 pb-8 border-b border-gray-200/50">
            <div class=" flex items-center gap-3 mb-8">
              <div class="w-1 h-8 bg-gradient-to-b from-[#1A4189] to-[#2356b4] rounded-full"></div>
              <h3 class="section-title">Order Status</h3>
            </div>
            
            <div class="order-status bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
              <div class="flex items-center justify-between mb-6">
                <div
                  v-for="(status, index) in statuses"
                  :key="status.id"
                  class="flex flex-col items-center flex-1 relative"
                >
                  <!-- Connecting Line -->
                  <div
                    v-if="index < statuses.length - 1"
                    :class="[
                      'absolute top-6 h-0.5 transition-all duration-700 rounded-full',
                      'hidden'
                    ]"
                    style="width: calc(100% - 1rem); transform: translateX(0.5rem)"
                  ></div>

                  <!-- Status Circle with Enhanced Animation -->
                  <div
                    :class="[
                      'w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 relative z-10 border-4',
                      isStatusActive(status.id)
                        ? 'bg-gradient-to-br from-[#1A4189] to-[#2356b4] text-white shadow-xl scale-125 border-white animate-pulse-slow'
                        : isStatusCompleted(status.id)
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg border-white'
                        : 'bg-white text-gray-400 border-gray-300'
                    ]"
                  >
                    <svg v-if="isStatusCompleted(status.id)" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span v-else>{{ index + 1 }}</span>
                  </div>

                  <!-- Status Label with Better Typography -->
                  <p
                    :class="[
                      'status-label text-xs font-bold text-center transition-all duration-300',
                      isStatusActive(status.id)
                        ? 'text-[#1A4189] scale-110'
                        : isStatusCompleted(status.id)
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    ]"
                    style="font-family: 'Unbounded', sans-serif;"
                  >
                    {{ status.label }}
                  </p>
                </div>
              </div>

              <!-- Progress Bar with Gradient -->
              <div class="relative h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  class="h-full bg-gradient-to-r from-[#1A4189] via-[#1e4d9f] to-[#2356b4] rounded-full transition-all duration-700 relative overflow-hidden"
                  :style="{ width: `${getProgressPercentage()}%` }"
                >
                  <div class="absolute inset-0 bg-white/30 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Details Card with Premium Design -->
          <div class="mb-10 pb-8 border-b border-gray-200/50">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-1 h-8 bg-gradient-to-b from-[#1A4189] to-[#2356b4] rounded-full"></div>
              <h3 class="section-title">Order Summary</h3>
            </div>
            <div class="summary-card">
              <div class="summary-items">
                <div class="summary-item group">
                  <span class="summary-label">
                    <svg class="w-4 h-4 inline mr-2 text-[#1A4189]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Subtotal
                  </span>
                  <span class="summary-value">₱{{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="summary-item group">
                  <span class="summary-label">
                    <svg class="w-4 h-4 inline mr-2 text-[#1A4189]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                    </svg>
                    Delivery Fee
                  </span>
                  <span class="summary-value">₱{{ deliveryFee.toFixed(2) }}</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-item-total">
                  <span class="summary-label-total">Total Amount</span>
                  <span class="summary-total-amount">₱{{ total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Status-Specific Content with Modern Cards -->
          <div class="mb-10 pb-8 border-b border-gray-200/50">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-1 h-8 bg-gradient-to-b from-[#1A4189] to-[#2356b4] rounded-full"></div>
              <h3 class="section-title">Status Update</h3>
            </div>
            
            <div v-if="currentStatus === 'confirming'" class="status-alert status-alert-blue">
              <div class="status-icon-wrapper status-icon-blue">
                <svg class="status-alert-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h4 class="status-alert-title">Confirming Your Order</h4>
                <p class="status-alert-description">Your order is being verified. Please wait a moment while we process your request.</p>
              </div>
            </div>

            <div v-if="currentStatus === 'preparing'" class="status-alert status-alert-yellow">
              <div class="status-icon-wrapper status-icon-yellow">
                <svg class="status-alert-icon animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <h4 class="status-alert-title">Preparing Your Delicious Order</h4>
                <p class="status-alert-description">Our chefs are now preparing your meal with fresh ingredients and care.</p>
              </div>
            </div>

            <div v-if="currentStatus === 'outForDelivery'" class="status-alert status-alert-purple">
              <div class="status-icon-wrapper status-icon-purple">
                <svg class="status-alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9-4v2m4-2v2"></path>
                </svg>
              </div>
              <div>
                <h4 class="status-alert-title">Out for Delivery</h4>
                <p class="status-alert-description">Your order is on its way! Our driver will arrive at your location soon.</p>
              </div>
            </div>

            <div v-if="currentStatus === 'delivered'" class="status-alert status-alert-green">
              <div class="status-icon-wrapper status-icon-green">
                <svg class="status-alert-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h4 class="status-alert-title">Delivered Successfully!</h4>
                <p class="status-alert-description">Your order has arrived. Enjoy your delicious meal!</p>
              </div>
            </div>
          </div>

          <!-- Delivery Info with Enhanced Design -->
          <div class="mb-10 pb-20">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-1 h-8 bg-gradient-to-b from-[#1A4189] to-[#2356b4] rounded-full"></div>
              <h3 class="section-title">Delivery Information</h3>
            </div>
            <div class="info-card">
              <div class="info-items">
                <div class="info-item group">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-[#1A4189] to-[#2356b4] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <span class="info-label">Delivery Address</span>
                      <span class="info-value">Your Location</span>
                    </div>
                  </div>
                </div>
                <div class="info-divider"></div>
                <div class="info-item group">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <span class="info-label">Payment Method</span>
                      <span class="info-value">Cash on Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()

const orderId = ref('')
const currentStatus = ref('confirming')
const hasOrder = ref(false)

const subtotal = ref(0)
const deliveryFee = ref(40)
const itemsCount = ref(0)

const statuses = ref([
  { id: 'confirming', label: 'Confirming' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'outForDelivery', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' }
])

const statusOrder = {
  confirming: 0,
  preparing: 1,
  outForDelivery: 2,
  delivered: 3
}

const total = computed(() => subtotal.value + deliveryFee.value)

const getProgressPercentage = () => {
  const currentIndex = statusOrder[currentStatus.value]
  const totalSteps = statuses.value.length - 1
  return ((currentIndex) / totalSteps) * 100
}

const isStatusActive = (statusId) => {
  return currentStatus.value === statusId
}

const isStatusCompleted = (statusId) => {
  return statusOrder[statusId] < statusOrder[currentStatus.value]
}

const loadOrder = () => {
  const saved = localStorage.getItem('buffs_order')
  if (saved) {
    const order = JSON.parse(saved)
    orderId.value = order.orderId
    currentStatus.value = order.status
    subtotal.value = order.subtotal
    deliveryFee.value = order.deliveryFee
    itemsCount.value = order.itemsCount
    hasOrder.value = true
  }
}

const clearOrder = () => {
  localStorage.removeItem('buffs_order')
  hasOrder.value = false
  orderId.value = ''
  currentStatus.value = 'confirming'
}

const updateOrderStatus = () => {
  if (currentStatus.value === 'confirming') {
    currentStatus.value = 'preparing'
    setTimeout(() => {
      currentStatus.value = 'outForDelivery'
      saveOrderStatus()
    }, 3000)

    setTimeout(() => {
      currentStatus.value = 'delivered'
      saveOrderStatus()
    }, 6000)
  }
}

const saveOrderStatus = () => {
  const order = JSON.parse(localStorage.getItem('buffs_order') || '{}')
  order.status = currentStatus.value
  localStorage.setItem('buffs_order', JSON.stringify(order))
}

onMounted(() => {
  loadOrder()
  if (hasOrder.value) {
    updateOrderStatus()
  }
})
</script>

<style scoped>
/* Container Styling */
.order-status-container {
  margin: 0;
  padding: 0;
  position: relative;
}

.status-header {
  min-height: 5rem;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1A4189 0%, #2356b4 100%);
}

.content-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
  margin-top: 4rem;
}

.order-status {
  margin-top: 1rem;
}

.button-checkmark {
  margin-left: 1rem;
}

/* Section Title */
.section-title {
  font-size: 0.7rem;
  font-weight: 800;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

/* Status Label */
.status-label {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

/* Completed Status Circle - Smaller */
:deep(.bg-gradient-to-br.from-green-400.to-green-600) {
  transform: scale(0.85);
  margin-top: 0.5rem; 
}

/* Progress Bar - Reduce Width */
.relative.h-2.bg-gray-200.rounded-full {
  max-width: 100%;
  margin: 0 auto;
}

/* Order Summary Card */
.summary-card {
  margin-top: 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%);
  backdrop-filter: blur(20px);
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 10px 40px rgba(26, 65, 137, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
}

.summary-item:hover {
  transform: translateX(4px);
}

.summary-label {
  font-size: 0.75rem;
  color: #4b5563;
  font-weight: 600;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
}

.summary-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
  font-family: 'Unbounded', sans-serif;
}

.summary-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #d1d5db, transparent);
  margin: 0.5rem 0;
}

.summary-item-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #FE601C 60%, #f47c49 100%);
  border-radius: 1rem;
  margin-top: 0.25rem;
}

.summary-label-total {
  font-size: 0.875rem;
  font-weight: 800;
  color: white;
  letter-spacing: 0.5px;
}

.summary-total-amount {
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  letter-spacing: 0.5px;
}

/* Status Alerts */
.status-alert {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 2px solid;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-top: 1rem;
}

.status-alert:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.status-icon-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.status-icon-blue {
  background: linear-gradient(135deg, #1A4189 0%, #2356b4 100%);
}

.status-icon-yellow {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.status-icon-purple {
  background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
}

.status-icon-green {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.status-alert-blue {
  background: linear-gradient(135deg, rgba(235, 239, 247, 0.95) 0%, rgba(221, 233, 251, 0.95) 100%);
  border-color: #93c5fd;
}

.status-alert-yellow {
  background: linear-gradient(135deg, rgba(254, 248, 236, 0.95) 0%, rgba(254, 240, 217, 0.95) 100%);
  border-color: #fcd34d;
}

.status-alert-purple {
  background: linear-gradient(135deg, rgba(243, 232, 255, 0.95) 0%, rgba(237, 233, 254, 0.95) 100%);
  border-color: #d8b4fe;
}

.status-alert-green {
  background: linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(220, 252, 231, 0.95) 100%);
  border-color: #86efac;
}

.status-alert-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.status-alert-title {
  font-size: 0.85rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  letter-spacing: 0.3px;
  font-family: 'Unbounded', sans-serif;
}

.status-alert-blue .status-alert-title {
  color: #1A4189;
}

.status-alert-yellow .status-alert-title {
  color: #92400e;
}

.status-alert-purple .status-alert-title {
  color: #6b21a8;
}

.status-alert-green .status-alert-title {
  color: #166534;
}

.status-alert-description {
  font-size: 0.8rem;
  line-height: 1.6;
  letter-spacing: 0.2px;
  color: #4b5563;
}

/* Info Card */
.info-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%);
  backdrop-filter: blur(20px);
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(26, 65, 137, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.info-items {
  display: flex;
  flex-direction: column;
}

.info-item {
  padding: 0.85rem 1.25rem;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.5);
}

.info-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e5e7eb, transparent);
}

.info-label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.info-value {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1f2937;
}

/* Animations */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 1.25rem;
  }
  
  .summary-card,
  .info-card {
    padding: 1.5rem;
  }
  
  .status-alert {
    padding: 1.5rem;
    gap: 1rem;
  }
  
  .status-icon-wrapper {
    width: 3rem;
    height: 3rem;
  }
  
  .status-alert-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .summary-total-amount {
    font-size: 1.5rem;
  }
}
</style>