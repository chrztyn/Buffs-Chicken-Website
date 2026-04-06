<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen && product"
        class="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60" @click="handleClose" />

        <!-- Modal panel — slides up on mobile, scales in on desktop -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="translate-y-full md:translate-y-0 md:scale-95 md:opacity-0"
          enter-to-class="translate-y-0 md:scale-100 md:opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="translate-y-0 md:scale-100 md:opacity-100"
          leave-to-class="translate-y-full md:translate-y-0 md:scale-95 md:opacity-0"
        >
          <div
            v-if="isOpen && product"
            class="relative w-full md:max-w-lg md:mx-4 bg-white rounded-t-2xl md:rounded-2xl flex flex-col overflow-hidden"
            style="max-height: min(100dvh, 90vh)"
            :style="dragStyle"
          >
            <!-- Swipe-to-dismiss handle (mobile only) -->
            <div
              class="md:hidden flex-shrink-0 pt-3 pb-1"
              @touchstart.passive="onDragStart"
              @touchmove="onDragMove"
              @touchend="onDragEnd"
            >
              <div class="flex justify-center">
                <div class="w-10 h-1 bg-gray-300 rounded-full cursor-grab active:cursor-grabbing"></div>
              </div>
            </div>

            <!-- Close button -->
            <button
              @click="handleClose"
              class="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 text-gray-500 hover:bg-gray-100 transition shadow-sm"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Scrollable body -->
            <div class="overflow-y-auto flex-1 pb-28 overscroll-contain">
              <MenuModalHeader :item="product" />

              <div class="space-y-0 pb-2">
                <!-- ── New modifier-group system ───────────────────────── -->
                <template v-if="hasModifierGroups">
                  <MenuModalAddons
                    v-for="group in modifierGroupsForDisplay"
                    :key="group.groupName"
                    :title="group.groupName"
                    :addons="group.items"
                    :addons-enabled="true"
                    :selected-addons="selectedModifiers[group.groupName] || []"
                    :min-selections="group.minSelections"
                    :max-selections="group.maxSelections"
                    @addon-change="handleModifierChange(group.groupName, $event)"
                  />
                </template>

                <!-- ── Legacy variants / sauces / addons system ──────────── -->
                <template v-else>
                  <MenuModalVariants
                    :variants="availableVariants"
                    :variants-enabled="product.variantsEnabled !== false"
                    :selected-variants="selectedVariants"
                    :validation-error="variantValidationError"
                    @variant-change="handleVariantChange"
                  />

                  <MenuModalSauces
                    :sauce-groups="availableSauceGroups"
                    :sauces-enabled="product.saucesEnabled !== false"
                    :selected-sauces="selectedSauces"
                    :effective-sauce-maxes="effectiveSauceMaxes"
                    :is-sauce-disabled="isSauceDisabled"
                    @sauce-change="handleSauceChange"
                  />

                  <MenuModalAddons
                    :addons="availableAddons"
                    :addons-enabled="product.addonsEnabled !== false"
                    :selected-addons="selectedAddons"
                    @addon-change="handleAddonChange"
                  />
                </template>

                <!-- Notes always visible ─────────────────────────────────── -->
                <MenuModalNotes
                  :notes="notes"
                  @update:notes="notes = $event"
                />
              </div>
            </div>

            <!-- Sticky footer -->
            <MenuModalFooter
              :quantity="quantity"
              :total="totalPrice"
              :is-disabled="isVariantRequired || isModifierGroupRequired"
              @update:quantity="quantity = $event"
              @add-to-cart="handleAddToCartClick"
            />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import MenuModalHeader from '~/components/menu/MenuModalHeader.vue'
import MenuModalVariants from '~/components/menu/MenuModalVariants.vue'
import MenuModalSauces from '~/components/menu/MenuModalSauces.vue'
import MenuModalAddons from '~/components/menu/MenuModalAddons.vue'
import MenuModalNotes from '~/components/menu/MenuModalNotes.vue'
import MenuModalFooter from '~/components/menu/MenuModalFooter.vue'
import { useMenuModal } from '~/composables/useMenuModal'
import type { Product } from '~/composables/useMenuModal'

