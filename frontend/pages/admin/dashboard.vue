<template>
  <div class="p-4 lg:p-8">
    <!-- Page Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 class="font-['Poppins'] text-4xl text-[#1A4189] mb-2">Dashboard</h1>
        <p class="font-['Poppins'] text-gray-600">Welcome back, {{ adminName }}!</p>
        <p v-if="summaryError" class="font-['Poppins'] text-sm text-red-500 mt-1">{{ summaryError }}</p>
      </div>
      <button
        @click="loadSummary"
        :disabled="summaryLoading"
        class="flex items-center gap-2 px-4 py-2 bg-[#FE601C] text-white font-['Poppins'] font-semibold text-sm rounded-xl hover:bg-[#e5551a] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed self-start shrink-0"
      >
        <svg v-if="summaryLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        {{ summaryLoading ? 'Loading...' : 'View Today\'s Summary' }}
      </button>
    </div>

    <!-- Real-time Notifications -->
    <div v-if="socketNotifications.length > 0" class="mb-6 space-y-2 max-h-64 overflow-y-auto">
      <div
        v-for="(notif, idx) in socketNotifications"
        :key="idx"
        @click="handleNotificationClick(notif)"
        class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg cursor-pointer hover:bg-orange-50 transition-colors duration-200"
      >
        <p class="font-['Poppins'] font-bold text-blue-900">{{ notif.title }}</p>
        <p class="text-sm text-blue-700">{{ notif.message }}</p>
      </div>
    </div>

    <!-- Analytics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Total Orders Card -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-['Poppins'] text-sm text-gray-600 font-semibold">Total Orders</p>
            <p class="font-['Poppins'] text-3xl text-[#1A4189] mt-2">{{ analytics.totalOrders }}</p>
          </div>
        </div>
      </div>

      <!-- Total Revenue Card -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-['Poppins'] text-sm text-gray-600 font-semibold">Total Revenue</p>
            <p class="font-['Poppins'] text-3xl text-[#1A4189] mt-2">₱{{ analytics.totalRevenue }}</p>
          </div>
        </div>
      </div>

      <!-- Today Orders Card -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-['Poppins'] text-sm text-gray-600 font-semibold">Today's Orders</p>
            <p class="font-['Poppins'] text-3xl text-[#1A4189] mt-2">{{ analytics.todayOrders }}</p>
          </div>
        </div>
      </div>

      <!-- Active Orders Card -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-['Poppins'] text-sm text-gray-600 font-semibold">Active Orders</p>
            <p class="font-['Poppins'] text-3xl text-[#1A4189] mt-2">{{ analytics.activeOrders }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Website Analytics Link Card -->
    <a 
      href="https://analytics.google.com/analytics/web/#/p/414999518/reports/dashboard" 
      target="_blank"
      class="block bg-gradient-to-r from-[#FE601C] to-[#e5540a] rounded-xl shadow-lg p-6 mb-8 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="font-['Poppins'] text-sm text-white font-semibold mb-2">Website Analytics</p>
          <p class="font-['Poppins'] text-lg text-white mb-3">View detailed traffic and user insights</p>
          <p class="font-['Poppins'] text-xs text-white/80">Click to open Google Analytics Dashboard</p>
        </div>
        <div class="text-white">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </div>
      </div>
    </a>

    <!-- Order Status Breakdown -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 class="font-['Poppins'] text-2xl text-[#1A4189] mb-4">Orders by Status</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          v-for="(count, status) in analytics.ordersByStatus"
          :key="status"
          class="p-4 bg-[#FBF4E5] rounded-lg border-2 border-gray-200"
        >
          <p class="font-['Poppins'] text-xs font-semibold text-gray-600 uppercase">{{ status }}</p>
          <p class="font-['Poppins'] text-2xl text-[#FE601C] mt-2">{{ count }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-['Poppins'] text-2xl text-[#1A4189]">Recent Orders</h2>
        <button
          @click="loadAnalytics"
          class="px-4 py-2 bg-[#FE601C] text-white font-['Poppins'] font-semibold rounded-lg hover:bg-[#e5551a] transition"
        >
          Refresh
        </button>
      </div>

      <div v-if="recentOrders.length === 0" class="text-center py-8">
        <p class="text-gray-500 font-['Poppins']">No recent orders</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm font-['Poppins']">
          <thead class="bg-[#FBF4E5] border-b">
            <tr>
              <th class="text-left p-3 font-semibold text-[#1A4189]">Order #</th>
              <th class="text-left p-3 font-semibold text-[#1A4189]">Customer</th>
              <th class="text-left p-3 font-semibold text-[#1A4189]">Amount</th>
              <th class="text-left p-3 font-semibold text-[#1A4189]">Status</th>
              <th class="text-left p-3 font-semibold text-[#1A4189]">Time</th>
              <th class="text-left p-3 font-semibold text-[#1A4189]">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order._id" class="border-b hover:bg-gray-50">
              <td class="p-3 font-bold text-[#FE601C]">#{{ order.orderNumber }}</td>
              <td class="p-3 text-gray-700">{{ order.user?.name || 'Guest' }}</td>
              <td class="p-3 font-semibold text-[#1A4189]">₱{{ order.totalAmount }}</td>
              <td class="p-3">
                <span
                  :class="getStatusColor(order.status)"
                  class="px-3 py-1 rounded-full text-xs font-bold"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="p-3 text-gray-600">{{ formatTime(order.createdAt) }}</td>
              <td class="p-3">
                <NuxtLink
                  to="/admin/orders"
                  class="text-[#FE601C] hover:underline font-bold"
                >
                  View
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Today's Summary Modal -->
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="showSummaryModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="closeSummaryModal"
      >
        <div class="summary-print-area bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <div>
              <h2 class="flex items-center gap-2 font-['Poppins'] text-xl font-bold text-[#1A4189]">
                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Today's Summary
              </h2>
              <p class="font-['Poppins'] text-sm text-gray-500 mt-0.5">{{ summaryData?.date }}</p>
            </div>
            <button
              @click="closeSummaryModal"
              class="no-print p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Scrollable Body -->
          <div class="overflow-y-auto flex-1 px-6 py-5 space-y-6">
            <!-- Total Stats -->
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-[#1A4189] rounded-xl p-4 text-white text-center">
                <p class="font-['Poppins'] text-xs font-semibold uppercase tracking-wide opacity-80 mb-1">Total Orders</p>
                <p class="font-['Poppins'] text-3xl font-bold">{{ summaryData?.totalOrders ?? 0 }}</p>
              </div>
              <div class="bg-[#1A4189] rounded-xl p-4 text-white text-center">
                <p class="font-['Poppins'] text-xs font-semibold uppercase tracking-wide opacity-80 mb-1">Total Revenue</p>
                <p class="font-['Poppins'] text-2xl font-bold leading-tight mt-1">₱{{ formatRevenue(summaryData?.totalRevenue) }}</p>
              </div>
            </div>

            <!-- Payment Breakdown -->
            <div>
              <h3 class="font-['Poppins'] font-bold text-[#1A4189] text-xs uppercase tracking-wide mb-3">Payment Breakdown</h3>
              <div class="space-y-2">
                <div
                  v-for="method in paymentMethodsList"
                  :key="method.key"
                  :class="(summaryData?.paymentBreakdown?.[method.key]?.count ?? 0) > 0 ? 'bg-white border border-gray-200' : 'bg-gray-50 border border-gray-100'"
                  class="flex items-center justify-between p-3 rounded-xl"
                >
                  <span :class="method.badge" class="px-2.5 py-1 rounded-full text-xs font-['Poppins'] font-bold">
                    {{ method.label }}
                  </span>
                  <div class="flex items-center gap-6">
                    <span
                      :class="(summaryData?.paymentBreakdown?.[method.key]?.count ?? 0) > 0 ? 'text-[#1A4189]' : 'text-gray-400'"
                      class="font-['Poppins'] font-bold text-sm w-6 text-center"
                    >{{ summaryData?.paymentBreakdown?.[method.key]?.count ?? 0 }}</span>
                    <span
                      :class="(summaryData?.paymentBreakdown?.[method.key]?.count ?? 0) > 0 ? 'text-[#FE601C]' : 'text-gray-400'"
                      class="font-['Poppins'] font-semibold text-sm w-24 text-right"
                    >₱{{ formatRevenue(summaryData?.paymentBreakdown?.[method.key]?.total) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Individual Orders -->
            <div>
              <h3 class="font-['Poppins'] font-bold text-[#1A4189] text-xs uppercase tracking-wide mb-3">Individual Orders</h3>
              <div v-if="!summaryData?.orders?.length" class="text-center py-8 text-gray-400 font-['Poppins'] text-sm">
                No orders yet today
              </div>
              <div v-else class="max-h-60 overflow-y-auto space-y-2 pr-1">
                <div
                  v-for="order in summaryData.orders"
                  :key="order.orderNumber"
                  class="flex flex-wrap items-center gap-x-2 gap-y-1 p-3 bg-[#FBF4E5] rounded-xl text-sm"
                >
                  <span class="font-['Poppins'] font-bold text-[#FE601C] shrink-0">#{{ order.orderNumber }}</span>
                  <span class="font-['Poppins'] text-gray-700 flex-1 min-w-0 truncate">{{ order.customerName }}</span>
                  <span :class="getPaymentBadge(order.paymentMethod)" class="px-2 py-0.5 rounded-full text-xs font-['Poppins'] font-bold shrink-0">
                    {{ getPaymentLabel(order.paymentMethod) }}
                  </span>
                  <span class="font-['Poppins'] font-semibold text-[#1A4189] shrink-0">₱{{ formatRevenue(order.totalAmount) }}</span>
                  <span class="shrink-0">{{ getStatusIcon(order.status) }}</span>
                  <span class="font-['Poppins'] text-xs text-gray-400 w-full">{{ order.createdAt }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="no-print flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
            <button
              @click="closeSummaryModal"
              class="px-4 py-2 font-['Poppins'] font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              @click="printSummary"
              class="flex items-center gap-2 px-4 py-2 font-['Poppins'] font-semibold text-sm bg-[#1A4189] text-white hover:bg-[#16367a] rounded-xl transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              Print Summary
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useApi } from '~/composables/useApi'
import { useSocket } from '~/composables/useSocket'
import { useAdmin } from '~/composables/useAdmin'

definePageMeta({
  layout: 'admin'
})

const { getAnalytics, getSummaryToday } = useApi()
const { notifications, connect, disconnect } = useSocket()
const { admin } = useAdmin()

const analytics = ref({
  totalOrders: 0,
  totalRevenue: 0,
  todayOrders: 0,
  activeOrders: 0,
  ordersByStatus: {
    pending: 0,
    preparing: 0,
    'out for delivery': 0,
    delivered: 0,
    cancelled: 0
  }
})

const recentOrders = ref<any[]>([])
const isLoading = ref(false)
const adminName = ref('')
const socketNotifications = ref<any[]>([])

// Summary modal state
const showSummaryModal = ref(false)
const summaryData = ref<any>(null)
const summaryLoading = ref(false)
const summaryError = ref<string | null>(null)

const paymentMethodsList = [
  { key: 'cash_on_delivery', label: 'Cash on Delivery', badge: 'bg-gray-100 text-gray-600' },
  { key: 'gcash',            label: 'GCash',            badge: 'bg-blue-100 text-blue-700' },
  { key: 'maya',             label: 'Maya',             badge: 'bg-green-100 text-green-700' },
  { key: 'maribank',         label: 'Maribank',         badge: 'bg-purple-100 text-purple-700' },
  { key: 'bpi',              label: 'BPI',              badge: 'bg-red-100 text-red-700' },
]

const loadAnalytics = async () => {
  isLoading.value = true
  try {
    const response = await getAnalytics()
    // Backend returns the data directly
    const data = response.data
    analytics.value = {
      totalOrders: data.totalOrders || 0,
      totalRevenue: data.totalRevenue || 0,
      todayOrders: data.todayOrders || 0,
      activeOrders: data.activeOrders || 0,
      ordersByStatus: {
        pending: 0,
        preparing: 0,
        'out for delivery': 0,
        delivered: 0,
        cancelled: 0
      }
    }
    
    // Parse ordersByStatus
    if (data.ordersByStatus && Array.isArray(data.ordersByStatus)) {
      data.ordersByStatus.forEach((item: any) => {
        const status = item._id as keyof typeof analytics.value.ordersByStatus
        analytics.value.ordersByStatus[status] = item.count
      })
    }
    
    recentOrders.value = data.recentOrders || []
  } catch (error) {
    console.error('Failed to load analytics:', error)
  } finally {
    isLoading.value = false
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    'out for delivery': 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const loadSummary = async () => {
  summaryLoading.value = true
  summaryError.value = null
  try {
    const response = await getSummaryToday()
    summaryData.value = response.data
    showSummaryModal.value = true
  } catch {
    summaryError.value = 'Failed to load summary. Please try again.'
  } finally {
    summaryLoading.value = false
  }
}

const closeSummaryModal = () => {
  showSummaryModal.value = false
  summaryData.value = null
}

const printSummary = () => {
  if (process.client) window.print()
}

const formatRevenue = (amount?: number) => {
  if (amount === undefined || amount === null) return '0.00'
  return amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getPaymentBadge = (method: string) => {
  const map: Record<string, string> = {
    cash_on_delivery: 'bg-gray-100 text-gray-600',
    gcash: 'bg-blue-100 text-blue-700',
    maya: 'bg-green-100 text-green-700',
    maribank: 'bg-purple-100 text-purple-700',
    bpi: 'bg-red-100 text-red-700',
  }
  return map[method] || 'bg-gray-100 text-gray-600'
}

const getPaymentLabel = (method: string) => {
  const map: Record<string, string> = {
    cash_on_delivery: 'COD', gcash: 'GCash', maya: 'Maya', maribank: 'Maribank', bpi: 'BPI'
  }
  return map[method] || method
}

const getStatusIcon = (status: string) => {
  const map: Record<string, string> = {
    delivered: 'Delivered', confirmed: 'Confirmed', pending: 'Pending',
    preparing: 'Preparing', 'out for delivery': 'Out for Delivery', cancelled: 'Cancelled'
  }
  return map[status] || status
}

const handleNotificationClick = (_notif: any) => {
  navigateTo('/admin/orders')
}

const formatTime = (time: string) => {
  const date = new Date(time)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watch for socket notifications (before onMounted)
const unwatchNotifications = watch(
  () => notifications.value,
  (newNotifications) => {
    socketNotifications.value = newNotifications.slice(0, 3)
  }
)

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showSummaryModal.value) closeSummaryModal()
}

onMounted(async () => {
  adminName.value = admin.value?.name || 'Admin'

  // Wait for the next tick to ensure token is ready
  await nextTick()

  // Connect to socket for real-time updates
  connect()

  // Load analytics on mount
  await loadAnalytics()

  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  unwatchNotifications()
  disconnect()
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media print {
  body * {
    visibility: hidden;
  }
  .summary-print-area,
  .summary-print-area * {
    visibility: visible;
  }
  .summary-print-area {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    max-height: none !important;
    overflow: visible !important;
    box-shadow: none;
    border-radius: 0;
  }
  .no-print {
    display: none !important;
  }
}
</style>
