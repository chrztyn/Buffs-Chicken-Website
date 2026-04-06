<template>
  <template v-if="saucesEnabled && sauceGroups.length > 0">
    <div
      v-for="sauceGroup in sauceGroups"
      :key="sauceGroup.name"
    >
      <!-- Section header -->
      <div class="px-4 sm:px-5 pt-4 pb-1">
        <div class="flex items-center gap-2 flex-wrap">
          <span
            class="font-bold text-gray-800 text-sm sm:text-base"
            style="font-family: 'Unbounded', sans-serif;"
          >
            Choose your {{ sauceGroup.name.toLowerCase() }}
          </span>
          <span class="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">
            Optional
          </span>
        </div>
        <p
          v-if="effectiveMax(sauceGroup.name) > 1"
          class="text-xs text-gray-400 mt-0.5"
          style="font-family: 'Unbounded', sans-serif;"
        >
          Pick up to {{ effectiveMax(sauceGroup.name) }}
        </p>
        <transition name="slide-down">
          <p
            v-if="
              (selectedSauces[sauceGroup.name] || []).length >= effectiveMax(sauceGroup.name)
                && effectiveMax(sauceGroup.name) > 0
            "
            class="text-xs text-[#FE601C] font-medium mt-0.5"
            style="font-family: 'Unbounded', sans-serif;"
          >
            Maximum {{ effectiveMax(sauceGroup.name) }} {{ sauceGroup.name.toLowerCase() }} selected
          </p>
        </transition>
      </div>

      <!-- Options -->
      <div class="px-4 sm:px-5 pb-3 pt-2 flex flex-col gap-2">
        <label
          v-for="option in sauceGroup.options.filter(o => o.isAvailable !== false)"
          :key="option.name"
          class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 min-h-[48px]"
          :class="[
            (selectedSauces[sauceGroup.name] || []).includes(option.name)
              ? 'bg-orange-50 border-[#FE601C]'
              : 'bg-white border-gray-200 hover:border-gray-300',
            isSauceDisabled(sauceGroup.name, option.name, effectiveMax(sauceGroup.name))
              ? 'opacity-40 cursor-not-allowed'
              : '',
          ]"
        >
          <input
            type="checkbox"
            :checked="(selectedSauces[sauceGroup.name] || []).includes(option.name)"
            :disabled="isSauceDisabled(sauceGroup.name, option.name, effectiveMax(sauceGroup.name))"
            @change="$emit('sauce-change', sauceGroup.name, option.name)"
            class="w-5 h-5 rounded flex-shrink-0"
            style="accent-color: #FE601C;"
          />
          <span
            class="flex-1 text-sm sm:text-base text-gray-800 font-medium"
            style="font-family: 'Unbounded', sans-serif;"
          >
            {{ option.name }}
          </span>
          <span
            v-if="option.price && option.price > 0"
            class="text-xs sm:text-sm text-[#FE601C] font-semibold whitespace-nowrap"
            style="font-family: 'Unbounded', sans-serif;"
          >
            +&#x20B1;{{ Number(option.price).toFixed(2) }}
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
import type { SauceGroup } from '~/composables/useMenuModal'

defineProps<{
  sauceGroups: SauceGroup[]
  saucesEnabled: boolean
  selectedSauces: Record<string, string[]>
  effectiveSauceMaxes: Record<string, number>
  isSauceDisabled: (groupName: string, optionName: string, maxSelections: number) => boolean
}>()

defineEmits<{
  'sauce-change': [groupName: string, optionName: string]
}>()

function effectiveMax(groupName: string): number {
  // Use the computed effective max from parent, fallback to 1 if not available
  return effectiveSauceMaxes[groupName] ?? 1
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
