import { ref, computed, type Ref } from 'vue'

// ── Type definitions ─────────────────────────────────────────────────────────

export interface ModifierItem {
  _id?: string
  name: string
  priceModifier?: number
  isAvailable?: boolean
}

export interface ModifierGroup {
  _id?: string
  name: string
  type?: string
  minSelections?: number
  maxSelections?: number
  items: ModifierItem[]
}

export interface ModifierGroupRef {
  group: ModifierGroup
  enabled?: boolean
}

export interface VariantOption {
  _id?: string
  name: string
  priceModifier?: number
  isAvailable?: boolean
}

export interface VariantGroup {
  name: string
  options: VariantOption[]
}

export interface SauceOption {
  _id?: string
  name: string
  price?: number
  isAvailable?: boolean
}

export interface VariantLimit {
  variantName: string
  maxSelections: number
}

export interface SauceGroup {
  name: string
  maxSelections: number
  options: SauceOption[]
  variantLimits?: VariantLimit[]
}

export interface Addon {
  _id?: string
  name: string
  price: number
  isAvailable?: boolean
}

// Per-variant sauce limit for the new modifier group system
export interface VariantSauceLimit {
  variantName: string  // matches a modifier item name in the variant group
  maxSauces: number
}

export interface Product {
  _id?: string
  name: string
  price: number
  image?: string
  description?: string
  category?: string
  variantsEnabled?: boolean
  saucesEnabled?: boolean
  addonsEnabled?: boolean
  variants?: VariantGroup[]
  sauces?: SauceGroup[]
  addons?: Addon[]
  modifierGroups?: ModifierGroupRef[]
  variantSauceLimits?: VariantSauceLimit[]  // new modifier group system sauce limits
  [key: string]: unknown
}

// ── Composable ────────────────────────────────────────────────────────────────

