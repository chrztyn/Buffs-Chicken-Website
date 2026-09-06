<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-[#FBF4E5] via-[#FFF8E7] to-[#FBF4E5] px-4 py-10">
    <div class="w-full max-w-md mx-auto">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-xl sm:text-2xl font-bold text-[#1A4189]">Scan to pay</h1>
        <p class="text-xs text-gray-500 mt-1">
          Your order confirms automatically once payment clears — no receipt upload needed.
        </p>
      </div>

      <!-- Payment card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
        <!-- Missing order -->
        <div v-if="!orderId" class="flex flex-col items-center gap-3 py-8 text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p class="font-bold text-red-700">No pending payment</p>
          <p class="text-xs text-gray-500 max-w-xs">We couldn't find an order to pay for. Please place your order again.</p>
          <NuxtLink to="/cart" class="mt-2 text-sm text-[#1A4189] underline hover:text-[#FE601C]">
            Back to cart
          </NuxtLink>
        </div>

        <QRPhPayment
          v-else
          :order-id="orderId"
          :amount="amount"
          @paid="handlePaid"
          @failed="() => {}"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const router = useRouter()

const orderId = ref(null)
const amount = ref(0)

onMounted(() => {
  try {
    const raw = localStorage.getItem('buffs_order')
    if (raw) {
      const o = JSON.parse(raw)
      orderId.value = o.orderId || null
      amount.value = Number(o.total) || 0
    }
  } catch (e) {
    orderId.value = null
  }
})

const handlePaid = () => {
  try {
    const raw = localStorage.getItem('buffs_order')
    if (raw) {
      const o = JSON.parse(raw)
      o.status = 'pending'
      localStorage.setItem('buffs_order', JSON.stringify(o))
    }
  } catch (e) { /* non-fatal */ }

  setTimeout(() => router.push('/order-status'), 1500)
}
</script>
