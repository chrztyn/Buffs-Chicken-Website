<template>
  <div class="p-4 lg:p-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="font-['Poppins'] font-bold text-4xl text-[#1A4189] mb-2">Vouchers</h1>
        <p class="font-['Poppins'] text-gray-600">Manage discount codes and promotions</p>
      </div>
      <button
        @click="openAddVoucher"
        class="px-6 py-2 bg-[#FE601C] text-white font-['Poppins'] font-bold rounded-lg hover:bg-[#e5551a] transition"
      >
        + Add Voucher
      </button>
    </div>

    <div v-if="vouchers.length === 0" class="text-center py-12">
      <p class="text-gray-500 font-['Poppins'] text-lg">No vouchers found</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="voucher in vouchers"
        :key="voucher._id"
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
      >
        <div class="p-5">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <div class="inline-block px-3 py-1 bg-[#1A4189] text-white font-['Poppins'] font-bold text-sm rounded-lg mb-2">
                {{ voucher.code }}
              </div>
              <div class="flex items-center gap-2">
                <span
                  :class="getBenefitTypeColor(voucher.benefitType)"
                  class="px-2 py-1 rounded-full text-xs font-['Poppins'] font-bold"
                >
                  {{ getBenefitTypeLabel(voucher.benefitType) }}
                </span>
                <span
                  :class="voucher.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
                  class="px-2 py-1 rounded-full text-xs font-['Poppins'] font-bold"
                >
                  {{ voucher.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-2 mb-4 text-sm font-['Poppins']">
            <div v-if="voucher.benefitType === 'percentage'">
              <p class="text-gray-600">{{ voucher.percentageAmount }}% off (max ₱{{ voucher.maxDiscountCap }})</p>
            </div>
            <div v-else-if="voucher.benefitType === 'fixed'">
              <p class="text-gray-600">₱{{ voucher.discountAmount }} off</p>
            </div>
            <div v-else-if="voucher.benefitType === 'free_item' && voucher.freeItem">
              <p class="text-gray-600">Free {{ voucher.freeItem.productId?.name }} ({{ voucher.freeItem.variantLabel }})</p>
            </div>
            <div v-else-if="voucher.benefitType === 'free_delivery'">
              <p class="text-gray-600">Free delivery</p>
            </div>

            <p class="text-gray-500 text-xs">
              {{ formatDate(voucher.startDate) }} → {{ formatDate(voucher.endDate) }}
            </p>

            <p class="text-gray-500 text-xs">
              <span v-if="voucher.usageCap">{{ voucher.usageCount }} / {{ voucher.usageCap }} used</span>
              <span v-else>{{ voucher.usageCount }} used</span>
            </p>

            <p v-if="voucher.minimumOrderAmount > 0" class="text-gray-500 text-xs">
              Min. order: ₱{{ voucher.minimumOrderAmount }}
            </p>
          </div>

          <div class="flex gap-2">
            <button
              @click="openEditVoucher(voucher)"
              class="flex-1 px-4 py-2 bg-[#1A4189] text-white font-['Poppins'] font-bold rounded-lg hover:bg-[#153066] transition text-sm"
            >Edit</button>
            <button
              @click="toggleVoucherActive(voucher)"
              class="px-4 py-2 bg-gray-200 text-gray-700 font-['Poppins'] font-bold rounded-lg hover:bg-gray-300 transition text-sm"
            >{{ voucher.isActive ? 'Deactivate' : 'Activate' }}</button>
            <button
              @click="openDeleteConfirm(voucher._id)"
              class="px-4 py-2 bg-red-500 text-white font-['Poppins'] font-bold rounded-lg hover:bg-red-600 transition text-sm"
            >Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Add/Edit Voucher Modal ── -->
    <Modal
      :is-open="showVoucherModal"
      :title="editingVoucherId ? 'Edit Voucher' : 'Add New Voucher'"
      @close="closeVoucherModal"
      @submit="saveVoucher"
    >
      <div class="space-y-4">
        <div>
          <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">Voucher Code *</label>
          <input
            v-model="voucherForm.code"
            type="text"
            @input="voucherForm.code = voucherForm.code.toUpperCase()"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] uppercase"
          />
        </div>

        <div class="flex items-center justify-between py-2 border rounded-xl px-4 bg-gray-50">
          <div>
            <p class="font-['Poppins'] font-semibold text-[#1A4189] text-sm">Active</p>
            <p class="text-xs text-gray-400 font-['Poppins'] mt-0.5">Customers can use this voucher</p>
          </div>
          <button
            type="button"
            @click="voucherForm.isActive = !voucherForm.isActive"
            :class="voucherForm.isActive ? 'bg-green-500' : 'bg-gray-300'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
          >
            <span
              :class="voucherForm.isActive ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
            />
          </button>
        </div>

        <div>
          <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">Benefit Type *</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="type in benefitTypes"
              :key="type.value"
              type="button"
              @click="voucherForm.benefitType = type.value"
              :class="voucherForm.benefitType === type.value ? 'bg-[#1A4189] text-white' : 'bg-gray-100 text-gray-700'"
              class="px-4 py-2 rounded-lg font-['Poppins'] font-semibold text-sm transition"
            >
              {{ type.label }}
            </button>
          </div>
        </div>

        <!-- Percentage fields -->
        <div v-if="voucherForm.benefitType === 'percentage'" class="space-y-4">
          <div>
            <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">Percentage Amount (%) *</label>
            <input
              v-model.number="voucherForm.percentageAmount"
              type="number"
              min="0"
              max="100"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
            />
          </div>
          <div>
            <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">Max Discount Cap (₱) *</label>
            <input
              v-model.number="voucherForm.maxDiscountCap"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
            />
          </div>
        </div>

        <!-- Fixed fields -->
        <div v-if="voucherForm.benefitType === 'fixed'">
          <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">Discount Amount (₱) *</label>
          <input
            v-model.number="voucherForm.discountAmount"
            type="number"
            min="0"
            step="0.01"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
          />
        </div>

        <!-- ── Free Item — customer-style picker ── -->
        <div v-if="voucherForm.benefitType === 'free_item'" class="space-y-2">
          <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">Free Item *</label>

          <!-- Selected item preview -->
          <div
            v-if="voucherForm.freeItem.productId && selectedFreeProduct"
            class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <img
              :src="selectedFreeProduct.image"
              :alt="selectedFreeProduct.name"
              class="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <p class="font-['Poppins'] font-semibold text-[#1A4189] truncate">{{ selectedFreeProduct.name }}</p>
              <p class="text-xs text-gray-500 font-['Poppins'] truncate">{{ voucherForm.freeItem.variantLabel }}</p>
              <p class="text-sm font-['Poppins'] font-bold text-[#FE601C]">₱{{ voucherForm.freeItem.variantPrice.toFixed(2) }}</p>
            </div>
            <button
              type="button"
              @click="openProductPicker"
              class="flex-shrink-0 px-3 py-1.5 bg-[#1A4189] text-white text-xs font-['Poppins'] font-bold rounded-lg hover:bg-[#153066] transition"
            >
              Change
            </button>
          </div>

          <!-- Empty state picker button -->
          <button
            v-else
            type="button"
            @click="openProductPicker"
            class="w-full py-4 border-2 border-dashed border-[#1A4189] text-[#1A4189] font-['Poppins'] font-semibold rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            <span class="text-xl leading-none">+</span>
            <span>Select Free Item from Menu</span>
          </button>
        </div>

        <div>
          <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">Minimum Order Amount (₱)</label>
          <input
            v-model.number="voucherForm.minimumOrderAmount"
            type="number"
            min="0"
            step="0.01"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
          />
        </div>

        <div>
          <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">Total Usage Cap</label>
          <input
            v-model.number="voucherForm.usageCap"
            type="number"
            min="0"
            placeholder="Leave blank for unlimited"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">Start Date *</label>
            <input
              v-model="voucherForm.startDate"
              type="datetime-local"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
            />
          </div>
          <div>
            <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">End Date *</label>
            <input
              v-model="voucherForm.endDate"
              type="datetime-local"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
            />
          </div>
        </div>
      </div>
    </Modal>

    <!-- ── Delete Confirm Modal ── -->
    <ConfirmModal
      :is-open="showDeleteConfirm"
      title="Delete Voucher?"
      :message="`Are you sure you want to delete this voucher? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />

    <!-- ════════════════════════════════════════════════
         Product Picker Modal
    ════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showProductPicker"
          class="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style="background: rgba(0,0,0,0.55);"
          @click.self="showProductPicker = false"
        >
          <div class="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl" style="max-height: 80vh;">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
              <div>
                <h3 class="font-['Poppins'] font-bold text-xl text-[#1A4189]">Select Free Item</h3>
                <p class="text-xs text-gray-400 font-['Poppins'] mt-0.5">Pick a product from the menu</p>
              </div>
              <button
                @click="showProductPicker = false"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-500 text-lg font-bold"
              >×</button>
            </div>

            <!-- Product grid -->
            <div class="overflow-y-auto p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <button
                v-for="product in products"
                :key="product._id"
                type="button"
                @click="openCustomizer(product)"
                class="group flex flex-col rounded-xl border-2 border-gray-200 hover:border-[#FE601C] hover:shadow-md transition overflow-hidden text-left"
              >
                <div class="w-full h-28 overflow-hidden bg-gray-100">
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div class="p-3">
                  <p class="font-['Poppins'] font-semibold text-sm text-[#1A4189] leading-tight line-clamp-2">{{ product.name }}</p>
                  <p class="font-['Poppins'] font-bold text-[#FE601C] text-sm mt-1">₱{{ product.price.toFixed(2) }}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ════════════════════════════════════════════════
         Product Customizer Modal (customer order style)
    ════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div
          v-if="showCustomizer && customizerProduct"
          class="fixed inset-0 z-[210] flex items-end sm:items-center justify-center"
          style="background: rgba(0,0,0,0.6);"
          @click.self="closeCustomizer"
        >
          <div
            class="bg-white w-full sm:max-w-md flex flex-col shadow-2xl sm:rounded-2xl rounded-t-2xl overflow-hidden"
            style="max-height: 90vh;"
          >
            <!-- Product hero image -->
            <div class="relative flex-shrink-0">
              <img
                :src="customizerProduct.image"
                :alt="customizerProduct.name"
                class="w-full object-cover"
                style="height: 180px;"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <!-- Back button -->
              <button
                @click="closeCustomizer"
                class="absolute top-3 left-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 shadow text-gray-700 hover:bg-white transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <!-- Product name overlay -->
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <h3 class="font-['Poppins'] font-bold text-white text-xl leading-tight">{{ customizerProduct.name }}</h3>
                <p class="font-['Poppins'] font-semibold text-[#FE601C] text-base">₱{{ customizerProduct.price.toFixed(2) }}</p>
              </div>
            </div>

            <!-- Modifier groups -->
            <div class="flex-1 overflow-y-auto">
              <!-- No modifiers state -->
              <div v-if="!customizerProduct.modifierGroups || customizerProduct.modifierGroups.length === 0"
                class="flex flex-col items-center justify-center py-10 px-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7"/>
                </svg>
                <p class="font-['Poppins'] text-gray-500 text-sm">No customization needed for this item.</p>
                <p class="font-['Poppins'] text-gray-400 text-xs mt-1">It will be added as-is.</p>
              </div>

              <!-- Modifier group sections -->
              <div v-for="(mg, groupIdx) in customizerProduct.modifierGroups" :key="groupIdx" class="border-b last:border-b-0">
                <!-- Group header -->
                <div class="px-5 pt-5 pb-3 bg-gray-50 flex items-center justify-between sticky top-0 z-10">
                  <div>
                    <h4 class="font-['Poppins'] font-bold text-gray-800 text-sm">{{ mg.group?.name }}</h4>
                    <p class="text-xs font-['Poppins'] text-gray-400 mt-0.5">
                      <span v-if="mg.group?.maxSelections === 1">Choose 1</span>
                      <span v-else-if="mg.group?.maxSelections > 1">Choose up to {{ mg.group.maxSelections }}</span>
                      <span v-else>Choose any</span>
                    </p>
                  </div>
                  <span
                    :class="mg.group?.minSelections > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500'"
                    class="text-xs font-['Poppins'] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                  >
                    {{ mg.group?.minSelections > 0 ? 'Required' : 'Optional' }}
                  </span>
                </div>

                <!-- Items -->
                <div class="px-4 pb-4 space-y-2">
                  <button
                    v-for="item in mg.group?.items?.filter((i: any) => i.isAvailable)"
                    :key="item.name"
                    type="button"
                    @click="selectModifier(mg.group?.name, item, mg.group?.maxSelections === 1)"
                    :class="isModifierSelected(mg.group?.name, item.name)
                      ? 'border-[#FE601C] bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'"
                    class="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition"
                  >
                    <span class="font-['Poppins'] text-sm text-gray-800">{{ item.name }}</span>
                    <div class="flex items-center gap-3">
                      <span v-if="item.priceModifier > 0" class="text-xs font-['Poppins'] text-gray-400">
                        +₱{{ item.priceModifier.toFixed(2) }}
                      </span>
                      <span v-else-if="item.priceModifier === 0" class="text-xs font-['Poppins'] text-gray-300">
                        included
                      </span>

                      <!-- Radio (single select) -->
                      <div v-if="mg.group?.maxSelections === 1"
                        :class="isModifierSelected(mg.group?.name, item.name)
                          ? 'bg-[#FE601C] border-[#FE601C]'
                          : 'border-gray-300 bg-white'"
                        class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition"
                      >
                        <div v-if="isModifierSelected(mg.group?.name, item.name)" class="w-2.5 h-2.5 rounded-full bg-white" />
                      </div>

                      <!-- Checkbox (multi select) -->
                      <div v-else
                        :class="isModifierSelected(mg.group?.name, item.name)
                          ? 'bg-[#FE601C] border-[#FE601C]'
                          : 'border-gray-300 bg-white'"
                        class="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition"
                      >
                        <svg v-if="isModifierSelected(mg.group?.name, item.name)" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Sticky footer: total + confirm -->
            <div class="px-5 py-4 border-t bg-white flex-shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
              <div class="flex items-center justify-between mb-3">
                <span class="font-['Poppins'] text-gray-500 text-sm">Item Total</span>
                <span class="font-['Poppins'] font-bold text-[#1A4189] text-lg">₱{{ customizerTotal.toFixed(2) }}</span>
              </div>
              <button
                type="button"
                @click="confirmFreeItem"
                class="w-full py-3 bg-[#FE601C] text-white font-['Poppins'] font-bold rounded-xl hover:bg-[#e5551a] transition text-base"
              >
                Set as Free Item
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import Modal from '~/components/admin/Modal.vue'
import ConfirmModal from '~/components/admin/ConfirmModal.vue'

definePageMeta({ layout: 'admin' })

const {
  getVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher: apiDeleteVoucher,
  toggleVoucher,
  getAllProductsAdmin,
} = useApi()

// ── State ──────────────────────────────────────────
const vouchers = ref<any[]>([])
const products = ref<any[]>([])
const showVoucherModal = ref(false)
const editingVoucherId = ref<string | null>(null)
const showDeleteConfirm = ref(false)
const deletingVoucherId = ref<string | null>(null)

// Product picker + customizer state
const showProductPicker = ref(false)
const showCustomizer = ref(false)
const customizerProduct = ref<any>(null)
/** groupName → selected items */
const customizerSelections = ref<Record<string, { name: string; priceModifier: number }[]>>({})

const benefitTypes = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed', label: 'Fixed Off' },
  { value: 'free_item', label: 'Free Item' },
  { value: 'free_delivery', label: 'Free Delivery' },
]

const voucherForm = ref<any>({
  code: '',
  isActive: true,
  benefitType: 'percentage',
  percentageAmount: 0,
  maxDiscountCap: 0,
  discountAmount: 0,
  freeItem: { productId: '', variantLabel: '', variantPrice: 0 },
  minimumOrderAmount: 0,
  usageCap: null,
  startDate: '',
  endDate: '',
})

// ── Computed ───────────────────────────────────────
/** The full product object for the currently chosen free item */
const selectedFreeProduct = computed(() =>
  products.value.find((p) => p._id === voucherForm.value.freeItem.productId) ?? null,
)

/** Running total in the customizer (base price + selected modifier prices) */
const customizerTotal = computed(() => {
  if (!customizerProduct.value) return 0
  const modTotal = Object.values(customizerSelections.value)
    .flat()
    .reduce((sum, item) => sum + (item.priceModifier || 0), 0)
  return (customizerProduct.value.price || 0) + modTotal
})

// ── Helpers ────────────────────────────────────────
const toDatetimeLocal = (isoString: string | Date): string => {
  if (!isoString) return ''
  const d = new Date(isoString)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const isModifierSelected = (groupName: string, itemName: string): boolean => {
  return customizerSelections.value[groupName]?.some((i) => i.name === itemName) ?? false
}

// ── Product picker / customizer ────────────────────
const openProductPicker = () => {
  showProductPicker.value = true
}

const openCustomizer = (product: any) => {
  customizerProduct.value = product
  customizerSelections.value = {}

  // Pre-select the first available option for every required single-select group
  if (product.modifierGroups?.length) {
    product.modifierGroups.forEach((mg: any) => {
      const group = mg.group
      if (!group) return
      if (group.minSelections > 0 && group.maxSelections === 1) {
        const first = group.items?.find((i: any) => i.isAvailable)
        if (first) {
          customizerSelections.value[group.name] = [
            { name: first.name, priceModifier: first.priceModifier || 0 },
          ]
        }
      }
    })
  }

  showProductPicker.value = false
  showCustomizer.value = true
}

const closeCustomizer = () => {
  showCustomizer.value = false
  // Go back to product picker so admin can choose a different product
  showProductPicker.value = true
}

const selectModifier = (
  groupName: string,
  item: { name: string; priceModifier: number },
  singleSelect: boolean,
) => {
  if (singleSelect) {
    // Radio: replace selection
    customizerSelections.value[groupName] = [
      { name: item.name, priceModifier: item.priceModifier || 0 },
    ]
  } else {
    // Checkbox: toggle
    const current = customizerSelections.value[groupName] ?? []
    const idx = current.findIndex((i) => i.name === item.name)
    if (idx >= 0) {
      customizerSelections.value[groupName] = current.filter((i) => i.name !== item.name)
    } else {
      customizerSelections.value[groupName] = [
        ...current,
        { name: item.name, priceModifier: item.priceModifier || 0 },
      ]
    }
  }
}

const confirmFreeItem = () => {
  const product = customizerProduct.value
  if (!product) return

  // Validate required groups
  for (const mg of product.modifierGroups ?? []) {
    const group = mg.group
    if (!group || group.minSelections <= 0) continue
    const selected = customizerSelections.value[group.name] ?? []
    if (selected.length < group.minSelections) {
      alert(`Please select at least ${group.minSelections} option(s) for "${group.name}"`)
      return
    }
  }

  // Build label from all selected modifiers
  const allSelected = Object.values(customizerSelections.value).flat()
  const variantLabel =
    allSelected.length > 0 ? allSelected.map((i) => i.name).join(' + ') : 'Original'

  voucherForm.value.freeItem = {
    productId: product._id,
    variantLabel,
    variantPrice: customizerTotal.value,
  }

  showCustomizer.value = false
}

// ── Data loading ───────────────────────────────────
const loadVouchers = async () => {
  const res = await getVouchers()
  vouchers.value = res.data
}

const loadProducts = async () => {
  try {
    const response = await getAllProductsAdmin()
    products.value = response.data.filter((p: any) => p.isAvailable)
  } catch (error) {
    console.error('Failed to load products:', error)
  }
}

// ── Modal open/close ───────────────────────────────
const openAddVoucher = () => {
  editingVoucherId.value = null
  voucherForm.value = {
    code: '',
    isActive: true,
    benefitType: 'percentage',
    percentageAmount: 0,
    maxDiscountCap: 0,
    discountAmount: 0,
    freeItem: { productId: '', variantLabel: '', variantPrice: 0 },
    minimumOrderAmount: 0,
    usageCap: null,
    startDate: '',
    endDate: '',
  }
  showVoucherModal.value = true
}

const openEditVoucher = (voucher: any) => {
  editingVoucherId.value = voucher._id
  voucherForm.value = {
    code: voucher.code,
    isActive: voucher.isActive,
    benefitType: voucher.benefitType,
    percentageAmount: voucher.percentageAmount || 0,
    maxDiscountCap: voucher.maxDiscountCap || 0,
    discountAmount: voucher.discountAmount || 0,
    freeItem: voucher.freeItem
      ? {
          productId: voucher.freeItem.productId?._id || voucher.freeItem.productId,
          variantLabel: voucher.freeItem.variantLabel,
          variantPrice: voucher.freeItem.variantPrice,
        }
      : { productId: '', variantLabel: '', variantPrice: 0 },
    minimumOrderAmount: voucher.minimumOrderAmount || 0,
    usageCap: voucher.usageCap,
    startDate: toDatetimeLocal(voucher.startDate),
    endDate: toDatetimeLocal(voucher.endDate),
  }
  showVoucherModal.value = true
}

const closeVoucherModal = () => {
  showVoucherModal.value = false
  editingVoucherId.value = null
}

// ── CRUD ───────────────────────────────────────────
const saveVoucher = async () => {
  try {
    if (editingVoucherId.value) {
      await updateVoucher(editingVoucherId.value, voucherForm.value)
    } else {
      await createVoucher(voucherForm.value)
    }
    closeVoucherModal()
    await loadVouchers()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to save voucher')
  }
}

const toggleVoucherActive = async (voucher: any) => {
  try {
    await toggleVoucher(voucher._id)
    await loadVouchers()
  } catch {
    alert('Failed to toggle voucher status')
  }
}

const openDeleteConfirm = (id: string) => {
  deletingVoucherId.value = id
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  try {
    await apiDeleteVoucher(deletingVoucherId.value!)
    showDeleteConfirm.value = false
    await loadVouchers()
  } catch {
    alert('Failed to delete voucher')
  }
}

// ── Display helpers ────────────────────────────────
const getBenefitTypeLabel = (type: string) =>
  ({ percentage: 'Percentage', fixed: 'Fixed Off', free_item: 'Free Item', free_delivery: 'Free Delivery' }[type] ?? type)

const getBenefitTypeColor = (type: string) =>
  ({
    percentage: 'bg-blue-100 text-blue-700',
    fixed: 'bg-green-100 text-green-700',
    free_item: 'bg-purple-100 text-purple-700',
    free_delivery: 'bg-teal-100 text-teal-700',
  }[type] ?? 'bg-gray-100 text-gray-700')

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

// ── Lifecycle ──────────────────────────────────────
onMounted(() => {
  loadVouchers()
  loadProducts()
})
</script>

<style scoped>
/* Picker fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Customizer slide-up on mobile */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(40px);
}

/* Clamp long product names */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>