<template>
    <teleport to="body">
        <!-- Backdrop -->
        <transition name="fade">
            <div 
                v-if="isOpen"
                @click="closeModal"
                class="fixed inset-0 bg-black/50 backdrop-blur-sm z-100"
            ></div>
        </transition>

        <!-- Modal -->
        <transition name="slide-scale">
            <div 
                v-if="isOpen"
                class="fixed inset-0 z-150 flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-none"
            >
                <div 
                    @click.stop
                    class="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-2xl pointer-events-auto overflow-y-auto max-h-[95vh] sm:max-h-[90vh]"
                >
                    <!-- Close Button -->
                    <button
                        @click="closeModal"
                        class="absolute top-3 sm:top-6 right-3 sm:right-6 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all duration-200 hover:scale-110 min-h-9 min-w-9 sm:min-h-10 sm:min-w-10"
                    >
                        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>

                    <!-- Modal Content -->
                    <div class="modal-content">
                        <!-- Header Section -->
                        <div class="modal-header">
                            <!-- Image Section -->
                            <div class="modal-image">
                                <NuxtImg 
                                    :src="item.image" 
                                    :alt="item.name"
                                    width="600"
                                    height="600"
                                    sizes="sm:100vw md:600px"
                                    format="webp"
                                    loading="lazy"
                                    class="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                                />
                                </div>
                            </div>

                            <!-- Info Section -->
                            <div>
                                <h1 class="modal-title" style="font-family: 'Caprasimo';">
                                    {{ item.name }}
                                </h1>
                                <p class="modal-description" style="font-family: 'Unbounded';">
                                    {{ item.description }}
                                </p>

                                <!-- Price Badge -->
                                <div class="modal-price">
                                    <span class="modal-price-amount">
                                        ₱{{ item.price }}
                                    </span>
                                    <span class="modal-price-label" style="font-family: 'Unbounded';">
                                        each
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Divider -->
                        <div class="modal-divider"></div>

                        <!-- Customization Section -->
                        <div class="customize-section">
                            <h2 class="customize-title" style="font-family: 'Unbounded';">
                                Customize
                            </h2>

                            <!-- Variants Section -->
                            <div v-for="variant in item.variants" :key="variant.name" class="variant-group">
                                <label class="variant-label" style="font-family: 'Unbounded';">
                                    {{ variant.name }}
                                </label>
                                <div class="variant-buttons-container">
                                    <button
                                        v-for="option in variant.options"
                                        :key="option.name"
                                        type="button"
                                        @click="handleVariantChange(variant.name, option.name)"
                                        :class="['variant-button', {
                                            'variant-button-active': selectedVariants[variant.name] === option.name
                                        }]"
                                    >
                                        <span class="variant-button-text">{{ option.name }}</span>
                                        <span v-if="option.priceModifier > 0" class="variant-button-price">
                                            ₱{{ option.priceModifier.toFixed(2) }}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <!-- Sauces Section -->
                            <div v-if="item.sauces && item.sauces.length > 0" class="sauces-wrapper">
                                <div v-for="sauce in item.sauces" :key="sauce.name" class="sauces-group">
                                    <label class="sauces-label" style="font-family: 'Unbounded';">
                                        {{ sauce.name }}
                                        <span class="sauce-counter">
                                            ({{ selectedSauces[sauce.name]?.length || 0 }} of {{ sauce.maxSelections }} selected)
                                        </span>
                                    </label>
                                    <div class="sauce-options">
                                        <label 
                                            v-for="option in sauce.options" 
                                            :key="option.name"
                                            class="sauce-option"
                                        >
                                            <input 
                                                type="checkbox" 
                                                :checked="selectedSauces[sauce.name]?.includes(option.name)"
                                                :disabled="selectedSauces[sauce.name]?.length >= sauce.maxSelections && !selectedSauces[sauce.name]?.includes(option.name)"
                                                @change="handleSauceChange(sauce.name, option.name)"
                                                class="sauce-checkbox"
                                            />
                                            <span style="font-family: 'Unbounded';">
                                                {{ option.name }}
                                            </span>
                                        </label>
                                    </div>
                                    <p v-if="selectedSauces[sauce.name]?.length >= sauce.maxSelections" class="sauce-max-reached" style="font-family: 'Unbounded';">
                                        ✓ Maximum {{ sauce.name.toLowerCase() }} selected
                                    </p>
                                </div>
                            </div>

                            <!-- Addons Section -->
                            <div v-if="item.addons && item.addons.length > 0" class="addons-wrapper">
                                <div class="addons-group">
                                    <label class="addons-label" style="font-family: 'Unbounded';">
                                        Add-ons
                                        <span class="addons-counter">
                                            ({{ selectedAddons.length }} selected)
                                        </span>
                                    </label>
                                    <div class="addon-options">
                                        <label 
                                            v-for="addon in item.addons" 
                                            :key="addon.name"
                                            class="addon-option"
                                        >
                                            <input 
                                                type="checkbox" 
                                                :value="addon.name"
                                                v-model="selectedAddons"
                                                class="addon-checkbox"
                                            />
                                            <span style="font-family: 'Unbounded';">
                                                {{ addon.name }}
                                            </span>
                                            <span class="addon-price">₱{{ addon.price.toFixed(2) }}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Quantity Selector -->
                            <div class="quantity-group">
                                <label class="quantity-label" style="font-family: 'Unbounded';">
                                    Quantity
                                </label>
                                <div class="quantity-controls">
                                    <button
                                        @click="quantity = Math.max(1, quantity - 1)"
                                        class="quantity-btn"
                                    >
                                        −
                                    </button>
                                    <span class="quantity-display">
                                        {{ quantity }}
                                    </span>
                                    <button
                                        @click="quantity += 1"
                                        class="quantity-btn"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <!-- Notes Section -->
                            <div class="notes-group">
                                <label class="notes-label" style="font-family: 'Unbounded';">
                                    Special Instructions
                                </label>
                                <textarea
                                    v-model="notes"
                                    placeholder="E.g., No onions, extra spice"
                                    class="notes-textarea"
                                    style="font-family: 'Unbounded';"
                                    rows="2"
                                ></textarea>
                            </div>
                        </div>

                        <!-- Divider -->
                        <div class="modal-divider"></div>

                        <!-- Validation Error Message -->
                        <transition name="slide-down">
                            <div v-if="validationError" class="validation-error">
                                <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>{{ validationError }}</span>
                            </div>
                        </transition>

                        <!-- Store Closed Warning -->
                        <transition name="slide-down">
                            <div v-if="disabled" class="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg">
                                <div class="flex items-center gap-3">
                                    <svg class="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                    </svg>
                                    <div>
                                        <p class="font-bold text-red-800 font-['Unbounded'] text-sm">Store is currently closed</p>
                                        <p class="text-red-700 font-['Unbounded'] text-xs mt-1">We're not accepting orders right now. Please check our operating hours.</p>
                                    </div>
                                </div>
                            </div>
                        </transition>

                        <!-- Price Summary -->
                        <div class="price-summary">
                            <div class="price-row">
                                <span class="text-gray-600" style="font-family: 'Unbounded';">Subtotal ({{ quantity }} x ₱{{ basePrice.toFixed(2) }})</span>
                                <span class="font-semibold text-gray-900">₱{{ (basePrice * quantity).toFixed(2) }}</span>
                            </div>
                            <div v-if="addonsCost > 0" class="price-row">
                                <span class="text-gray-600" style="font-family: 'Unbounded';">Add-ons</span>
                                <span class="font-semibold text-gray-900">₱{{ addonsCost.toFixed(2) }}</span>
                            </div>
                            <div class="price-divider"></div>
                            <div class="price-total-row">
                                <span class="price-total-label" style="font-family: 'Unbounded';">Total</span>
                                <span class="price-total-amount">₱{{ totalPrice.toFixed(2) }}</span>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="action-buttons">
                            <button
                                @click="closeModal"
                                class="btn-cancel"
                                style="font-family: 'Unbounded';"
                            >
                                Cancel
                            </button>
                            <button
                                @click="addToCart"
                                :disabled="disabled"
                                :class="[
                                    'btn-add',
                                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                                ]"
                                style="font-family: 'Unbounded';"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                {{ disabled ? 'Closed' : 'Add' }}
                            </button>
                        </div>
                    </div>
                </div>
        </transition>
    </teleport>
