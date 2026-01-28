import { ref, onMounted, onUnmounted } from 'vue'
import io, { Socket } from 'socket.io-client'
import { useAdmin } from './useAdmin'

export const useSocket = () => {
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const notifications = ref<any[]>([])
  const { token } = useAdmin()

  const connect = () => {
    if (!token.value || socket.value?.connected) return

    // Prevent multiple connection attempts
    if (socket.value) return

    const socketUrl = process.env.NUXT_PUBLIC_SOCKET_URL || 'http://localhost:5001'
    socket.value = io(socketUrl, {
      auth: {
        token: token.value
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    })

    socket.value.on('connect', () => {
      isConnected.value = true
      // Join admin room for real-time updates
      socket.value?.emit('join-admin', { adminId: 'admin-room' })
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
    })

    // Listen for new orders
    socket.value.on('new-order', (order) => {
      notifications.value.unshift({
        type: 'order',
        title: `New Order #${order.orderNumber}`,
        message: `Order from ${order.deliveryAddress} - $${order.totalAmount}`,
        order,
        timestamp: new Date()
      })
    })

    // Listen for order status updates
    socket.value.on('order-status-updated', (data) => {
      notifications.value.unshift({
        type: 'status',
        title: `Order #${data.orderNumber} Status Updated`,
        message: `Status: ${data.status}`,
        order: data,
        timestamp: new Date()
      })
    })

    // Listen for admin notifications
    socket.value.on('admin-notification', (notification) => {
      notifications.value.unshift(notification)
    })
  }

  const disconnect = () => {
    if (socket.value) {
      // Remove all event listeners to prevent memory leaks
      socket.value.off('connect')
      socket.value.off('disconnect')
      socket.value.off('new-order')
      socket.value.off('order-status-updated')
      socket.value.off('admin-notification')
      
      // Disconnect socket
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  const emitOrderStatusChange = (orderId: string, status: string) => {
    if (socket.value?.connected) {
      socket.value.emit('admin-update-order', { orderId, status })
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  return {
    socket,
    isConnected,
    notifications,
    connect,
    disconnect,
    emitOrderStatusChange,
    clearNotifications
  }
}
