<template>
  <template v-if="addonsEnabled && addons.length > 0">
    <div>
      <!-- Section header -->
      <div class="px-4 sm:px-5 pt-4 pb-1">
        <div class="flex items-center gap-2 flex-wrap">
          <span
            class="font-bold text-gray-800 text-sm sm:text-base"
            style="font-family: 'Unbounded', sans-serif;"
          >
            {{ title ?? 'Add extras' }}
          </span>
          <!-- Required badge -->
          <span
            v-if="minSelections && minSelections > 0"
            class="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium"
          >
            Required
          </span>
          <span
            v-else
            class="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium"
          >
            Optional
          </span>
        </div>
        <!-- Hint: pick up to X -->
        <p
          v-if="maxSelections && maxSelections > 1"
          class="text-xs text-gray-400 mt-0.5"
          style="font-family: 'Unbounded', sans-serif;"
        >
          Pick up to {{ maxSelections }}
        </p>
        <!-- Max reached message -->
        <transition name="slide-down">
          <p
            v-if="maxSelections && maxSelections > 1 && selectedAddons.length >= maxSelections"
            class="text-xs text-[#FE601C] font-medium mt-0.5"
            style="font-family: 'Unbounded', sans-serif;"
          >
            Maximum {{ maxSelections }} selected
          </p>
        </transition>
      </div>

      <!-- Options -->
      <div class="px-4 sm:px-5 pb-3 pt-2 flex flex-col gap-2">
        <label
          v-for="addon in addons"
          :key="addon.name"
          class="flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 min-h-[48px]"
          :class="[
            selectedAddons.includes(addon.name)
              ? 'bg-orange-50 border-[#FE601C]'
              : 'bg-white border-gray-200 hover:border-gray-300',
            isItemDisabled(addon.name) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
          ]"
        >
          <!-- Radio for single-select, checkbox for multi -->
          <input
            v-if="maxSelections === 1"
            type="radio"
            :name="`modifier-${title}`"
            :value="addon.name"
            :checked="selectedAddons.includes(addon.name)"
            @change="$emit('addon-change', addon.name)"
            class="w-5 h-5 flex-shrink-0"
            style="accent-color: #FE601C;"
          />
          <input
            v-else
            type="checkbox"
            :value="addon.name"
            :checked="selectedAddons.includes(addon.name)"
            :disabled="isItemDisabled(addon.name)"
            @change="$emit('addon-change', addon.name)"
            class="w-5 h-5 rounded flex-shrink-0"
            style="accent-color: #FE601C;"
          />
          <span
            class="flex-1 text-sm sm:text-base text-gray-800 font-medium"
            style="font-family: 'Unbounded', sans-serif;"
          >
            {{ addon.name }}
          </span>
          <span
            v-if="addon.price > 0"
            class="text-xs sm:text-sm text-[#FE601C] font-semibold whitespace-nowrap"
            style="font-family: 'Unbounded', sans-serif;"
          >
            +&#x20B1;{{ Number(addon.price).toFixed(2) }}
          </span>
          <span
            v-else
            class="text-xs text-gray-400 whitespace-nowrap"
            style="font-family: 'Unbounded', sans-serif;"
          >
            Free
          </span>
        </label>
      </div>

      <div class="h-px bg-gray-200 mx-4 sm:mx-5" />
    </div>
  </template>
</template>

<script setup lang="ts">
import type { Addon } from '~/composables/useMenuModal'

const props = defineProps<{
  addons: Addon[]
  addonsEnabled: boolean
  selectedAddons: string[]
  title?: string
  minSelections?: number  // 0 = optional, 1+ = required
  maxSelections?: number  // 0 = unlimited, 1 = radio/single-select
}>()

defineEmits<{
  'addon-change': [addonName: string]
}>()

function isItemDisabled(itemName: string): boolean {
  const max = props.maxSelections ?? 0
  if (max === 0 || max === 1) return false
  if (props.selectedAddons.includes(itemName)) return false
  return props.selectedAddons.length >= max
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
