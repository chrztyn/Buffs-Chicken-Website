<template>
  <div class="order-status-container bg-gradient-to-br from-[#FBF4E5] via-[#fef9ed] to-[#f5ead9] min-h-screen flex flex-col relative overflow-hidden">
    <!-- Toast Notification -->
    <Transition name="toast">
      <div
        v-if="showToast"
        :class="[
          'fixed top-6 right-6 rounded-lg shadow-2xl p-4 max-w-sm z-50 animate-slide-in',
          toastType === 'success' ? 'bg-green-500' : toastType === 'error' ? 'bg-red-500' : 'bg-blue-500'
        ]"
      >
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0">
            <svg v-if="toastType === 'success'" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-white font-bold text-sm">{{ toastTitle }}</h3>
            <p class="text-white/90 text-xs mt-1">{{ toastMessage }}</p>
          </div>
        </div>
      </div>
    </Transition>
    
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
                  class="h-full rounded-full transition-all duration-700 relative overflow-hidden"
                  :style="{ 
                    width: `${getProgressPercentage()}%`,
                    background: 'linear-gradient(90deg, #1A4189 0%, #1e4d9f 50%, #2356b4 100%)'
                  }"
                >
                  <div class="absolute inset-0 bg-white/30 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Items Ordered Section -->
          <div v-if="orderItems.length > 0" class="mb-10 pb-8 border-b border-gray-200/50">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-1 h-8 bg-gradient-to-b from-[#1A4189] to-[#2356b4] rounded-full"></div>
              <h3 class="section-title">Items Ordered</h3>
            </div>
            <div class="space-y-3">
              <div
                v-for="(item, index) in orderItems"
                :key="index"
                class="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-200/50"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-gray-800 text-sm" style="font-family: 'Unbounded', sans-serif;">{{ item.name }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">Qty: {{ item.quantity }}</p>
                    <!-- Variants -->
                    <div v-if="item.selectedVariants && Object.keys(item.selectedVariants).length > 0" class="flex flex-wrap gap-1 mt-2">
                      <span
                        v-for="(variant, key) in item.selectedVariants"
                        :key="key"
                        class="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold"
                      >{{ variant }}</span>
                    </div>
                    <!-- Sauces -->
                    <div v-if="item.selectedSauces && item.selectedSauces.length > 0" class="flex flex-wrap gap-1 mt-1">
                      <span
                        v-for="sauce in item.selectedSauces"
                        :key="typeof sauce === 'object' ? sauce.name : sauce"
                        class="inline-block bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold"
                      >{{ typeof sauce === 'object' ? sauce.name : sauce }}</span>
                    </div>
                    <!-- Addons -->
                    <div v-if="item.selectedAddons && item.selectedAddons.length > 0" class="flex flex-wrap gap-1 mt-1">
                      <span
                        v-for="addon in item.selectedAddons"
                        :key="typeof addon === 'object' ? addon.name : addon"
                        class="inline-block bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold"
                      >{{ typeof addon === 'object' ? addon.name : addon }}</span>
                    </div>
                    <!-- Notes -->
                    <p v-if="item.notes" class="text-xs text-gray-500 mt-1 italic">"{{ item.notes }}"</p>
                  </div>
                  <p class="font-bold text-[#1A4189] text-sm whitespace-nowrap flex-shrink-0">₱{{ item.totalPrice }}</p>
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
                <div v-if="voucherCode" class="summary-item group">
                  <span class="summary-label" style="color: #16a34a;">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    Voucher ({{ voucherCode }})
                  </span>
                  <span class="summary-value" style="color: #16a34a;">−₱{{ voucherDiscount.toFixed(2) }}</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-item-total">
                  <span class="summary-label-total">Total Amount</span>
                  <span class="summary-total-amount">₱{{ total.toFixed(2) }}</span>
                </div>
                <div v-if="paymentMethod" class="summary-divider"></div>
                <div v-if="paymentMethod" class="summary-item group">
                  <span class="summary-label">
                    <svg class="w-4 h-4 inline mr-2 text-[#FE601C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                    Payment Method
                  </span>
                  <span class="summary-value capitalize">{{ formatPaymentMethod(paymentMethod) }}</span>
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
            
            <div v-if="currentStatus === 'pending'" class="status-alert status-alert-blue">
              <div class="status-icon-wrapper status-icon-blue">
                <svg class="status-alert-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="status-alert-title">Confirming Your Order</h4>
                <p class="status-alert-description">Your order is being verified. Please wait a moment while we process your request.</p>
                <button
                  v-if="canCancelOrder"
                  @click="cancelOrder"
                  :disabled="isCancelingOrder"
                  class="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <svg v-if="isCancelingOrder" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  {{ isCancelingOrder ? 'Cancelling...' : 'Cancel Order' }}
                </button>
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

            <div v-if="currentStatus === 'out for delivery'" class="status-alert status-alert-purple">
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

            <div v-if="currentStatus === 'cancelled'" class="status-alert status-alert-red">
              <div class="status-icon-wrapper status-icon-red">
                <svg class="status-alert-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h4 class="status-alert-title">Order Cancelled</h4>
                <p class="status-alert-description">Your order has been cancelled. You can place a new order anytime.</p>
              </div>
            </div>
          </div>

          <!-- Receipt Upload Prompt — shown when order exists but no receipt was uploaded -->
          <div v-if="showReceiptUpload && !receiptUploaded" class="mb-10 pb-8 border-b border-gray-200/50">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-1 h-8 bg-gradient-to-b from-[#1A4189] to-[#2356b4] rounded-full"></div>
              <h3 class="section-title">Complete Payment</h3>
            </div>
            <div class="p-5 bg-orange-50 border border-orange-200 rounded-2xl">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-5 h-5 text-[#FE601C] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-sm font-bold text-[#FE601C]">Receipt not yet uploaded</p>
              </div>
              <p class="text-xs text-gray-600 mb-4">
                Your order was placed but we haven't received your payment receipt yet.
                Please upload your screenshot to confirm your payment.
              </p>

              <!-- Re-open payment credentials -->
              <button
                v-if="currentPaymentConfig && !receiptUploaded"
                type="button"
                @click="showPaymentModal = true"
                class="w-full mb-4 flex items-center justify-center gap-2 py-2.5 px-4 border border-[#FE601C] text-[#FE601C] bg-white hover:bg-orange-50 rounded-xl text-xs font-bold transition-colors duration-200"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.243m-4.243 0L9.757 9.757M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                View Payment Details Again
              </button>

              <!-- Upload zone -->
              <div
                v-if="!receiptFile"
                @click="receiptInputRef?.click()"
                class="flex flex-col items-center justify-center border-2 border-dashed border-[#FE601C] rounded-xl p-5 cursor-pointer hover:bg-orange-100 transition-colors duration-200"
              >
                <svg class="w-8 h-8 text-[#FE601C] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <p class="text-sm font-bold text-gray-700">Upload Payment Receipt</p>
                <p class="text-xs text-gray-400 mt-1">Tap to select your screenshot</p>
              </div>

              <input
                ref="receiptInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              />

              <!-- Preview -->
              <div v-if="receiptFile && receiptPreviewUrl" class="mt-3">
                <img :src="receiptPreviewUrl" class="max-h-40 w-full object-contain rounded-xl border border-gray-200" alt="Receipt preview" />
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
                <button
                  @click="uploadReceipt"
                  :disabled="receiptUploading"
                  class="mt-3 w-full py-3 rounded-xl bg-[#FE601C] text-white font-bold text-sm hover:bg-[#e25519] disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg v-if="receiptUploading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  {{ receiptUploading ? 'Uploading...' : 'Submit Receipt' }}
                </button>
              </div>

              <p v-if="receiptError" class="mt-2 text-xs text-red-600">{{ receiptError }}</p>
            </div>
          </div>

          <!-- Success state -->
          <div v-if="receiptUploaded" class="mb-10 pb-8 border-b border-gray-200/50">
            <div class="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
              <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p class="text-sm font-semibold text-green-700">Receipt uploaded! We'll verify your payment shortly.</p>
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
                      <span class="info-value">{{ userAddress }}</span>
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
                      <span class="info-value">{{ formatPaymentMethod(paymentMethod) }}</span>
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

    <!-- Payment Details Modal -->
    <Transition name="modal-fade">
      <div v-if="showPaymentModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-[#1A4189] to-[#2356b4] px-6 py-5 flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-white">Payment Details</h2>
              <p class="text-white/70 text-xs mt-0.5">Send your payment to complete the order</p>
            </div>
            <button
              @click="showPaymentModal = false"
              class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <template v-if="currentPaymentConfig">
              <!-- QR Code -->
              <div class="flex flex-col items-center mb-5">
                <img
                  :src="currentPaymentConfig.qrImage"
                  :alt="currentPaymentConfig.label + ' QR Code'"
                  :class="paymentMethod === 'gcash' ? 'rotate-180' : ''"
                  class="w-48 h-48 rounded-xl object-contain border border-gray-200 bg-white"
                />
              </div>

              <!-- Account Details -->
              <div class="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4 text-center">
                <p class="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">{{ currentPaymentConfig.label }} Account</p>
                <p class="text-base font-bold text-gray-800">{{ currentPaymentConfig.accountName }}</p>
                <p class="text-lg font-bold text-[#1A4189] mt-1">{{ currentPaymentConfig.accountNumber }}</p>
                <p class="text-xs text-gray-400 mt-1 italic">{{ currentPaymentConfig.instruction }}</p>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="downloadPaymentQR"
                  class="flex-1 flex items-center justify-center gap-1.5 border border-[#1A4189] text-[#1A4189] bg-transparent py-2.5 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors duration-200"
                >
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download QR
                </button>
                <button
                  type="button"
                  @click="copyPaymentNumber"
                  class="flex-1 flex items-center justify-center gap-1.5 border border-[#1A4189] py-2.5 rounded-xl text-xs font-bold transition-colors duration-200"
                  :class="copySuccess ? 'text-green-600 border-green-400 bg-green-50' : 'text-[#1A4189] bg-transparent hover:bg-blue-50'"
                >
                  <svg v-if="!copySuccess" class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  <svg v-else class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {{ copySuccess ? 'Copied!' : 'Copy Number' }}
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Thank You Modal -->
    <Transition name="modal-fade">
      <div v-if="showThankYouModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          <!-- Modal Header with Gradient -->
          <div class="bg-gradient-to-r from-[#1A4189] to-[#2356b4] px-8 py-12 text-center">
            <div class="flex justify-center mb-4">
              <svg class="w-16 h-16 text-white animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h2 class="text-2xl font-['Unbounded'] font-bold text-white mb-2">Thank You!</h2>
            <p class="text-white/90 text-sm">We hope you enjoyed your meal</p>
          </div>

          <!-- Modal Body -->
          <div class="px-8 py-8">
            <p class="text-gray-700 text-center mb-6 leading-relaxed">
              Your order has been successfully delivered. We appreciate your business and hope to serve you again soon!
            </p>

            <!-- Buttons -->
            <div class="space-y-3">
              <button
                @click="goToBlogs"
                class="w-full bg-gradient-to-r from-[#1A4189] to-[#2356b4] text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Read More About Buffs
              </button>
              <button
                @click="closeThankYouModal"
                class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition-all duration-300"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from '#app'
import io from 'socket.io-client'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

useSeoMeta({ robots: 'noindex, nofollow' })

const router = useRouter()

const orderId = ref('')
const currentStatus = ref('pending')
const hasOrder = ref(false)
const userEmail = ref('')
const userAddress = ref('Loading address...')
const totalAmount = ref(0)
const subtotal = ref(0)
const itemsCount = ref(0)
const orderItems = ref([])
const paymentMethod = ref('')
const voucherCode = ref('')
const voucherDiscount = ref(0)

// Toast notification state
const toastMessage = ref('')
const toastTitle = ref('')
const showToast = ref(false)
const toastType = ref('success') // 'success', 'info', 'warning', 'error'

// Cancel order loading state
const isCancelingOrder = ref(false)

const statuses = ref([
  { id: 'pending', label: 'Confirming' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'out for delivery', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' }
])

const statusOrder = {
  pending: 0,
  preparing: 1,
  'out for delivery': 2,
  delivered: 3,
  cancelled: -1
}


// Thank you modal state
const showThankYouModal = ref(false)

// Prevent scroll when modal is open
watch(
  () => showThankYouModal.value,
  (isOpen) => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
    }
  }
)

const total = computed(() => {
  if (totalAmount.value > 0) return totalAmount.value
  return Math.max(0, subtotal.value - voucherDiscount.value)
})

const formatPaymentMethod = (method) => {
  const methods = {
    'gcash': 'GCash',
    'maya': 'Maya', 
    'maribank': 'Maribank',
    'bpi': 'BPI'
  }
  return methods[method] || method
}

const getProgressPercentage = () => {
  const currentIndex = statusOrder[currentStatus.value]
  const totalSteps = statuses.value.length - 1
  if (currentIndex === -1) return 0 // cancelled
  
  const percentage = ((currentIndex) / totalSteps) * 100
  console.log('Progress calculation:', {
    currentStatus: currentStatus.value,
    currentIndex,
    totalSteps,
    percentage: percentage.toFixed(2) + '%'
  })
  
  return percentage
}

const isStatusActive = (statusId) => {
  return currentStatus.value === statusId
}

const isStatusCompleted = (statusId) => {
  return statusOrder[statusId] < statusOrder[currentStatus.value] && statusOrder[statusId] !== -1
}

const canCancelOrder = computed(() => {
  return currentStatus.value === 'pending'
})

const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const now = audioContext.currentTime
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.connect(gain)
    gain.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)

    oscillator.start(now)
    oscillator.stop(now + 0.5)
  } catch (error) {
    console.log('Audio notification not available:', error)
  }
}

