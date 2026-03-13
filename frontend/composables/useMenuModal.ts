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

export interface SauceGroup {
  name: string
  maxSelections: number
  options: SauceOption[]
}

export interface Addon {
  _id?: string
  name: string
  price: number
  isAvailable?: boolean
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

  // ── Methods ──────────────────────────────────────────────────────────────────

  function isSauceDisabled(groupName: string, optionName: string, maxSelections: number): boolean {
    const current = selectedSauces.value[groupName] || []
    if (current.includes(optionName)) return false
    return current.length >= maxSelections
  }

  function handleModifierChange(groupName: string, optionName: string) {
    const mg = enabledModifierGroups.value.find(m => m.group.name === groupName)
    const maxSel = mg?.group.maxSelections ?? 0
    if (!selectedModifiers.value[groupName]) selectedModifiers.value[groupName] = []
    if (maxSel === 1) {
      // Single-select — replace
      selectedModifiers.value[groupName] = [optionName]
    } else {
      const idx = selectedModifiers.value[groupName].indexOf(optionName)
      if (idx > -1) {
        selectedModifiers.value[groupName].splice(idx, 1)
      } else {
        if (maxSel > 1 && selectedModifiers.value[groupName].length >= maxSel) return
        selectedModifiers.value[groupName].push(optionName)
      }
    }
  }

  function isModifierDisabled(groupName: string, optionName: string): boolean {
    const mg = enabledModifierGroups.value.find(m => m.group.name === groupName)
    const maxSel = mg?.group.maxSelections ?? 0
    if (maxSel === 0 || maxSel === 1) return false
    const current = selectedModifiers.value[groupName] || []
    if (current.includes(optionName)) return false
    return current.length >= maxSel
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
    isSauceDisabled,
    handleModifierChange,
    handleVariantChange,
    handleSauceChange,
    addToCart,
    closeModal,
    resetModal,
  }
}
