<script setup>
const props = defineProps({
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
})

const emit = defineEmits(['paid', 'failed'])

const config = useRuntimeConfig()
const API_BASE_URL = config.public.apiBase

const MAX_AMOUNT = 50000 // PayMongo QR Ph per-transaction limit (PHP)

const status = ref('loading') // 'loading' | 'ready' | 'paid' | 'failed'
const qrImageUrl = ref('')
const testUrl = ref('')
const errorMsg = ref('')
// Authoritative amount comes from the backend (order.totalAmount); prop is a fallback.
const displayAmount = ref(Number(props.amount) || 0)

let pollTimer = null

onMounted(async () => {
  if (props.amount > MAX_AMOUNT) {
    status.value = 'failed'
    errorMsg.value = `QR Ph payments are limited to ₱${MAX_AMOUNT.toLocaleString()} per transaction. Please choose a different payment method.`
    return
  }
  await generateQR()
})

onUnmounted(() => stopPolling())

async function generateQR() {
  status.value = 'loading'
  errorMsg.value = ''

  try {
    const res = await fetch(`${API_BASE_URL}/orders/${props.orderId}/qrph`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || 'Failed to generate QR code.')
    if (!data.qrCodeImageUrl) throw new Error('QR code was not returned. Please try again.')

    // PayMongo returns next_action.code.image_url already as a base64 data URI.
    qrImageUrl.value = data.qrCodeImageUrl
    testUrl.value = data.testUrl || '' // present only in PayMongo test mode
    if (data.amount != null) displayAmount.value = Number(data.amount)

    status.value = 'ready'
    startPolling()
  } catch (err) {
    status.value = 'failed'
    errorMsg.value = err?.message || 'Failed to generate QR code. Please try again or choose a different payment method.'
    console.error('[QRPH] QR generation error:', err)
  }
}

function startPolling() {
  stopPolling()
  let iterations = 0
  pollTimer = setInterval(async () => {
    iterations++
    if (iterations > 120) { // 5s * 120 = 10 minutes
      stopPolling()
      status.value = 'failed'
      errorMsg.value = 'Payment was not confirmed within 10 minutes. Please try again or choose a different payment method.'
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/orders/${props.orderId}/status`)
      const data = await res.json()
      if (!res.ok) return

      if (data.paymongoStatus === 'paid') {
        stopPolling()
        status.value = 'paid'
        emit('paid')
      } else if (data.paymongoStatus === 'failed' || data.paymongoStatus === 'expired') {
        stopPolling()
        status.value = 'failed'
        errorMsg.value = data.paymongoStatus === 'expired'
          ? 'This QR code has expired. Please try again.'
          : 'Your payment could not be processed. Please try again.'
        emit('failed')
      }
    } catch {
      // transient network error — keep polling silently
    }
  }, 5000)
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 py-4 px-2">
    <!-- Loading -->
    <template v-if="status === 'loading'">
      <div class="w-[260px] h-[260px] rounded-xl bg-gray-100 animate-pulse" />
      <p class="text-sm text-gray-500">Generating your QR code…</p>
    </template>

    <!-- Ready — awaiting scan -->
    <template v-else-if="status === 'ready'">
      <img
        :src="qrImageUrl"
        alt="Scan this QR code to pay via QR Ph"
        class="w-[260px] h-[260px] rounded-xl border-2 border-gray-200 shadow-md bg-white object-contain"
      />
      <div class="text-center space-y-1">
        <p class="font-semibold text-gray-800">Scan with any banking or e-wallet app</p>
        <p class="text-xs text-gray-500">BPI · BDO · Metrobank · UnionBank · GCash · Maya · and more</p>
        <p class="text-sm font-bold text-[#1A4189]">₱{{ displayAmount.toLocaleString() }}</p>
      </div>
      <div class="w-full max-w-xs bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-xs text-yellow-800 text-center">
        ⚠️ Do not close this page until you see “Payment confirmed.”
      </div>
      <p class="text-xs text-gray-400 animate-pulse">Waiting for payment confirmation…</p>

      <!-- Test mode only: simulate payment without scanning / real money -->
      <a
        v-if="testUrl"
        :href="testUrl"
        target="_blank"
        rel="noopener"
        class="text-xs font-semibold text-purple-600 underline hover:text-purple-800"
      >
        🧪 Simulate payment (test mode)
      </a>
    </template>

    <!-- Paid -->
    <template v-else-if="status === 'paid'">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div class="text-center space-y-1">
        <p class="font-bold text-green-700 text-lg">Payment confirmed!</p>
        <p class="text-sm text-gray-500">Your order is now in the queue. We'll prepare it shortly.</p>
      </div>
    </template>

    <!-- Failed -->
    <template v-else>
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div class="text-center space-y-2">
        <p class="font-bold text-red-700">Something went wrong</p>
        <p class="text-xs text-gray-500 max-w-xs">{{ errorMsg }}</p>
        <button
          v-if="amount <= MAX_AMOUNT"
          type="button"
          class="mt-2 text-sm text-[#1A4189] underline hover:text-[#FE601C]"
          @click="generateQR"
        >
          Try again
        </button>
      </div>
    </template>
  </div>
</template>