const showNotification = (title, message, type = 'success') => {
  toastTitle.value = title
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    showToast.value = false
  }, 5000)
  
  // Play sound
  playNotificationSound()
}

const fetchUserAddress = async (email) => {
  try {
    const response = await fetch(
      `${useRuntimeConfig().public.apiBase}/users/check-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      }
    )

    if (response.ok) {
      const data = await response.json()
      if (data.exists && data.location) {
        userAddress.value = data.location
      } else {
        userAddress.value = 'Address not found'
      }
    } else {
      userAddress.value = 'Unable to load address'
    }
  } catch (error) {
    console.error('Error fetching user address:', error)
    userAddress.value = 'Error loading address'
  }
}

const fetchOrderFromBackend = async (orderId) => {
  try {
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/orders/${orderId}`)
    if (response.ok) {
      const order = await response.json()

      if (order.deliveryAddress) userAddress.value = order.deliveryAddress
      currentStatus.value = order.status || 'pending'
      subtotal.value = order.subtotal || 0
      totalAmount.value = order.totalAmount || 0 

      if (order.paymentMethod) paymentMethod.value = order.paymentMethod

      if (order.voucher?.code) {
        voucherCode.value = order.voucher.code
        voucherDiscount.value = order.voucher.discountAmount || 0
      }
    }
  } catch (error) {
    console.error('Error fetching order from backend:', error)
  }
}

