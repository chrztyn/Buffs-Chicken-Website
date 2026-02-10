<template>
  <div class="p-4 lg:p-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="font-['Unbounded'] text-4xl text-[#1A4189] mb-2">Dashboard</h1>
      <p class="font-['Unbounded'] text-gray-600">Welcome back, {{ adminName }}!</p>
    </div>

    <!-- Real-time Notifications -->
    <div v-if="socketNotifications.length > 0" class="mb-6 space-y-2 max-h-64 overflow-y-auto">
      <div
        v-for="(notif, idx) in socketNotifications"
        :key="idx"
        class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg"
      >
        <p class="font-['Unbounded'] font-bold text-blue-900">{{ notif.title }}</p>
        <p class="text-sm text-blue-700">{{ notif.message }}</p>
      </div>
    </div>

    <!-- Analytics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Total Orders Card -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-['Unbounded'] text-sm text-gray-600 font-semibold">Total Orders</p>
            <p class="font-['Unbounded'] text-3xl text-[#1A4189] mt-2">{{ analytics.totalOrders }}</p>
          </div>
        </div>
      </div>

      <!-- Total Revenue Card -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-['Unbounded'] text-sm text-gray-600 font-semibold">Total Revenue</p>
            <p class="font-['Unbounded'] text-3xl text-[#1A4189] mt-2">₱{{ analytics.totalRevenue }}</p>
          </div>
        </div>
      </div>

      <!-- Today Orders Card -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-['Unbounded'] text-sm text-gray-600 font-semibold">Today's Orders</p>
            <p class="font-['Unbounded'] text-3xl text-[#1A4189] mt-2">{{ analytics.todayOrders }}</p>
          </div>
        </div>
      </div>

      <!-- Active Orders Card -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-['Unbounded'] text-sm text-gray-600 font-semibold">Active Orders</p>
            <p class="font-['Unbounded'] text-3xl text-[#1A4189] mt-2">{{ analytics.activeOrders }}</p>
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
          <p class="font-['Unbounded'] text-sm text-white font-semibold mb-2">Website Analytics</p>
          <p class="font-['Unbounded'] text-lg text-white mb-3">View detailed traffic and user insights</p>
          <p class="font-['Unbounded'] text-xs text-white/80">Click to open Google Analytics Dashboard</p>
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
      <h2 class="font-['Unbounded'] text-2xl text-[#1A4189] mb-4">Orders by Status</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          v-for="(count, status) in analytics.ordersByStatus"
          :key="status"
          class="p-4 bg-[#FBF4E5] rounded-lg border-2 border-gray-200"
        >
          <p class="font-['Unbounded'] text-xs font-semibold text-gray-600 uppercase">{{ status }}</p>
          <p class="font-['Unbounded'] text-2xl text-[#FE601C] mt-2">{{ count }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-['Unbounded'] text-2xl text-[#1A4189]">Recent Orders</h2>
        <button
          @click="loadAnalytics"
          class="px-4 py-2 bg-[#FE601C] text-white font-['Unbounded'] font-semibold rounded-lg hover:bg-[#e5551a] transition"
        >
          Refresh
        </button>
      </div>

      <div v-if="recentOrders.length === 0" class="text-center py-8">
        <p class="text-gray-500 font-['Unbounded']">No recent orders</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm font-['Unbounded']">
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
              <td class="p-3 font-semibold text-[#1A4189]">${{ order.totalAmount }}</td>
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
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useApi } from '~/composables/useApi'
import { useSocket } from '~/composables/useSocket'
import { useAdmin } from '~/composables/useAdmin'

definePageMeta({
  layout: 'admin'
})

const { getAnalytics } = useApi()
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

const loadAnalytics = async () => {
  isLoading.value = true
  try {
    const response = await getAnalytics()
    // Backend returns the data directly
    const data = response.data
    analytics.value = {
      totalOrders: data.totalOrders || 0,
      totalRevenue: data.totalRevenue || 0,
      todayOrders: 0,
      activeOrders: 0,
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

onMounted(async () => {
  adminName.value = admin.value?.name || 'Admin'

  // Wait for the next tick to ensure token is ready
  await nextTick()

  // Connect to socket for real-time updates
  connect()

  // Load analytics on mount
  await loadAnalytics()
})

onUnmounted(() => {
  unwatchNotifications()
  disconnect()
})
</script>