</template>

<script>
export default {
    name: 'MenuModal',
    emits: ['close', 'add-to-cart'],
    data() {
        return {
            quantity: 1,
            notes: '',
            selectedVariants: {},
            selectedAddons: [],
            selectedSauces: {},
            validationError: ''
        };
    },
    props: {
        isOpen: {
            type: Boolean,
            required: true
        },
        item: {
            type: Object,
            required: true,
            properties: {
                name: String,
                price: Number,
                image: String,
                description: String,
                variants: Array,
                addons: Array
            }
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        basePrice() {
            // Check if any variant is selected
            if (this.item.variants && this.item.variants.length > 0) {
                for (const variant of this.item.variants) {
                    const selectedOption = variant.options.find(
                        opt => opt.name === this.selectedVariants[variant.name]
                    );
                    if (selectedOption && selectedOption.priceModifier !== undefined) {
                        // priceModifier is the TOTAL price for this variant, not an addition
                        return selectedOption.priceModifier;
                    }
                }
            }
            
            // If no variant selected, use base product price
            return this.item.price;
        },
        addonsCost() {
            let cost = 0;
            if (this.item.addons && this.selectedAddons.length > 0) {
                this.item.addons.forEach(addon => {
                    if (this.selectedAddons.includes(addon.name)) {
                        cost += addon.price;
                    }
                });
            }
            return cost;
        },
        totalPrice() {
            return (this.basePrice * this.quantity) + this.addonsCost;
        }
    },
    watch: {
        isOpen(newVal) {
            if (newVal) {
                this.initializeVariants();
            }
        }
    },
    methods: {
        handleVariantChange(variantName, optionName) {
            // Toggle: if already selected, deselect; otherwise select
            if (this.selectedVariants[variantName] === optionName) {
                delete this.selectedVariants[variantName];
            } else {
                this.selectedVariants[variantName] = optionName;
            }
        },
        handleSauceChange(sauceName, optionName) {
            // Toggle sauce selection
            if (!this.selectedSauces[sauceName]) {
                this.selectedSauces[sauceName] = [];
            }
            
            const index = this.selectedSauces[sauceName].indexOf(optionName);
            if (index > -1) {
                // Remove if already selected
                this.selectedSauces[sauceName].splice(index, 1);
            } else {
                // Add if not selected
                this.selectedSauces[sauceName].push(optionName);
            }
        },
        addToCart() {
            // Prevent adding to cart if store is closed
            if (this.disabled) {
                this.validationError = 'Store is currently closed. Orders are not available at this time.';
                setTimeout(() => {
                    this.validationError = '';
                }, 3000);
                return;
            }

            // Validate that at least one sauce is selected for each sauce group
            if (this.item.sauces && this.item.sauces.length > 0) {
                for (const sauce of this.item.sauces) {
                    if (!this.selectedSauces[sauce.name] || this.selectedSauces[sauce.name].length === 0) {
                        this.validationError = `Please select at least one ${sauce.name.toLowerCase()}`;
                        setTimeout(() => {
                            this.validationError = '';
                        }, 3000);
                        return;
                    }
                }
            }

            // Transform selectedSauces from {sauceName: [optionNames]} to [{name, price, _id}]
            const transformedSauces = [];
            if (this.item.sauces && Object.keys(this.selectedSauces).length > 0) {
                this.item.sauces.forEach(sauceGroup => {
                    const selectedOptions = this.selectedSauces[sauceGroup.name] || [];
                    selectedOptions.forEach(optionName => {
                        const option = sauceGroup.options.find(o => o.name === optionName);
                        if (option) {
                            transformedSauces.push({
                                _id: option._id || undefined,
                                name: option.name,
                                price: option.price || 0
                            });
                        }
                    });
                });
            }

            const cartItem = {
                ...this.item,
                quantity: this.quantity,
                notes: this.notes,
                selectedVariants: { ...this.selectedVariants },
                selectedAddons: [...this.selectedAddons],
                selectedSauces: transformedSauces,
                basePrice: this.basePrice,
                addonsCost: this.addonsCost,
                totalPrice: this.totalPrice
            };
            this.$emit('add-to-cart', cartItem);
            this.resetModal();
            this.closeModal();
        },
        closeModal() {
            this.$emit('close');
        },
        resetModal() {
            this.quantity = 1;
            this.notes = '';
            this.selectedVariants = {};
            this.selectedAddons = [];
            this.selectedSauces = {};
            this.validationError = '';
        },
        initializeVariants() {
            // Initialize variants as EMPTY (no auto-selection)
            // User selects variant only if they want a different size
            this.selectedVariants = {};

            // Initialize sauces with empty arrays
            const sauces = {};
            if (this.item.sauces && this.item.sauces.length > 0) {
                this.item.sauces.forEach(sauce => {
                    sauces[sauce.name] = [];
                });
            }
            this.selectedSauces = sauces;
            this.validationError = '';
        }
    }
};
</script>

<style scoped>
/* Modal Container Spacing */
.modal-content {
    padding: 1rem;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (min-width: 640px) {
    .modal-content {
        padding: 1.5rem;
        gap: 1.25rem;
    }
}

@media (min-width: 768px) {
    .modal-content {
        padding: 2rem;
        gap: 1.5rem;
    }
}

/* Header Section */
.modal-header {
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (min-width: 640px) {
    .modal-header {
        flex-direction: row;
        align-items: flex-start;
        margin-bottom: 1rem;
    }
}

.modal-image {
    width: 100%;
    height: 180px;
    border-radius: 12px;
    background: linear-gradient(135deg, #FBF4E5 0%, #f5ead9 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    flex-shrink: 0;
}

@media (min-width: 640px) {
    .modal-image {
        width: 45%;
        height: 220px;
        border-radius: 16px;
    }
}

.modal-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: #1A4189;
    line-height: 1.3;
    text-align: left;
}

@media (min-width: 640px) {
    .modal-title {
        font-size: 1.5rem;
    }
}

.modal-description {
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
    color: #6b7280;
    text-align: left;
    line-height: 1.5;
}

@media (min-width: 640px) {
    .modal-description {
        font-size: 0.875rem;
    }
}

.modal-price {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    margin-bottom: 0;
    margin-top: 0.5rem;
}

.modal-price-amount {
    font-size: 1.25rem;
    font-weight: bold;
    color: #FE601C;
}

@media (min-width: 640px) {
    .modal-price-amount {
        font-size: 1.5rem;
    }
}

.modal-price-label {
    font-size: 0.7rem;
    background: #f3f4f6;
    color: #999;
    padding: 2px 8px;
    border-radius: 9999px;
}

@media (min-width: 640px) {
    .modal-price-label {
        font-size: 0.75rem;
    }
}

/* Divider */
.modal-divider {
    height: 1px;
    background: #e5e7eb;
    margin: 0.75rem 0;
}

@media (min-width: 640px) {
    .modal-divider {
        margin: 1rem 0;
    }
}

/* Customize Section */
.customize-section {
    margin-bottom: 0.75rem;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
}

@media (min-width: 640px) {
    .customize-section {
        margin-bottom: 1rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }
}

.customize-title {
    font-size: 0.65rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 0.25em;
}

@media (min-width: 640px) {
    .customize-title {
        font-size: 0.75rem;
    }
}

/* Variants Section */
.variant-group {
    margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
    .variant-group {
        margin-bottom: 2rem;
    }
}

.variant-label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.75rem;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

@media (min-width: 640px) {
    .variant-label {
        font-size: 0.85rem;
        margin-bottom: 1rem;
    }
}

.variant-buttons-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.variant-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Unbounded', sans-serif;
    position: relative;
    background: white;
}

.variant-button:hover {
    border-color: #FE601C;
    background-color: #fff8f4;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(254, 96, 28, 0.15);
}

.variant-button-active {
    border-color: #FE601C !important;
    background: linear-gradient(135deg, #FE601C 0%, #ff7d3a 100%);
    color: white;
    box-shadow: 0 6px 20px rgba(254, 96, 28, 0.4);
}

.variant-button-active .variant-button-text {
    color: white;
    font-weight: 700;
}

.variant-button-active .variant-button-price {
    color: #fff8f4;
    font-weight: 600;
}

.variant-button-text {
    font-size: 0.9rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    transition: color 0.25s;
}

.variant-button-price {
    font-size: 0.8rem;
    color: #FE601C;
    font-weight: 600;
    transition: color 0.25s;
}

/* Addons Section */
.addons-wrapper {
    margin-bottom: 1.75rem;
}

.addons-group {
    margin-bottom: 0;
}

.addons-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.75rem;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.addons-counter {
    font-weight: 500;
    color: #6b7280;
    font-size: 0.7rem;
    margin-left: 0.5rem;
}

.addon-options {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
}

.addon-option {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    cursor: pointer;
    font-size: 0.75rem;
    color: #374151;
    transition: all 0.2s;
    padding: 0.5rem 0.625rem;
    border-radius: 6px;
    min-height: 36px;
}

@media (min-width: 640px) {
    .addon-option {
        font-size: 0.85rem;
        padding: 0.625rem 0.75rem;
        min-height: 40px;
    }
}

.addon-option:hover {
    background-color: #f3f4f6;
}

.addon-option:has(.addon-checkbox:checked) {
    background-color: #fef3e2;
}

.addon-checkbox {
    cursor: pointer;
    width: 18px;
    height: 18px;
    accent-color: #FE601C;
    flex-shrink: 0;
    min-width: 18px;
    min-height: 18px;
}

@media (min-width: 640px) {
    .addon-checkbox {
        width: 20px;
        height: 20px;
        min-width: 20px;
        min-height: 20px;
    }
}

.addon-price {
    color: #FE601C;
    font-weight: 600;
    margin-left: auto;
    font-size: 0.65rem;
}

@media (min-width: 640px) {
    .addon-price {
        font-size: 0.75rem;
    }
}

/* Sauces Section */
.sauces-group {
    margin-bottom: 1.75rem;
}

.sauces-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.75rem;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.sauce-counter {
    font-weight: 500;
    color: #6b7280;
    font-size: 0.7rem;
    margin-left: 0.5rem;
}

.sauce-options {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
}

.sauce-option {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    cursor: pointer;
    font-size: 0.75rem;
    color: #374151;
    transition: all 0.2s;
    padding: 0.5rem 0.625rem;
    border-radius: 6px;
    min-height: 36px;
}

@media (min-width: 640px) {
    .sauce-option {
        font-size: 0.85rem;
        padding: 0.625rem 0.75rem;
        min-height: 40px;
    }
}

.sauce-option:hover {
    background-color: #f3f4f6;
}

.sauce-option:has(.sauce-checkbox:checked) {
    background-color: #fef3e2;
}

.sauce-checkbox {
    cursor: pointer;
    width: 18px;
    height: 18px;
    accent-color: #FE601C;
    flex-shrink: 0;
    min-width: 18px;
    min-height: 18px;
}

@media (min-width: 640px) {
    .sauce-checkbox {
        width: 20px;
        height: 20px;
        min-width: 20px;
        min-height: 20px;
    }
}

.sauce-checkbox:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: #f3f4f6;
}

.sauce-max-reached {
    font-size: 0.8rem;
    color: #059669;
    font-weight: 500;
    margin-top: 0.75rem;
    padding: 0.75rem;
    background-color: #ecfdf5;
    border-radius: 6px;
    border-left: 3px solid #059669;
}

/* Sauces Wrapper */
.sauces-wrapper {
    margin-bottom: 1.75rem;
}

/* Validation Error */
.validation-error {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background-color: #fee2e2;
    border-radius: 8px;
    border-left: 4px solid #dc2626;
    color: #991b1b;
    font-weight: 500;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
}

.error-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: #dc2626;
}

/* Quantity Section */
.quantity-group {
    margin-bottom: 0.75rem;
    margin-top: -1.5rem;
}

@media (min-width: 640px) {
    .quantity-group {
        margin-bottom: 1rem;
        margin-top: -2rem;
    }
}

.quantity-label {
    font-size: 0.65rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    display: block;
}

@media (min-width: 640px) {
    .quantity-label {
        font-size: 0.7rem;
    }
}

.quantity-controls {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #f3f4f6;
    border-radius: 8px;
    padding: 4px;
}

.quantity-btn {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: white;
    border: none;
    cursor: pointer;
    color: #FE601C;
    font-weight: bold;
    font-size: 1rem;
    transition: all 0.2s;
    min-height: 32px;
    min-width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (min-width: 640px) {
    .quantity-btn {
        width: 36px;
        height: 36px;
        min-height: 36px;
        min-width: 36px;
    }
}

.quantity-btn:hover {
    background: #e5e7eb;
}

.quantity-display {
    width: 32px;
    text-align: center;
    font-weight: bold;
    font-size: 0.875rem;
    color: #1f2937;
}

@media (min-width: 640px) {
    .quantity-display {
        width: 36px;
    }
}

.notes-group {
    margin-bottom: 0.5rem;
}

@media (min-width: 640px) {
    .notes-group {
        margin-bottom: 0.75rem;
    }
}

.notes-label {
    font-size: 0.65rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.4rem;
    display: block;
}

@media (min-width: 640px) {
    .notes-label {
        font-size: 0.7rem;
        margin-bottom: 0.5rem;
    }
}

.notes-textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.7rem;
    font-family: 'Unbounded', sans-serif;
    resize: none;
    transition: all 0.2s;
    min-height: 60px;
}

@media (min-width: 640px) {
    .notes-textarea {
        font-size: 0.75rem;
        padding: 0.625rem;
        min-height: 70px;
    }
}

.notes-textarea:focus {
    outline: none;
    border-color: #FE601C;
}

/* Price Summary */
.price-summary {
    background: #f9fafb;
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 0.75rem;
}

@media (min-width: 640px) {
    .price-summary {
        padding: 1rem;
        margin-bottom: 1rem;
    }
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.65rem;
    margin-bottom: 0.5rem;
}

@media (min-width: 640px) {
    .price-row {
        font-size: 0.75rem;
        margin-bottom: 0.75rem;
    }
}

.price-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.75rem;
}