const loadOrder = async () => {
  const saved = localStorage.getItem('buffs_order')
  if (saved) {
    const order = JSON.parse(saved)
    orderId.value = order.orderId
    
    // Show receipt upload prompt if: QR payment AND no receipt yet uploaded
    const needsReceipt =
      QR_METHODS.includes(order?.paymentMethod) &&
      !order?.receiptUploaded
    showReceiptUpload.value = needsReceipt
    receiptUploaded.value = order?.receiptUploaded || false
    currentStatus.value = order.status || 'pending'
    subtotal.value = order.subtotal
    itemsCount.value = order.itemsCount
    userEmail.value = order.customerEmail || ''
    orderItems.value = order.items || []
    paymentMethod.value = order.paymentMethod || ''
    voucherCode.value = order.voucher?.code || ''
    voucherDiscount.value = order.voucher?.discountAmount || 0
    hasOrder.value = true
    
    // Use the delivery address from the order if available
    if (order.deliveryAddress) {
      userAddress.value = order.deliveryAddress
    }
    
    console.log('Order loaded from localStorage:', {
      orderId: orderId.value,
      status: currentStatus.value,
      type: typeof orderId.value,
      email: userEmail.value,
      address: userAddress.value,
      paymentMethod: paymentMethod.value
    })
    
    // Always fetch latest status from backend (authoritative source).
    // Awaiting ensures currentStatus reflects the real DB value before the
    // socket listener is set up, so a refresh never shows a stale status.
    await fetchOrderFromBackend(orderId.value)

    // Persist the freshly-fetched status back to localStorage so that the
    // next refresh also starts with the correct value even if no socket
    // event is received.
    saveOrderStatus()
  }
}

