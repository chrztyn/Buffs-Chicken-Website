<template>
  <template v-if="variantsEnabled && variants.length > 0">
    <div
      v-for="variantGroup in variants"
      :key="variantGroup.name"
    >
      <!-- Section header -->
      <div class="px-4 sm:px-5 pt-4 pb-2">
        <div class="flex items-center gap-2 flex-wrap">
          <span
            class="font-bold text-gray-800 text-sm sm:text-base"
            style="font-family: 'Unbounded', sans-serif;"
          >
            Select {{ variantGroup.name }}
          </span>
          <span class="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
            Required
          </span>
        </div>
      </div>

      <!-- Options -->
      <div class="px-4 sm:px-5 pb-2 flex flex-col gap-2">
        <label
          v-for="option in variantGroup.options.filter(o => o.isAvailable !== false)"
          :key="option.name"
          class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 min-h-[48px]"
          :class="
            selectedVariants[variantGroup.name] === option.name
              ? 'bg-orange-50 border-[#FE601C]'
              : 'bg-white border-gray-200 hover:border-gray-300'
          "
        >
          <input
            type="radio"
            :name="`variant-${variantGroup.name}`"
            :value="option.name"
            :checked="selectedVariants[variantGroup.name] === option.name"
            @change="$emit('variant-change', variantGroup.name, option.name)"
            class="w-5 h-5 flex-shrink-0"
            style="accent-color: #FE601C;"
          />
          <span
            class="flex-1 text-sm sm:text-base text-gray-800 font-medium"
            style="font-family: 'Unbounded', sans-serif;"
          >
            {{ option.name }}
          </span>
          <span
            v-if="option.priceModifier && option.priceModifier > 0"
            class="text-xs sm:text-sm text-[#FE601C] font-semibold whitespace-nowrap"
            style="font-family: 'Unbounded', sans-serif;"
          >
            +&#x20B1;{{ Number(option.priceModifier).toFixed(2) }}
          </span>
        </label>
      </div>

      <!-- Validation error -->
      <transition name="slide-down">
        <p
          v-if="validationError === variantGroup.name"
          class="mx-4 sm:mx-5 mb-2 text-xs text-red-600 font-medium"
          style="font-family: 'Unbounded', sans-serif;"
        >
          Please select a {{ variantGroup.name.toLowerCase() }} to continue
        </p>
      </transition>

      <div class="h-px bg-gray-200 mx-4 sm:mx-5 mb-3" />
    </div>
  </template>
</template>

<script setup lang="ts">
import type { VariantGroup } from '~/composables/useMenuModal'

defineProps<{
  variants: VariantGroup[]
  variantsEnabled: boolean
  selectedVariants: Record<string, string>
  validationError: string
}>()

defineEmits<{
  'variant-change': [variantName: string, optionName: string]
}>()
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
