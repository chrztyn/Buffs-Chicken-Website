<template>
  <div class="p-4 lg:p-8 bg-gradient-to-br from-[#FBF4E5] via-[#fef9ed] to-[#f5ead9] min-h-screen">
    <!-- Toast Notification -->
    <transition name="toast-fade">
      <div 
        v-if="showToast"
        class="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-2xl px-6 py-4 max-w-sm animate-pulse-subtle"
      >
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-green-600 animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <p class="font-bold text-gray-800">{{ toastMessage.title }}</p>
          <p class="text-sm text-gray-600">{{ toastMessage.message }}</p>
        </div>
      </div>
    </transition>

    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="font-['Poppins'] font-bold text-4xl text-[#1A4189] mb-2">Orders</h1>
      <p class="font-['Poppins'] text-gray-600">Real-time order management • {{ orders.length }} total orders</p>
    </div>

    <!-- Status Filter Tabs -->
    <div class="mb-6 flex flex-wrap gap-2 bg-white rounded-xl p-3 shadow-sm border border-gray-200">
      <button
        @click="filterStatus = ''"
        :class="!filterStatus 
          ? 'bg-gradient-to-r from-[#1A4189] to-[#2356b4] text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        class="px-5 py-2 rounded-lg font-['Poppins'] font-bold transition-all duration-300"
      >
        All Orders ({{ orders.length }})
      </button>
      <button
        v-for="status in ['pending', 'preparing', 'out for delivery', 'delivered', 'cancelled']"
        :key="status"
        @click="filterStatus = status"
        :class="filterStatus === status
          ? 'bg-gradient-to-r from-[#FE601C] to-[#f47c49] text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        class="px-4 py-2 rounded-lg font-['Poppins'] font-bold transition-all duration-300 capitalize text-sm"
      >
        {{ status }} ({{ getStatusCount(status) }})
      </button>
    </div>

    <!-- Orders List -->
    <div v-if="filteredOrders.length === 0" class="text-center py-16">
      <div class="inline-block p-6 bg-white rounded-full mb-4 shadow-sm">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
      </div>
      <p class="text-gray-500 font-['Poppins'] text-lg font-bold">No orders found</p>
      <p class="text-gray-400 text-sm">Orders will appear here in real-time</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order._id"
        :class="order.status === 'pending' 
          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 ring-2 ring-yellow-200' 
          : 'bg-white'"
        class="rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <!-- Order Header -->
        <div class="p-4 lg:p-6 border-b border-gray-200 bg-gradient-to-r from-[#1A4189]/5 to-[#2356b4]/5">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <p class="text-gray-600 font-['Poppins'] text-xs font-bold uppercase tracking-wider">Order #</p>
              <p class="font-['Poppins'] font-bold text-2xl text-[#1A4189]">#{{ order.orderNumber }}</p>
            </div>
            <div>
              <p class="text-gray-600 font-['Poppins'] text-xs font-bold uppercase tracking-wider">Customer</p>
              <p class="font-['Poppins'] font-bold text-[#1A4189] text-sm">{{ order.user?.name || 'Guest' }}</p>
              <p class="text-xs text-gray-600">{{ order.user?.phone }}</p>
              <p class="text-xs text-gray-600">{{ order.deliveryAddress }}</p>
            </div>
            <div>
              <p class="text-gray-600 font-['Poppins'] text-xs font-bold uppercase tracking-wider">Amount</p>
              <p class="font-['Poppins'] font-bold text-2xl text-[#FE601C]">₱{{ order.totalAmount }}</p>
              <div v-if="order.voucher && order.voucher.code" class="mt-1">
                <span class="inline-block bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-xs font-semibold">
                  {{ order.voucher.code }} · -₱{{ order.voucher.discountAmount.toFixed(2) }}
                </span>
              </div>
            </div>
            <div>
              <p class="text-gray-600 font-['Poppins'] text-xs font-bold uppercase tracking-wider">Status</p>
              <span
                :class="getStatusColor(order.status)"
                class="inline-block px-3 py-1 rounded-full text-xs font-['Poppins'] font-bold capitalize mt-1"
              >
                {{ order.status }}
              </span>
            </div>
            <div>
              <p class="text-gray-600 font-['Poppins'] text-xs font-bold uppercase tracking-wider">Waiting</p>
              <p class="font-['Poppins'] font-bold text-lg text-gray-800">{{ getTimeWaiting(order.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Order Items Summary (Card View) -->
        <div class="p-4 lg:p-6 border-b border-gray-200 bg-white">
          <h3 class="font-['Poppins'] font-bold text-[#1A4189] mb-3 text-sm">Items Ordered</h3>
          <div class="space-y-3">
            <div v-for="(item, idx) in order.items.slice(0, 2)" :key="idx" class="flex justify-between items-start text-sm font-['Poppins']">
              <div class="flex-1">
                <p class="font-bold text-gray-800">{{ item.productName }} × {{ item.quantity }}</p>

                <div v-if="item.selectedVariants && Object.keys(item.selectedVariants).length > 0" class="text-xs text-gray-600 mt-1">
                  <span class="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded mr-2 mb-1">
                    Variant: {{ Object.values(item.selectedVariants).join(', ') }}
                  </span>
                </div>

                <div v-if="item.selectedSauces && item.selectedSauces.length > 0" class="text-xs text-gray-600 mt-1">
                  <span class="inline-block bg-orange-50 text-orange-700 px-2 py-0.5 rounded mr-2 mb-1">
                    Sauces: {{ item.selectedSauces.map((s: any) => s.name || s).filter(Boolean).join(', ') }}
                  </span>
                </div>

                <div v-if="item.selectedAddons && item.selectedAddons.length > 0" class="text-xs text-gray-600 mt-1">
                  <span class="inline-block bg-green-50 text-green-700 px-2 py-0.5 rounded mr-2 mb-1">
                    Add-ons: {{ item.selectedAddons.map((a: any) => a.name).join(', ') }}
                  </span>
                </div>

                <!-- Per-item notes in card view -->
                <div v-if="item.notes && item.notes.trim()" class="mt-1">
                  <span class="inline-block bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-xs font-['Poppins'] font-semibold italic">
                    "{{ item.notes }}"
                  </span>
                </div>
              </div>
              <p class="font-bold text-[#FE601C] ml-2 whitespace-nowrap">₱{{ item.itemTotal }}</p>
            </div>

            <div v-if="order.items.length > 2" class="text-xs text-gray-600 font-semibold mt-2 pt-2 border-t border-gray-200">
              +{{ order.items.length - 2 }} more item{{ order.items.length - 2 > 1 ? 's' : '' }} (view details)
            </div>
          </div>

          <!-- Order-level Special Instructions in Card -->
          <div v-if="order.notes && order.notes.trim()" class="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p class="text-xs font-['Poppins'] font-semibold text-purple-900 mb-1">Special Instructions:</p>
            <p class="text-xs text-purple-800 line-clamp-2">{{ order.notes }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="p-4 lg:p-6 flex flex-col sm:flex-row gap-3">
          <button
            @click="openOrderDetails(order)"
            class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-['Poppins'] font-bold rounded-lg hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            View Details
          </button>
          <button
            v-if="order.status !== 'delivered' && order.status !== 'cancelled'"
            @click="openStatusUpdate(order)"
            class="flex-1 px-4 py-3 bg-gradient-to-r from-[#FE601C] to-[#f47c49] text-white font-['Poppins'] font-bold rounded-lg hover:shadow-lg hover:from-[#f47c49] hover:to-[#e5551a] transition-all duration-300"
          >
            Update Status
          </button>
          <button
            v-if="order.status === 'pending'"
            @click="toggleOrderInProgress(order)"
            :class="order.inProgress 
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' 
              : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'"
            class="flex-1 px-4 py-3 text-white font-['Poppins'] font-bold rounded-lg hover:shadow-lg transition-all duration-300"
          >
            {{ order.inProgress ? '✓ In Progress' : 'Mark In Progress' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <Modal
      :is-open="showOrderDetails"
      title="Order Details"
      :show-submit="false"
      @close="showOrderDetails = false"
    >
      <div v-if="selectedOrder" class="space-y-6">
        <!-- Order Header -->
        <div class="bg-gradient-to-r from-[#1A4189] to-[#2356b4] p-6 rounded-xl text-white">
          <h2 class="font-['Poppins'] font-bold text-3xl mb-3">#{{ selectedOrder.orderNumber }}</h2>
          <div class="grid grid-cols-2 gap-4 text-sm font-['Poppins']">
            <div>
              <p class="text-white/70 font-semibold mb-1">Placed</p>
              <p>{{ formatDateTime(selectedOrder.createdAt) }}</p>
            </div>
            <div>
              <p class="text-white/70 font-semibold mb-1">Status</p>
              <span :class="getStatusColor(selectedOrder.status)" class="inline-block px-3 py-1 rounded-full text-xs font-bold capitalize">
                {{ selectedOrder.status }}
              </span>
            </div>
            <div>
              <p class="text-white/70 font-semibold mb-1">Waiting Time</p>
              <p>{{ getTimeWaiting(selectedOrder.createdAt) }}</p>
            </div>
            <div v-if="selectedOrder.inProgress">
              <p class="text-white/70 font-semibold mb-1">Progress</p>
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-200 text-purple-900">
                In Progress
              </span>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-xl">
          <h3 class="font-['Poppins'] font-bold text-[#1A4189] mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
            </svg>
            Customer Information
          </h3>
          <div class="grid grid-cols-2 gap-4 text-sm font-['Poppins']">
            <div>
              <p class="text-gray-600 font-semibold mb-1">Name</p>
              <p class="font-bold text-gray-800">{{ selectedOrder.user?.name }}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold mb-1">Phone</p>
              <p class="font-bold text-gray-800">{{ selectedOrder.user?.phone }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-gray-600 font-semibold mb-1">Email</p>
              <p class="font-bold text-gray-800">{{ selectedOrder.user?.email }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-gray-600 font-semibold mb-1">Delivery Address</p>
              <p class="font-bold text-gray-800">{{ selectedOrder.deliveryAddress }}</p>
            </div>
          </div>
        </div>

        <!-- All Items with Details -->
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-6 rounded-xl">
          <h3 class="font-['Poppins'] font-bold text-[#1A4189] mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z"></path>
            </svg>
            Items Ordered ({{ selectedOrder.items.length }})
          </h3>
          <div class="space-y-4">
            <div v-for="(item, idx) in selectedOrder.items" :key="idx" class="border rounded-lg p-4 bg-white hover:shadow-md transition-all">
              <div class="flex gap-4 mb-3">
                <!-- Product Image -->
                <div v-if="item.productImage" class="flex-shrink-0">
                  <img :src="item.productImage" :alt="item.productName" class="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                </div>
                
                <!-- Product Details -->
                <div class="flex-1">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <p class="font-['Poppins'] font-bold text-gray-800">{{ item.productName }}</p>
                      <p class="text-sm text-gray-600 font-['Poppins']">Quantity: <span class="font-bold">{{ item.quantity }}</span></p>
                    </div>
                    <p class="font-['Poppins'] font-bold text-[#FE601C] text-lg">₱{{ item.itemTotal }}</p>
                  </div>
                  
                  <div class="space-y-2">
                    <div v-if="item.selectedVariants && Object.keys(item.selectedVariants).length > 0" class="flex flex-wrap gap-2">
                      <span v-for="(variant, key) in item.selectedVariants" :key="key" class="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-['Poppins'] font-semibold">
                        {{ variant }}
                      </span>
                    </div>
                    
                    <div v-if="item.selectedSauces && item.selectedSauces.length > 0" class="flex flex-wrap gap-2">
                      <span v-for="sauce in item.selectedSauces" :key="sauce._id || sauce.name" class="inline-block bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-['Poppins'] font-semibold">
                        {{ sauce.name || sauce }} +₱{{ typeof sauce === 'object' ? sauce.price : 0 }}
                      </span>
                    </div>
                    
                    <div v-if="item.selectedAddons && item.selectedAddons.length > 0" class="flex flex-wrap gap-2">
                      <span v-for="addon in item.selectedAddons" :key="addon._id" class="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-['Poppins'] font-semibold">
                        {{ addon.name }} +₱{{ addon.price }}
                      </span>
                    </div>

                    <!-- Per-item notes in modal -->
                    <div v-if="item.notes && item.notes.trim()" class="mt-1">
                      <span class="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-['Poppins'] font-semibold italic">
                        <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                        "{{ item.notes }}"
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Total -->
        <div class="bg-gradient-to-r from-[#FE601C] to-[#f47c49] p-6 rounded-xl">
          <div class="space-y-3 text-white font-['Poppins']">
            <div class="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span class="font-bold">₱{{ selectedOrder.subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="selectedOrder.voucher?.code" class="flex justify-between text-sm">
              <span>Voucher ({{ selectedOrder.voucher.code }}):</span>
              <span class="font-bold">−₱{{ selectedOrder.voucher.discountAmount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>Tax:</span>
              <span class="font-bold">₱{{ selectedOrder.tax.toFixed(2) }}</span>
            </div>
            <div class="border-t border-white/30 pt-3 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₱{{ selectedOrder.totalAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Order-level Special Instructions in Modal -->
        <div v-if="selectedOrder.notes && selectedOrder.notes.trim()" class="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 p-6 rounded-xl">
          <h3 class="font-['Poppins'] font-bold text-[#1A4189] mb-3 flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
            </svg>
            Special Instructions
          </h3>
          <p class="text-gray-800 font-['Poppins'] text-sm leading-relaxed whitespace-pre-wrap">{{ selectedOrder.notes }}</p>
        </div>

        <!-- Payment -->
        <div class="bg-white border border-gray-200 p-6 rounded-xl">
          <h3 class="font-['Poppins'] font-bold text-[#1A4189] mb-3 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            Payment
          </h3>
          <div class="flex items-center gap-3 flex-wrap">
            <span
              :class="{
                'bg-gray-100 text-gray-600': selectedOrder.paymentMethod === 'cash_on_delivery' || !selectedOrder.paymentMethod,
                'bg-blue-100 text-blue-700': selectedOrder.paymentMethod === 'gcash',
                'bg-green-100 text-green-700': selectedOrder.paymentMethod === 'maya',
                'bg-purple-100 text-purple-700': selectedOrder.paymentMethod === 'maribank',
                'bg-red-100 text-red-700': selectedOrder.paymentMethod === 'bpi'
              }"
              class="px-3 py-1 rounded-full text-sm font-['Poppins'] font-bold"
            >
              {{
                selectedOrder.paymentMethod === 'gcash' ? 'GCash' :
                selectedOrder.paymentMethod === 'maya' ? 'Maya' :
                selectedOrder.paymentMethod === 'maribank' ? 'Maribank' :
                selectedOrder.paymentMethod === 'bpi' ? 'BPI' :
                'Cash on Delivery'
              }}
            </span>
          </div>

          <!-- Receipt section -->
          <div
            v-if="['gcash', 'maya', 'maribank', 'bpi'].includes(selectedOrder.paymentMethod)"
            class="mt-3 pt-3 border-t border-gray-100"
          >
            <div v-if="!selectedOrder.receiptImage?.filename" class="flex items-center gap-2 text-gray-500 text-sm font-['Poppins']">
              <span>Awaiting receipt upload</span>
            </div>

            <template v-else-if="!selectedOrder.receiptVerified">
              <div class="space-y-2">
                <img
                  v-if="receiptBlobUrls[selectedOrder.receiptImage.filename]"
                  :src="receiptBlobUrls[selectedOrder.receiptImage.filename]"
                  class="max-h-40 w-full object-contain rounded-lg border border-gray-200"
                  alt="Payment receipt"
                />
                <div v-else class="flex items-center gap-2 text-sm text-gray-500 font-['Poppins']">
                  <div class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                  Loading receipt…
                </div>
                <p class="text-xs text-gray-500 font-['Poppins']">
                  Uploaded {{ formatTime(selectedOrder.receiptImage.uploadedAt) }}
                </p>

                <div v-if="verifyConfirmOrderId !== selectedOrder._id" class="flex gap-2">
                  <button
                    type="button"
                    @click="viewFullReceipt(selectedOrder.receiptImage.filename)"
                    class="px-3 py-1.5 text-xs font-['Poppins'] font-semibold rounded-lg border border-[#1A4189] text-[#1A4189] hover:bg-blue-50 transition-colors"
                  >
                    View Full
                  </button>
                  <button
                    type="button"
                    @click="verifyConfirmOrderId = selectedOrder._id"
                    class="px-3 py-1.5 text-xs font-['Poppins'] font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    Verify &amp; Delete
                  </button>
                </div>

                <div v-else class="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <p class="text-xs font-['Poppins'] text-yellow-800 flex-1">Confirm verify and permanently delete this receipt?</p>
                  <button
                    type="button"
                    @click="verifyConfirmOrderId = null"
                    class="px-2 py-1 text-xs font-['Poppins'] rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    @click="verifyReceipt(selectedOrder)"
                    :disabled="receiptVerifyLoading[selectedOrder._id]"
                    class="px-2 py-1 text-xs font-['Poppins'] rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-1"
                  >
                    <div v-if="receiptVerifyLoading[selectedOrder._id]" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Confirm
                  </button>
                </div>
              </div>
            </template>

            <div v-else class="flex items-center gap-2 text-green-700 text-sm font-['Poppins']">
              <span>Receipt verified on {{ formatDateTime(selectedOrder.receiptVerifiedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Status Update Modal -->
    <Modal
      :is-open="showStatusModal"
      title="Update Order Status"
      submit-text="Update"
      @close="!isUpdating && (showStatusModal = false)"
      @submit="submitStatusUpdate"
    >
      <div class="space-y-4 relative">
        <p class="font-['Poppins'] text-gray-700">
          Update status for order <span class="font-bold text-[#1A4189]">#{{ selectedOrder?.orderNumber }}</span>
        </p>

        <div>
          <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-3">New Status</label>
          <div class="space-y-2">
            <button
              v-for="status in ['pending', 'preparing', 'out for delivery', 'delivered', 'cancelled']"
              :key="status"
              @click="newStatus = status"
              :disabled="isUpdating"
              :class="newStatus === status
                ? 'bg-gradient-to-r from-[#FE601C] to-[#f47c49] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              "
              class="w-full px-4 py-3 rounded-lg font-['Poppins'] font-bold transition-all capitalize disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ status }}
            </button>
          </div>
        </div>

        <div v-if="isUpdating" class="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center">
          <div class="flex flex-col items-center gap-3">
            <div class="w-8 h-8 border-4 border-[#FE601C] border-t-transparent rounded-full animate-spin"></div>
            <p class="font-['Poppins'] font-semibold text-[#1A4189]">Updating...</p>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useSocket } from '~/composables/useSocket'
import Modal from '~/components/admin/Modal.vue'

definePageMeta({
  layout: 'admin'
})

const { getAllOrders, updateOrderStatus } = useApi()
const { socket, isConnected, connect, disconnect } = useSocket()
const { getAuthHeader } = useAdmin()
const config = useRuntimeConfig()
const serverBase = config.public.apiBase.replace(/\/api\/?$/, '')

const orders = ref<any[]>([])
const filterStatus = ref('')
const showOrderDetails = ref(false)
const showStatusModal = ref(false)
const selectedOrder = ref<any>(null)
const newStatus = ref('')
const showToast = ref(false)
const isUpdating = ref(false)
const toastMessage = ref({ title: '', message: '' })
const receiptBlobUrls = ref<Record<string, string>>({})
const receiptVerifyLoading = ref<Record<string, boolean>>({})
const verifyConfirmOrderId = ref<string | null>(null)

const filteredOrders = computed(() => {
  let result = [...orders.value].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
  if (!filterStatus.value) return result
  return result.filter((order) => order.status === filterStatus.value)
})

const loadOrders = async () => {
  try {
    const response = await getAllOrders()
    orders.value = response.data.map((order: any) => ({
      ...order,
      inProgress: false
    }))
  } catch (error) {
    console.error('Failed to load orders:', error)
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 font-bold',
    preparing: 'bg-blue-100 text-blue-800 font-bold',
    'out for delivery': 'bg-purple-100 text-purple-800 font-bold',
    delivered: 'bg-green-100 text-green-800 font-bold',
    cancelled: 'bg-red-100 text-red-800 font-bold'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusCount = (status: string) => {
  return orders.value.filter(o => o.status === status).length
}

const getTimeWaiting = (createdAt: string | Date) => {
  if (!createdAt) return '0m'
  const now = new Date()
  const created = new Date(createdAt)
  const diffMs = now.getTime() - created.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ${diffMins % 60}m`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ${diffHours % 24}h`
}

const formatTime = (time: string | Date) => {
  if (!time) return 'N/A'
  return new Date(time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatDateTime = (time: string | Date) => {
  if (!time) return 'N/A'
  return new Date(time).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch { /* silent */ }
}

const showNotification = (title: string, message: string) => {
  toastMessage.value = { title, message }
  showToast.value = true
  playNotificationSound()
  setTimeout(() => { showToast.value = false }, 5000)
}

const openOrderDetails = (order: any) => {
  selectedOrder.value = order
  showOrderDetails.value = true
  if (order.receiptImage?.filename) {
    fetchReceiptImage(order.receiptImage.filename)
  }
}

const fetchReceiptImage = async (filename: string) => {
  if (!filename || receiptBlobUrls.value[filename]) return
  try {
    const response = await fetch(`${serverBase}/uploads/receipts/${filename}`, {
      headers: getAuthHeader()
    })
    if (!response.ok) return
    const blob = await response.blob()
    receiptBlobUrls.value[filename] = URL.createObjectURL(blob)
  } catch { /* silent */ }
}

const viewFullReceipt = (filename: string) => {
  const url = receiptBlobUrls.value[filename]
  if (url) window.open(url, '_blank')
}

const verifyReceipt = async (order: any) => {
  const orderId = order._id
  receiptVerifyLoading.value[orderId] = true
  verifyConfirmOrderId.value = null
  try {
    const response = await fetch(`${config.public.apiBase}/orders/${orderId}/verify-receipt`, {
      method: 'PATCH',
      headers: getAuthHeader()
    })
    if (!response.ok) throw new Error('Failed')
    order.receiptVerified = true
    order.receiptVerifiedAt = new Date().toISOString()
    if (order.receiptImage) order.receiptImage.deletedAt = new Date().toISOString()
    const idx = orders.value.findIndex((o: any) => o._id === orderId)
    if (idx !== -1) orders.value[idx] = { ...order }
    showNotification('Receipt Verified', `Order #${order.orderNumber} receipt verified and deleted`)
  } catch {
    showNotification('Error', 'Failed to verify receipt')
  } finally {
    receiptVerifyLoading.value[orderId] = false
  }
}

const openStatusUpdate = (order: any) => {
  selectedOrder.value = order
  newStatus.value = order.status
  showStatusModal.value = true
}

const toggleOrderInProgress = (order: any) => {
  order.inProgress = !order.inProgress
}

const submitStatusUpdate = async () => {
  if (!selectedOrder.value || !newStatus.value) return
  try {
    isUpdating.value = true
    const response = await updateOrderStatus(selectedOrder.value._id, newStatus.value)
    const updatedOrder = response.data.order
    const index = orders.value.findIndex(o => o._id === selectedOrder.value._id)
    if (index !== -1) {
      orders.value[index].status = updatedOrder.status
      orders.value[index].inProgress = false
      if (updatedOrder.status !== newStatus.value) {
        showNotification('Warning', 'Status update may not have been saved correctly')
        return
      }
    }
    showStatusModal.value = false
    showNotification('Success', `Order #${selectedOrder.value.orderNumber} status updated to ${newStatus.value}`)
  } catch (error: any) {
    console.error('Status update error:', error)
    showNotification('Error', error.response?.data?.message || 'Failed to update order status')
  } finally {
    isUpdating.value = false
  }
}

onMounted(async () => {
  await loadOrders()
  connect()

  if (socket.value) {
    socket.value.on('new-order', (data) => {
      const newOrder = {
        _id: data.orderId,
        orderNumber: data.orderNumber,
        user: {
          _id: data.userId,
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone
        },
        items: data.items || [],
        subtotal: data.subtotal || 0,
        tax: data.tax || 0,
        totalAmount: data.totalAmount,
        status: data.status || 'pending',
        deliveryAddress: data.deliveryAddress,
        notes: data.notes || '',
        paymentMethod: data.paymentMethod,
        receiptImage: data.receiptImage || null,
        voucher: data.voucher || null,
        createdAt: data.timestamp,
        inProgress: false
      }
      orders.value.unshift(newOrder)
    })

    socket.value.on('order-updated', (data) => {
      const index = orders.value.findIndex(o => o._id === data.orderId)
      if (index !== -1) {
        orders.value[index].status = data.status
      }
    })

    socket.value.emit('join-admin-orders')
  }
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.off('new-order')
    socket.value.off('order-updated')
  }
  disconnect()
  Object.values(receiptBlobUrls.value).forEach(url => URL.revokeObjectURL(url))
})
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.95; }
}
.animate-bounce-slow { animation: bounce-slow 2s infinite; }
.animate-pulse-subtle { animation: pulse-subtle 2s infinite; }
</style>