const saveOrderStatus = () => {
  if (hasOrder.value) {
    const order = JSON.parse(localStorage.getItem('buffs_order') || '{}')
    order.status = currentStatus.value
    localStorage.setItem('buffs_order', JSON.stringify(order))
  }
}

const handleOrderStatusUpdate = (data) => {
  console.log('Order status update received:', data)
  // Check if this update is for our order
  if (data.orderId === orderId.value || data.orderId === orderId.value.toString()) {
    currentStatus.value = data.status
    saveOrderStatus()
    
    // Show notification
    const statusMessages = {
      pending: 'Confirming',
      preparing: 'Your order is being prepared',
      'out for delivery': 'Your order is on the way',
      delivered: 'Your order has arrived',
      cancelled: 'Your order has been cancelled'
    }
    
    showNotification('Order Updated', data.message || statusMessages[data.status], 'info')
    
    // Show thank you modal when delivered
    if (data.status === 'delivered') {
      setTimeout(() => {
        showThankYouModal.value = true
        // Clear order from localStorage after delivery
        setTimeout(() => {
          localStorage.removeItem('buffs_order')
          localStorage.removeItem('buffs_cart')
        }, 2000)
      }, 1000)
    }
  }
}

// ─── Receipt upload state (Step 3 fallback) ──────────────────────────────────
const showReceiptUpload = ref(false)
const receiptFile = ref(null)
const receiptPreviewUrl = ref(null)
const receiptUploading = ref(false)
const receiptError = ref(null)
const receiptUploaded = ref(false)
const receiptInputRef = ref(null)

