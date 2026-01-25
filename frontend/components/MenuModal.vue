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
                class="fixed inset-0 z-150 flex items-center justify-center p-4 pointer-events-none"
            >
                <div 
                    @click.stop
                    class="bg-white rounded-2xl shadow-xl w-full max-w-2xl pointer-events-auto overflow-y-auto max-h-[85vh]"
                >
                    <!-- Close Button -->
                    <button
                        @click="closeModal"
                        class="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>

                    <!-- Modal Content -->
                    <div class="modal-content">
                        <!-- Header Section -->
                        <div class="modal-header">
                            <!-- Image Section -->
                            <div class="modal-image">
                                <img 
                                    :src="item.image" 
                                    :alt="item.name"
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

                            <!-- Addons Section -->
                            <div v-if="item.addons && item.addons.length > 0" class="addons-group">
                                <label class="addons-label" style="font-family: 'Unbounded';">
                                    Add-ons
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
                                class="btn-add"
                                style="font-family: 'Unbounded';"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                Add
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

            const cartItem = {
                ...this.item,
                quantity: this.quantity,
                notes: this.notes,
                selectedVariants: { ...this.selectedVariants },
                selectedAddons: [...this.selectedAddons],
                selectedSauces: JSON.parse(JSON.stringify(this.selectedSauces)),
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
    padding: 1.5rem 2rem;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Header Section */
.modal-header {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.modal-image {
    width: 160px;
    height: 160px;
    margin-top: 0.5rem;
    margin-bottom: -0.5rem;
    border-radius: 12px;
    background: linear-gradient(135deg, #FBF4E5 0%, #f5ead9 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
}

.modal-title {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    color: #1A4189;
}

.modal-description {
    font-size: 0.7rem;
    margin-bottom: 0.75rem;
    color: #666;
    line-height: 1.4;
}

.modal-price {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-bottom: 0;
}

.modal-price-amount {
    font-size: 1.5rem;
    font-weight: bold;
    color: #FE601C;
}

.modal-price-label {
    font-size: 0.75rem;
    background: #f3f4f6;
    color: #999;
    padding: 2px 8px;
    border-radius: 9999px;
}

/* Divider */
.modal-divider {
    height: 1px;
    background: #e5e7eb;
    margin: 0.75rem 0;
}

/* Customize Section */
.customize-section {
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}

.customize-title {
    font-size: 0.6rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.25em;
}

.quantity-group {
    margin-bottom: 0.5rem;
    margin-top: -2rem;
}

.addons-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
    display: block;
}

.addon-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.addon-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.75rem;
    color: #374151;
    justify-content: space-between;
}

.addon-checkbox {
    cursor: pointer;
    width: 16px;
    height: 16px;
    accent-color: #FE601C;
}

.addon-price {
    color: #FE601C;
    font-weight: 600;
    margin-left: auto;
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
    font-size: 0.85rem;
    color: #374151;
    transition: all 0.2s;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
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
    margin-bottom: 0.5rem;
    margin-top: -2rem;
}

.quantity-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    display: block;
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
    font-size: 0.875rem;
    transition: all 0.2s;
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

.notes-group {
    margin-bottom: 0.25rem;
}

.notes-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    display: block;
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
}

.notes-textarea:focus {
    outline: none;
    border-color: #FE601C;
}

/* Price Summary */
.price-summary {
    background: #f9fafb;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 0.75rem;
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.7rem;
    margin-bottom: 0.5rem;
}

.price-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
}

.price-total-label {
    font-size: 0.875rem;
    font-weight: bold;
    color: #1f2937;
}

.price-total-amount {
    font-size: 1.5rem;
    font-weight: bold;
    color: #FE601C;
}

.price-divider {
    height: 1px;
    background: #d1d5db;
    margin: 0.5rem 0;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin-bottom: 0.75rem;
}

.btn-cancel {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    background: white;
    color: #374151;
    font-weight: 600;
    font-size: 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
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
    font-size: 0.75rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
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