export function useMenuModal(
  product: Ref<Product>,
  emit: (event: string, ...args: unknown[]) => void,
) {
  const quantity = ref(1)
  const notes = ref('')
  const selectedVariants = ref<Record<string, string>>({})
  const selectedAddons = ref<string[]>([])
  const selectedSauces = ref<Record<string, string[]>>({})
  const selectedModifiers = ref<Record<string, string[]>>({})
  const variantValidationError = ref('')

  // ── Computed ────────────────────────────────────────────────────────────────

  const hasModifierGroups = computed(() => {
    const mgs = product.value.modifierGroups
    return Array.isArray(mgs) && mgs.some(mg => mg?.group && typeof mg.group === 'object')
  })

  const enabledModifierGroups = computed<ModifierGroupRef[]>(() => {
    if (!hasModifierGroups.value) return []
    return (product.value.modifierGroups || []).filter(mg => mg.enabled !== false)
  })

  const availableVariants = computed<VariantGroup[]>(() => {
    return (product.value.variants || []).filter(
      vg => vg.options && vg.options.some(o => o.isAvailable !== false),
    )
  })

  const availableSauceGroups = computed<SauceGroup[]>(() => {
    return (product.value.sauces || []).filter(
      sg => sg.options && sg.options.some(o => o.isAvailable !== false),
    )
  })

  const availableAddons = computed<Addon[]>(() => {
    return (product.value.addons || []).filter(a => a.isAvailable !== false)
  })

  const isVariantRequired = computed(() => {
    if (hasModifierGroups.value) return false
    if (product.value.variantsEnabled === false) return false
    for (const vg of availableVariants.value) {
      if (!selectedVariants.value[vg.name]) return true
    }
    return false
  })

  const basePrice = computed(() => {
    if (hasModifierGroups.value) return product.value.price
    for (const vg of availableVariants.value) {
      const selected = selectedVariants.value[vg.name]
      if (selected) {
        const opt = vg.options.find(o => o.name === selected)
        if (opt && opt.priceModifier !== undefined && opt.priceModifier > 0) {
          return opt.priceModifier
        }
      }
    }
    return product.value.price
  })

  const addonsCost = computed(() => {
    let cost = 0
    if (hasModifierGroups.value) {
      for (const mg of enabledModifierGroups.value) {
        const selected = selectedModifiers.value[mg.group.name] || []
        mg.group.items.forEach(item => {
          if (selected.includes(item.name)) cost += item.priceModifier || 0
        })
      }
      return cost
    }
    if (product.value.addonsEnabled !== false) {
      product.value.addons?.forEach(addon => {
        if (selectedAddons.value.includes(addon.name) && addon.isAvailable !== false) {
          cost += addon.price || 0
        }
      })
    }
    if (product.value.saucesEnabled !== false) {
      ;(product.value.sauces || []).forEach(sauceGroup => {
        const selected = selectedSauces.value[sauceGroup.name] || []
        sauceGroup.options.forEach(opt => {
          if (selected.includes(opt.name) && (opt.price || 0) > 0) cost += opt.price || 0
        })
      })
    }
    return cost
  })

  const totalPrice = computed(() => (basePrice.value + addonsCost.value) * quantity.value)

  const isModifierGroupRequired = computed(() => {
    if (!hasModifierGroups.value) return false
    for (const mg of enabledModifierGroups.value) {
      const minSel = mg.group.minSelections ?? 0
      if (minSel > 0) {
        const selected = selectedModifiers.value[mg.group.name] || []
        if (selected.length < minSel) return true
      }
    }
    return false
  })

  // ── New modifier group system: variant sauce limit logic ─────────────────────

  /**
   * The currently selected variant option name in the new modifier group system.
   * Looks for the first group that is a single-select variant (min=1, max=1).
   */
  const selectedVariantNameInModifiers = computed<string | null>(() => {
    for (const mg of enabledModifierGroups.value) {
      if (mg.group.minSelections === 1 && mg.group.maxSelections === 1) {
        const selected = selectedModifiers.value[mg.group.name]
        if (selected && selected.length > 0) return selected[0] ?? null
      }
    }
    return null
  })

  /**
   * Get the effective max selections for a modifier group in the new system,
   * accounting for per-variant sauce limits stored on the product.
   *
   * - Variant groups themselves (min=1, max=1) are never affected.
   * - All other groups (sauce, extras, etc.) look up variantSauceLimits on the
   *   product to find if the currently selected variant overrides the global max.
   */
  function getEffectiveMaxForModifierGroup(groupName: string): number {
    const mg = enabledModifierGroups.value.find(m => m.group.name === groupName)
    if (!mg) return 0
    const globalMax = mg.group.maxSelections ?? 0

    // Variant groups are not affected by sauce limits
    if (mg.group.minSelections === 1 && mg.group.maxSelections === 1) return globalMax

    // Look up variantSauceLimits on the product
    const limits = product.value.variantSauceLimits
    if (!limits || limits.length === 0) return globalMax

    const selectedVariant = selectedVariantNameInModifiers.value
    if (!selectedVariant) return globalMax

    const entry = limits.find(v => v.variantName === selectedVariant)
    return entry ? entry.maxSauces : globalMax
  }

  /**
   * After a variant is selected, trim any sauce/modifier selections that now
   * exceed the new effective limit.
   */
  function trimExcessModifierSelections() {
    for (const mg of enabledModifierGroups.value) {
      // Skip variant groups
      if (mg.group.minSelections === 1 && mg.group.maxSelections === 1) continue
      const effectiveMax = getEffectiveMaxForModifierGroup(mg.group.name)
      if (effectiveMax > 0) {
        const current = selectedModifiers.value[mg.group.name] || []
        if (current.length > effectiveMax) {
          selectedModifiers.value[mg.group.name] = current.slice(0, effectiveMax)
        }
      }
    }
  }

  // ── Legacy sauce system ───────────────────────────────────────────────────────

  const effectiveSauceMaxes = computed<Record<string, number>>(() => {
    const result: Record<string, number> = {}
    for (const sg of availableSauceGroups.value) {
      result[sg.name] = getEffectiveMaxSauces(sg.name)
    }
    return result
  })

  function getEffectiveMaxSauces(groupName: string): number {
    const sauceGroup = availableSauceGroups.value.find(sg => sg.name === groupName)
    if (!sauceGroup) return 0

    if (!sauceGroup.variantLimits || sauceGroup.variantLimits.length === 0) {
      return sauceGroup.maxSelections
    }

    for (const vg of availableVariants.value) {
      const selectedVariant = selectedVariants.value[vg.name]
      if (!selectedVariant) continue
      const variantLimit = sauceGroup.variantLimits.find(vl => vl.variantName === selectedVariant)
      if (variantLimit) return variantLimit.maxSelections
    }

    return sauceGroup.maxSelections
  }

  function isSauceDisabled(groupName: string, optionName: string, _maxSelections: number): boolean {
    const effectiveMax = getEffectiveMaxSauces(groupName)
    const current = selectedSauces.value[groupName] || []
    if (current.includes(optionName)) return false
    return current.length >= effectiveMax
  }

  // ── Methods ───────────────────────────────────────────────────────────────────

  function handleModifierChange(groupName: string, optionName: string) {
    const mg = enabledModifierGroups.value.find(m => m.group.name === groupName)
    const maxSel = mg?.group.maxSelections ?? 0
    if (!selectedModifiers.value[groupName]) selectedModifiers.value[groupName] = []

    if (maxSel === 1) {
      // Single-select (variant) — replace selection
      selectedModifiers.value[groupName] = [optionName]
      // If this is a variant group (min=1, max=1), trim sauce selections after update
      if (mg?.group.minSelections === 1) {
        setTimeout(() => trimExcessModifierSelections(), 0)
      }
    } else {
      // Multi-select — respect effective max
      const effectiveMax = getEffectiveMaxForModifierGroup(groupName)
      const idx = selectedModifiers.value[groupName].indexOf(optionName)
      if (idx > -1) {
        selectedModifiers.value[groupName].splice(idx, 1)
      } else {
        if (effectiveMax > 0 && selectedModifiers.value[groupName].length >= effectiveMax) return
        selectedModifiers.value[groupName].push(optionName)
      }
    }
  }

  function isModifierDisabled(groupName: string, optionName: string): boolean {
    const mg = enabledModifierGroups.value.find(m => m.group.name === groupName)
    const maxSel = mg?.group.maxSelections ?? 0
    if (maxSel === 0 || maxSel === 1) return false
    const effectiveMax = getEffectiveMaxForModifierGroup(groupName)
    const current = selectedModifiers.value[groupName] || []
    if (current.includes(optionName)) return false
    return effectiveMax > 0 && current.length >= effectiveMax
  }

  function handleVariantChange(variantName: string, optionName: string) {
    selectedVariants.value = { ...selectedVariants.value, [variantName]: optionName }
    if (variantValidationError.value === variantName) {
      variantValidationError.value = ''
    }
  }

  function handleSauceChange(groupName: string, optionName: string) {
    if (!selectedSauces.value[groupName]) selectedSauces.value[groupName] = []
    const index = selectedSauces.value[groupName].indexOf(optionName)
    if (index > -1) {
      selectedSauces.value[groupName].splice(index, 1)
    } else {
      selectedSauces.value[groupName].push(optionName)
    }
  }

  function addToCart(disabled: boolean) {
    if (disabled) return

    if (!hasModifierGroups.value && product.value.variantsEnabled !== false) {
      for (const vg of availableVariants.value) {
        if (!selectedVariants.value[vg.name]) {
          variantValidationError.value = vg.name
          setTimeout(() => { variantValidationError.value = '' }, 4000)
          return
        }
      }
    }

    const transformedSauces: Array<{ _id?: string; name: string; price: number }> = []
    if (!hasModifierGroups.value && product.value.sauces && product.value.saucesEnabled !== false) {
      product.value.sauces.forEach(sauceGroup => {
        const selectedOptions = selectedSauces.value[sauceGroup.name] || []
        selectedOptions.forEach(optionName => {
          const option = sauceGroup.options.find(o => o.name === optionName)
          if (option) {
            transformedSauces.push({ _id: option._id, name: option.name, price: option.price || 0 })
          }
        })
      })
    }

    const newSystemAddons: Array<{ name: string; price: number }> = []
    if (hasModifierGroups.value) {
      for (const mg of enabledModifierGroups.value) {
        const selected = selectedModifiers.value[mg.group.name] || []
        selected.forEach(name => {
          const groupItem = mg.group.items.find(i => i.name === name)
          newSystemAddons.push({ name, price: groupItem?.priceModifier || 0 })
        })
      }
    }

    const legacyAddons = selectedAddons.value.map(name => {
      const addon = availableAddons.value.find(a => a.name === name)
      return { name, price: addon?.price || 0 }
    })

    const cartItem = {
      ...product.value,
      quantity: quantity.value,
      notes: notes.value,
      selectedVariants: hasModifierGroups.value ? {} : { ...selectedVariants.value },
      selectedAddons: hasModifierGroups.value ? newSystemAddons : legacyAddons,
      selectedSauces: hasModifierGroups.value ? [] : transformedSauces,
      selectedModifiers: hasModifierGroups.value ? { ...selectedModifiers.value } : {},
      basePrice: basePrice.value,
      addonsCost: addonsCost.value,
      totalPrice: totalPrice.value,
    }

    emit('add-to-cart', cartItem)
    const { trackAddToCart } = useTracking()
    trackAddToCart(product.value.name, totalPrice.value, product.value.category)
    resetModal()
    closeModal()
  }

  function closeModal() {
    emit('close')
  }

  function resetModal() {
    quantity.value = 1
    notes.value = ''
    selectedVariants.value = {}
    selectedAddons.value = []
    selectedSauces.value = {}
    selectedModifiers.value = {}
    variantValidationError.value = ''
  }

  return {
    quantity,
    notes,
    selectedVariants,
    selectedAddons,
    selectedSauces,
    selectedModifiers,
    variantValidationError,
    hasModifierGroups,
    enabledModifierGroups,
    isModifierGroupRequired,
    isModifierDisabled,
    availableVariants,
    availableSauceGroups,
    availableAddons,
    isVariantRequired,
    basePrice,
    addonsCost,
    totalPrice,
    effectiveSauceMaxes,
    isSauceDisabled,
    getEffectiveMaxSauces,
    selectedVariantNameInModifiers,
    getEffectiveMaxForModifierGroup,
    handleModifierChange,
    handleVariantChange,
    handleSauceChange,
    addToCart,
    closeModal,
    resetModal,
  }
}