const QR_METHODS = ['gcash', 'maya', 'maribank', 'bpi']

// ─── Payment credentials modal ───────────────────────────────────────────────
const showPaymentModal = ref(false)

const paymentConfig = {
  gcash: {
    label: 'GCash',
    qrImage: '/gcash-qr.jpg',
    accountName: 'Buffs Chicken',
    accountNumber: '0927 064 3105',
    instruction: 'Scan with your GCash app',
  },
  maya: {
    label: 'Maya',
    qrImage: '/maya-qr.jpg',
    accountName: 'Buffs Chicken',
    accountNumber: '0917 182 0520',
    instruction: 'Scan with your Maya app',
  },
  maribank: {
    label: 'Maribank',
    qrImage: '/maribank-qr.jpg',
    accountName: 'Buffs Chicken',
    accountNumber: '18172480645',
    instruction: 'Scan with your Maribank app',
  },
  bpi: {
    label: 'BPI',
    qrImage: '/bpi-qr.jpg',
    accountName: 'Buffs Chicken',
    accountNumber: '2569295354',
    instruction: 'Scan with your BPI app',
  }
}

const currentPaymentConfig = computed(() => paymentConfig[paymentMethod.value] || null)

const copyPaymentNumber = async () => {
  if (!currentPaymentConfig.value) return
  try {
    await navigator.clipboard.writeText(currentPaymentConfig.value.accountNumber)
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  } catch {
    // Silent fail
  }
}

