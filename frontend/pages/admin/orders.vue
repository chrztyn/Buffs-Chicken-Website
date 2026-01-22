<template>
  <div class="p-4 lg:p-8">
    <!-- Page Header -->
    <div>
      <h1 class="font-['Caprasimo'] text-4xl text-[#1A4189] mb-2">Orders</h1>
      <p class="font-['Unbounded'] text-gray-600 mb-6">Real-time order management</p>
    </div>

    <!-- Status Filter -->
    <div class="mb-6 flex flex-wrap gap-2">
      <button
        @click="filterStatus = ''"
        :class="!filterStatus ? 'bg-[#FE601C] text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-full font-['Unbounded'] font-bold transition"
      >
        All Orders
      </button>
      <button
        v-for="status in ['pending', 'preparing', 'out for delivery', 'delivered', 'cancelled']"
        :key="status"
        @click="filterStatus = status"
        :class="filterStatus === status ? 'bg-[#FE601C] text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-full font-['Unbounded'] font-bold transition capitalize"
      >
        {{ status }}
      </button>
    </div>

    <!-- Orders List -->
    <div v-if="filteredOrders.length === 0" class="text-center py-12">
      <p class="text-gray-500 font-['Unbounded'] text-lg">No orders found</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order._id"
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
      >
        <!-- Order Header -->
        <div class="p-4 lg:p-6 border-b border-gray-200 bg-[#FBF4E5]">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p class="text-gray-600 font-['Unbounded'] text-sm font-semibold">Order Number</p>
              <p class="font-['Caprasimo'] text-2xl text-[#1A4189]">#{{ order.orderNumber }}</p>
            </div>
            <div>
              <p class="text-gray-600 font-['Unbounded'] text-sm font-semibold">Customer</p>
              <p class="font-['Unbounded'] font-bold text-[#1A4189]">{{ order.user?.name || 'Guest' }}</p>
              <p class="text-sm text-gray-600">{{ order.user?.phone }}</p>
            </div>
            <div>
              <p class="text-gray-600 font-['Unbounded'] text-sm font-semibold">Amount</p>
              <p class="font-['Caprasimo'] text-2xl text-[#FE601C]">${{ order.totalAmount }}</p>
            </div>
            <div>
              <p class="text-gray-600 font-['Unbounded'] text-sm font-semibold">Status</p>
              <span
                :class="getStatusColor(order.status)"
                class="inline-block px-3 py-1 rounded-full text-xs font-['Unbounded'] font-bold capitalize"
              >
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="p-4 lg:p-6 border-b border-gray-200">
          <h3 class="font-['Unbounded'] font-bold text-[#1A4189] mb-3">Items</h3>
          <div class="space-y-2">
            <div v-for="(item, idx) in order.items" :key="idx" class="flex justify-between text-sm font-['Unbounded']">
              <div>
                <p class="font-bold">{{ item.name }} x{{ item.quantity }}</p>
                <div v-if="item.variants?.length > 0" class="text-xs text-gray-600">
                  Variant: {{ item.variants.map((v: any) => v.name).join(', ') }}
                </div>
                <div v-if="item.selectedAddons?.length > 0" class="text-xs text-gray-600">
                  Extras: {{ item.selectedAddons.map((a: any) => a.name).join(', ') }}
                </div>
              </div>
              <p class="font-bold text-[#FE601C]">${{ item.itemTotal }}</p>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="p-4 lg:p-6 border-b border-gray-200">
          <div class="space-y-2 text-sm font-['Unbounded']">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${{ order.subtotal }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Tax:</span>
              <span>${{ order.tax }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Delivery Fee:</span>
              <span>${{ order.deliveryFee }}</span>
            </div>
          </div>
        </div>

        <!-- Delivery Details -->
        <div class="p-4 lg:p-6 border-b border-gray-200">
          <h3 class="font-['Unbounded'] font-bold text-[#1A4189] mb-3">Delivery Details</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-['Unbounded']">
            <div>
              <p class="text-gray-600 font-semibold">Address</p>
              <p>{{ order.deliveryAddress }}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Est. Delivery</p>
              <p>{{ formatTime(order.estimatedDeliveryTime) }}</p>
            </div>
          </div>
          <div v-if="order.notes" class="mt-3 p-3 bg-blue-50 rounded-lg">
            <p class="text-gray-600 font-semibold mb-1">Special Requests</p>
            <p class="text-gray-700">{{ order.notes }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="p-4 lg:p-6 flex flex-col sm:flex-row gap-3">
          <button
            @click="openOrderDetails(order)"
            class="flex-1 px-4 py-2 bg-blue-100 text-blue-700 font-['Unbounded'] font-bold rounded-lg hover:bg-blue-200 transition"
          >
            View Details
          </button>
          <button
            v-if="order.status !== 'delivered' && order.status !== 'cancelled'"
            @click="openStatusUpdate(order)"
            class="flex-1 px-4 py-2 bg-[#FE601C] text-white font-['Unbounded'] font-bold rounded-lg hover:bg-[#e5551a] transition"
          >
            Update Status
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
        <div class="bg-[#FBF4E5] p-4 rounded-lg">
          <h2 class="font-['Caprasimo'] text-2xl text-[#1A4189] mb-4">#{{ selectedOrder.orderNumber }}</h2>
          <div class="grid grid-cols-2 gap-4 text-sm font-['Unbounded']">
            <div>
              <p class="text-gray-600 font-semibold">Placed</p>
              <p>{{ formatDateTime(selectedOrder.createdAt) }}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Status</p>
              <span :class="getStatusColor(selectedOrder.status)" class="inline-block px-3 py-1 rounded-full text-xs font-bold capitalize">
                {{ selectedOrder.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div>
          <h3 class="font-['Unbounded'] font-bold text-[#1A4189] mb-3">Customer Information</h3>
          <div class="grid grid-cols-2 gap-4 text-sm font-['Unbounded']">
            <div>
              <p class="text-gray-600 font-semibold">Name</p>
              <p>{{ selectedOrder.user?.name }}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Phone</p>
              <p>{{ selectedOrder.user?.phone }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-gray-600 font-semibold">Email</p>
              <p>{{ selectedOrder.user?.email }}</p>
            </div>
          </div>
        </div>

        <!-- All Items with Details -->
        <div>
          <h3 class="font-['Unbounded'] font-bold text-[#1A4189] mb-3">Items Ordered</h3>
          <div class="space-y-3">
            <div v-for="(item, idx) in selectedOrder.items" :key="idx" class="border rounded-lg p-4">
              <div class="flex justify-between mb-2">
                <div>
                  <p class="font-['Unbounded'] font-bold">{{ item.name }}</p>
                  <p class="text-sm text-gray-600 font-['Unbounded']">Qty: {{ item.quantity }}</p>
                </div>
                <p class="font-['Caprasimo'] text-[#FE601C] font-bold">${{ item.itemTotal }}</p>
              </div>
              <div v-if="item.variants?.length > 0" class="text-xs text-gray-600 font-['Unbounded'] ml-0 mb-1">
                <p class="font-semibold">Variant: {{ item.variants.map((v: any) => `${v.name} (+$${v.price})`).join(', ') }}</p>
              </div>
              <div v-if="item.selectedAddons?.length > 0" class="text-xs text-gray-600 font-['Unbounded']">
                <p class="font-semibold">Extras: {{ item.selectedAddons.map((a: any) => `${a.name} (+$${a.price})`).join(', ') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Total -->
        <div class="bg-[#FBF4E5] p-4 rounded-lg">
          <div class="space-y-2 text-sm font-['Unbounded']">
            <div class="flex justify-between">
              <span>Subtotal:</span>
              <span class="font-bold">${{ selectedOrder.subtotal }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tax:</span>
              <span class="font-bold">${{ selectedOrder.tax }}</span>
            </div>
            <div class="flex justify-between">
              <span>Delivery Fee:</span>
              <span class="font-bold">${{ selectedOrder.deliveryFee }}</span>
            </div>
            <div class="border-t pt-2 flex justify-between font-bold text-[#FE601C]">
              <span>Total:</span>
              <span>${{ selectedOrder.totalAmount }}</span>
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
      @close="showStatusModal = false"
      @submit="submitStatusUpdate"
    >
      <div class="space-y-4">
        <p class="font-['Unbounded'] text-gray-700">
          Update status for order <span class="font-bold">#{{ selectedOrder?.orderNumber }}</span>
        </p>

        <div>
          <label class="block font-['Unbounded'] font-semibold text-[#1A4189] mb-3">
            New Status
          </label>
          <div class="space-y-2">
            <button
              v-for="status in ['pending', 'preparing', 'out for delivery', 'delivered', 'cancelled']"
              :key="status"
              @click="newStatus = status"
              :class="newStatus === status
                ? 'bg-[#FE601C] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              "
              class="w-full px-4 py-3 rounded-lg font-['Unbounded'] font-bold transition capitalize"
            >
              {{ status }}
            </button>
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
const { connect, disconnect, notifications } = useSocket()

const orders = ref<any[]>([])
const filterStatus = ref('')
const showOrderDetails = ref(false)
const showStatusModal = ref(false)
const selectedOrder = ref<any>(null)
const newStatus = ref('')

const filteredOrders = computed(() => {
  if (!filterStatus.value) return orders.value
  return orders.value.filter((order) => order.status === filterStatus.value)
})

const loadOrders = async () => {
  try {
    const response = await getAllOrders()
    orders.value = response.data
  } catch (error) {
    console.error('Failed to load orders:', error)
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

const formatTime = (time: string | Date) => {
  if (!time) return 'N/A'
  const date = new Date(time)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateTime = (time: string | Date) => {
  if (!time) return 'N/A'
  const date = new Date(time)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openOrderDetails = (order: any) => {
  selectedOrder.value = order
  showOrderDetails.value = true
}

const openStatusUpdate = (order: any) => {
  selectedOrder.value = order
  newStatus.value = order.status
  showStatusModal.value = true
}

const submitStatusUpdate = async () => {
  if (!selectedOrder.value || !newStatus.value) return

  try {
    await updateOrderStatus(selectedOrder.value._id, newStatus.value)
    showStatusModal.value = false
    await loadOrders()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to update order status')
  }
}

onMounted(async () => {
  await loadOrders()
  connect()

  // Watch for new orders via socket
  const unwatch = watch(() => notifications.value, (newNotifications) => {
    if (newNotifications.length > 0) {
      // Reload orders when new notification arrives
      loadOrders()
    }
  })

  onUnmounted(() => {
    unwatch()
  })
})

onUnmounted(() => {
  disconnect()
})
</script>