@media (min-width: 640px) {
    .price-total-row {
        margin-top: 1rem;
    }
}

.price-total-label {
    font-size: 0.8rem;
    font-weight: bold;
    color: #1f2937;
}

@media (min-width: 640px) {
    .price-total-label {
        font-size: 1rem;
    }
}

.price-total-amount {
    font-size: 1.25rem;
    font-weight: bold;
    color: #FE601C;
}

@media (min-width: 640px) {
    .price-total-amount {
        font-size: 1.5rem;
    }
}

.price-divider {
    height: 1px;
    background: #d1d5db;
    margin: 0.5rem 0;
}

@media (min-width: 640px) {
    .price-divider {
        margin: 0.75rem 0;
    }
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 0.5rem;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    margin-bottom: 0.75rem;
}

@media (min-width: 640px) {
    .action-buttons {
        gap: 0.75rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        margin-bottom: 1rem;
    }
}

.btn-cancel {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    background: white;
    color: #374151;
    font-weight: 600;
    font-size: 0.7rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (min-width: 640px) {
    .btn-cancel {
        font-size: 0.8rem;
        padding: 0.625rem 1rem;
        min-height: 44px;
    }
}

.btn-cancel:hover {
    background: #f9fafb;
}

.btn-add {
    flex: 1;
    padding: 0.5rem 0.75rem;
    background: linear-gradient(to right, #FE601C, #ff7d3a);
    color: white;
    font-weight: 600;
    font-size: 0.7rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    min-height: 40px;
}

@media (min-width: 640px) {
    .btn-add {
        font-size: 0.8rem;
        padding: 0.625rem 1rem;
        min-height: 44px;
    }
}

.btn-add:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.btn-add:active {
    transform: scale(0.95);
}

/* Animation Classes */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-scale-enter-active,
.slide-scale-leave-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-scale-enter-from {
    opacity: 0;
    transform: scale(0.7) translateY(20px);
}

.slide-scale-leave-to {
    opacity: 0;
    transform: scale(0.7) translateY(20px);
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease;
}

.slide-down-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