const downloadPaymentQR = () => {
  if (!currentPaymentConfig.value) return
  const link = document.createElement('a')
  link.href = currentPaymentConfig.value.qrImage
  link.download = `buffs-chicken-${paymentMethod.value}-qr.jpg`
  link.click()
}

const copySuccess = ref(false)

const handleFileSelect = (e) => {
  const file = e.target?.files?.[0]
  receiptError.value = null
  if (!file) return
  
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
  if (!validTypes.includes(file.type) && !file.type.startsWith('image/')) {
    receiptError.value = 'Please upload an image file'
    if (e.target) e.target.value = ''
    return
  }
  
  if (file.size > 5 * 1024 * 1024) {
    receiptError.value = 'Image too large. Please upload under 5MB.'
    if (e.target) e.target.value = ''
    return
  }
  
  receiptFile.value = file
  if (receiptPreviewUrl.value) URL.revokeObjectURL(receiptPreviewUrl.value)
  receiptPreviewUrl.value = URL.createObjectURL(file)
}

const uploadReceipt = async () => {
  if (!receiptFile.value || !orderId.value) return
  receiptUploading.value = true
  receiptError.value = null
  try {
    const fd = new FormData()
    fd.append('receipt', receiptFile.value)
    const res = await fetch(`${useRuntimeConfig().public.apiBase}/orders/${orderId.value}/receipt`, {
      method: 'POST',
      body: fd
    })
    if (!res.ok) throw new Error('Upload failed')

    // Mark receipt as uploaded in localStorage so widget disappears on refresh
    const updated = { ...JSON.parse(localStorage.getItem('buffs_order') || '{}'), receiptUploaded: true }
    localStorage.setItem('buffs_order', JSON.stringify(updated))
    receiptUploaded.value = true
    showReceiptUpload.value = false
    showNotification('Success', 'Receipt uploaded! We\'ll verify your payment shortly.', 'success')
  } catch {
    receiptError.value = 'Upload failed. Please message us on Facebook to confirm your payment.'
  } finally {
    receiptUploading.value = false
  }
}

const removeReceipt = () => {
  if (receiptPreviewUrl.value) URL.revokeObjectURL(receiptPreviewUrl.value)
  receiptFile.value = null
  receiptPreviewUrl.value = null
  receiptError.value = null
  if (receiptInputRef.value) receiptInputRef.value.value = ''
}

const cancelOrder = async () => {
  isCancelingOrder.value = true
  try {
    const response = await fetch(
      `${useRuntimeConfig().public.apiBase}/orders/${orderId.value}/cancel`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.ok) {
      currentStatus.value = 'cancelled'
      saveOrderStatus()
    } else {
      const error = await response.json()
      alert(error.message || 'Failed to cancel order')
    }
  } catch (error) {
    console.error('Error cancelling order:', error)
    alert('Error cancelling order')
  } finally {
    isCancelingOrder.value = false
  }
}

const closeThankYouModal = () => {
  showThankYouModal.value = false
  // Redirect to home page after closing modal
  setTimeout(() => {
    router.push('/')
  }, 500)
}

const goToBlogs = () => {
  showThankYouModal.value = false
  // Redirect to blogs page
  setTimeout(() => {
    router.push('/blogs')
  }, 500)
}

onMounted(async () => {
  console.log('=== ORDER STATUS PAGE MOUNTED ===')
  await loadOrder()
  
  // If order is already delivered, redirect to home
  if (hasOrder.value && currentStatus.value === 'delivered') {
    console.log('Order already delivered, redirecting...')
    router.push('/')
    return
  }
  
  if (hasOrder.value) {
    console.log('Has order, connecting to Socket.io...')
    // Initialize Socket.io connection directly without using the admin composable
    const socketUrl = useRuntimeConfig().public.socketUrl || 'http://localhost:5001'
    
    const directSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    })

    // Set up connection listeners
    directSocket.on('connect', () => {
      console.log('Socket connected! ID:', directSocket.id)
      // Join the specific order room
      directSocket.emit('join-order', orderId.value.toString())
      console.log('Emitted join-order for orderId:', orderId.value)
    })

    directSocket.on('order-status', (data) => {
      console.log('Socket event received - order-status:', data)
      handleOrderStatusUpdate(data)
    })

    directSocket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    directSocket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    // Clean up on unmount
    onBeforeUnmount(() => {
      console.log('Cleaning up socket connection...')
      directSocket.disconnect()
    })
  } else {
    console.log('No order found in localStorage')
  }
})

