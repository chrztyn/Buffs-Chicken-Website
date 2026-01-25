<template>
    <teleport to="body">
        <!-- Backdrop -->
        <transition name="fade">
            <div 
                v-if="isOpen"
                @click="closeModal"
                class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            ></div>
        </transition>

        <!-- Modal -->
        <transition name="slide-scale">
            <div 
                v-if="isOpen"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
                <div 
                    @click.stop
                    class="bg-white rounded-2xl shadow-xl max-w-sm w-full pointer-events-auto overflow-y-auto max-h-[85vh]"
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

                        <!-- Price Summary -->
                        <div class="price-summary">
                            <div class="price-row">
                                <span class="text-gray-600" style="font-family: 'Unbounded';">Subtotal ({{ quantity }} x ₱{{ item.price }})</span>
                                <span class="font-semibold text-gray-900">₱{{ (item.price * quantity).toFixed(2) }}</span>
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
    data() {
        return {
            quantity: 1,
            notes: ''
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
                description: String
            }
        }
    },
    computed: {
        totalPrice() {
            return this.item.price * this.quantity;
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', {
                ...this.item,
                quantity: this.quantity,
                notes: this.notes,
                totalPrice: this.totalPrice
            });
            this.resetModal();
            this.closeModal();
        },
        closeModal() {
            this.$emit('close');
        },
        resetModal() {
            this.quantity = 1;
            this.notes = '';
        }
    }
};
</script>

<style scoped>
/* Modal Container Spacing */
.modal-content {
    padding: 2.5rem 3.5rem;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

/* Header Section */
.modal-header {
    margin-bottom: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.modal-image {
    width: 220px;
    height: 220px;
    margin-top: 1.5rem;
    margin-bottom: -1rem;
    border-radius: 12px;
    background: linear-gradient(135deg, #FBF4E5 0%, #f5ead9 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
}

.modal-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #1A4189;
}

.modal-description {
    font-size: 0.75rem;
    margin-bottom: 1.75rem;
    color: #666;
    line-height: 1.6;
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
    margin: 2rem 0;
}

/* Customize Section */
.customize-section {
    margin-bottom: 2rem;
    padding-left: 1rem;
    padding-right: 1rem;
}

.customize-title {
    font-size: 0.6rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 1.75rem;
    text-transform: uppercase;
    letter-spacing: 0.25em;
}

.quantity-group {
    margin-bottom: 1.75rem;
}

.quantity-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
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
    margin-bottom: 0.5rem;
}

.notes-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
    display: block;
}

.notes-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.75rem;
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
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    margin-bottom: 1rem;
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
    margin: 1rem 0;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 0.75rem;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-bottom: 1.5rem;
}

.btn-cancel {
    flex: 1;
    padding: 0.625rem 1rem;
    border: 1px solid #d1d5db;
    background: white;
    color: #374151;
    font-weight: 600;
    font-size: 0.875rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-cancel:hover {
    background: #f9fafb;
}

.btn-add {
    flex: 1;
    padding: 0.625rem 1rem;
    background: linear-gradient(to right, #FE601C, #ff7d3a);
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
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
</style>