const props = defineProps<{
  product: Product | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  added: []
}>()

const productRef = computed(() => props.product) as unknown as Ref<Product>

// ── Cart-write + close handler ────────────────────────────────────────────────
function handleComposableEmit(event: string, ...args: unknown[]) {
  if (event === 'add-to-cart') {
    const newItem = args[0] as Record<string, unknown>
    const cart: Record<string, unknown>[] = JSON.parse(localStorage.getItem('buffs_cart') || '[]')

    const makeKey = (item: Record<string, unknown>) =>
      JSON.stringify({
        _id: item._id,
        selectedVariants: item.selectedVariants,
        selectedSauces: item.selectedSauces,
        selectedAddons: item.selectedAddons,
        selectedModifiers: item.selectedModifiers,
      })

    const newKey = makeKey(newItem)
    const existing = cart.find((i) => makeKey(i) === newKey)

    if (existing) {
      existing.quantity = (existing.quantity as number) + (newItem.quantity as number)
    } else {
      cart.push(newItem)
    }

    localStorage.setItem('buffs_cart', JSON.stringify(cart))
    if (process.client) window.dispatchEvent(new Event('cart-updated'))
    emit('added')
  } else if (event === 'close') {
    emit('close')
  }
}

const {
  quantity,
  notes,
  selectedVariants,
  selectedAddons,
  selectedSauces,
  selectedModifiers,
  variantValidationError,
  availableVariants,
  availableSauceGroups,
  availableAddons,
  isVariantRequired,
  isModifierGroupRequired,
  totalPrice,
  isSauceDisabled,
  hasModifierGroups,
  enabledModifierGroups,
  handleVariantChange,
  handleSauceChange,
  handleModifierChange,
  addToCart,
  resetModal,
  effectiveSauceMaxes,
  getEffectiveMaxForModifierGroup,  // ← used below for dynamic sauce limits
} = useMenuModal(productRef, handleComposableEmit)

// ── Modifier groups for display ───────────────────────────────────────────────
// maxSelections is dynamic: for non-variant groups it checks variantSauceLimits
// on the product so the sauce cap updates whenever the customer picks a variant.
const modifierGroupsForDisplay = computed(() =>
  enabledModifierGroups.value.map(mg => ({
    groupName: mg.group.name,
    minSelections: mg.group.minSelections ?? 0,
    maxSelections: getEffectiveMaxForModifierGroup(mg.group.name), // ← dynamic
    items: mg.group.items
      .filter(item => item.isAvailable !== false)
      .map(item => ({
        _id: item._id,
        name: item.name,
        price: item.priceModifier ?? 0,
        isAvailable: true as const,
      })),
  }))
)

function handleAddonChange(addonName: string) {
  const idx = selectedAddons.value.indexOf(addonName)
  if (idx > -1) {
    selectedAddons.value.splice(idx, 1)
  } else {
    selectedAddons.value.push(addonName)
  }
}

function handleClose() {
  resetModal()
  emit('close')
}

// ── Swipe-to-dismiss (mobile only) ───────────────────────────────────────────
const dragY = ref(0)
const dragStartY = ref(0)
const isDragging = ref(false)

const dragStyle = computed(() => {
  if (dragY.value <= 0) return {}
  return {
    transform: `translateY(${dragY.value}px)`,
    transition: isDragging.value ? 'none' : 'transform 0.3s ease'
  }
})

const onDragStart = (e: TouchEvent) => {
  dragStartY.value = e.touches[0]?.clientY ?? 0
  dragY.value = 0
  isDragging.value = true
}

const onDragMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  e.preventDefault()
  const delta = (e.touches[0]?.clientY ?? dragStartY.value) - dragStartY.value
  dragY.value = Math.max(0, delta)
}

const onDragEnd = () => {
  isDragging.value = false
  if (dragY.value > 80) {
    dragY.value = window.innerHeight
    setTimeout(() => {
      handleClose()
      dragY.value = 0
    }, 300)
  } else {
    dragY.value = 0
  }
}

function handleAddToCartClick() {
  addToCart(isVariantRequired.value)
}
</script>