onUnmounted(() => {
  // Cleanup will be handled in onBeforeUnmount inside onMounted
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
  padding: 1.5rem 1rem;
  border-radius: 0.75rem;
}

@media (min-width: 640px) {
  .status-header {
    padding: 1.75rem 1.5rem;
    min-height: 5.5rem;
  }
}

@media (min-width: 768px) {
  .status-header {
    padding: 2rem 2rem;
    min-height: 6rem;
  }
}

@media (min-width: 1024px) {
  .status-header {
    padding: 2.5rem 2rem;
    min-height: 6rem;
  }
}

.content-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
  margin-top: 2rem;
}

@media (min-width: 640px) {
  .content-wrapper {
    padding: 0 1.5rem;
    margin-top: 2.5rem;
  }
}

@media (min-width: 768px) {
  .content-wrapper {
    padding: 0 2rem;
    margin-top: 3rem;
  }
}

@media (min-width: 1024px) {
  .content-wrapper {
    padding: 0 2rem;
    margin-top: 4rem;
  }
}

.order-status {
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(12px);
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 10px 40px rgba(26, 65, 137, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

@media (min-width: 640px) {
  .order-status {
    padding: 1.25rem;
  }
}

@media (min-width: 768px) {
  .order-status {
    padding: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .order-status {
    padding: 2rem;
  }
}

.button-checkmark {
  margin-left: 1rem;
}

/* Section Title */
.section-title {
  font-size: 0.65rem;
  font-weight: 800;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

@media (min-width: 640px) {
  .section-title {
    font-size: 0.7rem;
  }
}

@media (min-width: 768px) {
  .section-title {
    font-size: 0.75rem;
  }
}

@media (min-width: 1024px) {
  .section-title {
    font-size: 0.8rem;
  }
}

/* Status Label */
.status-label {
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.65rem;
  font-weight: 700;
}

@media (min-width: 640px) {
  .status-label {
    margin-top: 0.6rem;
    margin-bottom: 0.3rem;
    font-size: 0.7rem;
  }
}

@media (min-width: 768px) {
  .status-label {
    margin-top: 0.75rem;
    margin-bottom: 0.35rem;
    font-size: 0.75rem;
  }
}

@media (min-width: 1024px) {
  .status-label {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
  }
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
  font-size: 0.7rem;
  color: #4b5563;
  font-weight: 600;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
}

@media (min-width: 640px) {
  .summary-label {
    font-size: 0.72rem;
  }
}

@media (min-width: 768px) {
  .summary-label {
    font-size: 0.75rem;
  }
}

.summary-value {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1f2937;
  font-family: 'Unbounded', sans-serif;
}

@media (min-width: 640px) {
  .summary-value {
    font-size: 0.85rem;
  }
}

@media (min-width: 768px) {
  .summary-value {
    font-size: 0.875rem;
  }
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
  padding: 0.85rem;
  background: linear-gradient(135deg, #FE601C 60%, #f47c49 100%);
  border-radius: 1rem;
  margin-top: 0.25rem;
}

@media (min-width: 640px) {
  .summary-item-total {
    padding: 0.95rem;
  }
}

@media (min-width: 768px) {
  .summary-item-total {
    padding: 1rem;
  }
}

.summary-label-total {
  font-size: 0.8rem;
  font-weight: 800;
  color: white;
  letter-spacing: 0.5px;
}

@media (min-width: 640px) {
  .summary-label-total {
    font-size: 0.82rem;
  }
}

@media (min-width: 768px) {
  .summary-label-total {
    font-size: 0.875rem;
  }
}

.summary-total-amount {
  font-size: 1.25rem;
  font-weight: 900;
  color: white;
  letter-spacing: 0.5px;
}

@media (min-width: 640px) {
  .summary-total-amount {
    font-size: 1.35rem;
  }
}

@media (min-width: 768px) {
  .summary-total-amount {
    font-size: 1.5rem;
  }
}

/* Status Alerts */
.status-alert {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.1rem;
  border-radius: 0.75rem;
  border: 2px solid;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-top: 1rem;
}

@media (min-width: 640px) {
  .status-alert {
    gap: 1.2rem;
    padding: 1.2rem;
  }
}

@media (min-width: 768px) {
  .status-alert {
    gap: 1.5rem;
    padding: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .status-alert {
    gap: 1.5rem;
    padding: 1.5rem;
  }
}

.status-alert:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.status-icon-wrapper {
  width: 2rem;
  height: 2rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

@media (min-width: 640px) {
  .status-icon-wrapper {
    width: 2.2rem;
    height: 2.2rem;
  }
}

@media (min-width: 768px) {
  .status-icon-wrapper {
    width: 2.5rem;
    height: 2.5rem;
  }
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

.status-icon-red {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
  width: 1rem;
  height: 1rem;
  color: white;
}

@media (min-width: 640px) {
  .status-alert-icon {
    width: 1.2rem;
    height: 1.2rem;
  }
}

@media (min-width: 768px) {
  .status-alert-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.status-alert-title {
  font-size: 0.8rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  letter-spacing: 0.3px;
  font-family: 'Unbounded', sans-serif;
}

@media (min-width: 640px) {
  .status-alert-title {
    font-size: 0.82rem;
  }
}

@media (min-width: 768px) {
  .status-alert-title {
    font-size: 0.85rem;
  }
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

.status-alert-red {
  background: linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(254, 226, 226, 0.95) 100%);
  border-color: #fca5a5;
}

.status-alert-red .status-alert-title {
  color: #991b1b;
}

.status-icon-red {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.status-alert-description {
  font-size: 0.75rem;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: #4b5563;
}

@media (min-width: 640px) {
  .status-alert-description {
    font-size: 0.78rem;
  }
}

@media (min-width: 768px) {
  .status-alert-description {
    font-size: 0.8rem;
    line-height: 1.6;
  }
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

@media (min-width: 768px) {
  .info-card {
    margin-bottom: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .info-card {
    margin-bottom: 3rem;
  }
}

.info-items {
  display: flex;
  flex-direction: column;
}

.info-item {
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

@media (min-width: 640px) {
  .info-item {
    padding: 0.8rem 1.1rem;
  }
}

@media (min-width: 768px) {
  .info-item {
    padding: 0.85rem 1.25rem;
  }
}

@media (min-width: 1024px) {
  .info-item {
    padding: 1rem 1.5rem;
  }
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
  font-size: 0.7rem;
  color: #6b7280;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}

@media (min-width: 640px) {
  .info-label {
    font-size: 0.72rem;
    margin-bottom: 0.45rem;
  }
}

@media (min-width: 768px) {
  .info-label {
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
  }
}

.info-value {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1f2937;
}

@media (min-width: 640px) {
  .info-value {
    font-size: 0.82rem;
  }
}

@media (min-width: 768px) {
  .info-value {
    font-size: 0.85rem;
  }
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

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
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

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Toast Transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .order-status-container {
    padding-bottom: 2rem;
  }
  
  .status-header h1 {
    font-size: 1.2rem;
  }
  
  .status-header p {
    font-size: 0.75rem;
  }
}

@media (min-width: 641px) and (max-width: 1023px) {
  /* Tablet optimizations */
  .order-status {
    margin-top: 1.5rem;
  }
}

/* Modal Animations */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.modal-fade-enter-active {
  animation: modalFadeIn 0.3s ease-out;
}

.modal-fade-leave-active {
  animation: modalFadeIn 0.3s ease-out reverse;
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>