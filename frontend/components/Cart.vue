<template>
    <div class="cart-container bg-[#FBF4E5] min-h-screen flex flex-col">
        <!-- Order Confirm Modal -->
        <OrderConfirmModal
            :isOpen="showOrderConfirmModal"
            :subtotal="subtotal"
            :deliveryFee="deliveryFee"
            :total="total"
            :itemsCount="cartItems.length"
            :cartItems="cartItems"
            @close="handleModalClose"
            @confirm="handleConfirmOrder"
        />

        <!-- Empty Cart State -->
        <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center flex-1 px-4 py-16">
        <svg class="w-24 h-24 text-gray-300 mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
        <h2 class="text-3xl sm:text-4xl font-['Unbounded'] font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
        <p class="text-gray-600 text-center empty-cart-text mb-10 max-w-md" v-if="!hasActiveOrder">Add some delicious items from our menu to get started!</p>
        <p class="text-gray-600 text-center empty-cart-text mb-10 max-w-md" v-else>You have an active order. Track it or continue shopping!</p>
        
        <div v-if="hasActiveOrder && !isOrderDelivered" class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <NuxtLink 
                to="/menu" 
                class="flex items-center justify-center px-8 py-3.5 bg-[#FE601C] text-white rounded-lg font-['Unbounded'] font-semibold text-base transition-all duration-300 hover:bg-[#e5540a] hover:shadow-lg active:scale-95"
            >
                Continue Shopping
            </NuxtLink>
            <NuxtLink 
                to="/order-status" 
                class="flex items-center justify-center px-8 py-3.5 bg-[#1A4189] text-white rounded-lg font-['Unbounded'] font-semibold text-base transition-all duration-300 hover:bg-[#0f2a5e] hover:shadow-lg active:scale-95"
            >
                View Order
            </NuxtLink>
        </div>
        <div v-else>
            <NuxtLink 
                to="/menu" 
                class="flex items-center justify-center px-8 py-3.5 bg-[#FE601C] text-white rounded-lg font-['Unbounded'] font-semibold text-base transition-all duration-300 hover:bg-[#e5540a] hover:shadow-lg active:scale-95"
            >
                Continue Shopping
            </NuxtLink>
        </div>
        </div>

        <!-- Cart Content -->
        <div v-else class="content-wrapper w-full px-4 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-7 md:py-10 lg:py-12 mt-20 sm:mt-24 md:mt-28 lg:mt-32">
        <div class="content-grid grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-8 max-w-7xl mx-auto">
            <!-- Cart Items Section -->
            <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl sm:rounded-2xl md:rounded-3xl lg:rounded-3xl shadow-lg overflow-hidden">
                <!-- Cart Items List -->
                <div class="divide-y divide-gray-200 px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6">
                <div 
                    v-for="(item, index) in cartItems" 
                    :key="index"
                    class="py-4 sm:py-5 md:py-6 px-0 hover:bg-gray-50 transition-colors duration-200 flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 border-b last:border-b-0"
                >
                    <!-- Item Image -->
                    <div class="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gray-100 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden">
                    <img 
            :src="getImageUrl(item.image)" 
            :alt="item.name"
            class="w-full h-full object-contain p-2"
            />
                    </div>

                    <!-- Item Details - Flex Column for Mobile -->
                    <div class="flex-grow min-w-0 flex flex-col justify-between">
                    <div>
                        <h3 class="text-base sm:text-lg md:text-lg lg:text-xl font-['Unbounded'] font-bold text-gray-900 mb-2 sm:mb-2 md:mb-2 lg:mb-2 line-clamp-2">
                            {{ item.name }}
                        </h3>
                        
                        <p class="text-[#FE601C] font-bold text-base sm:text-lg md:text-lg lg:text-lg mb-3 sm:mb-4 md:mb-4">₱{{ ((item.basePrice || item.price) + (item.addonsCost || 0)).toFixed(2) }}</p>
                    </div>
                    
                    <!-- Order Description with Spacing -->
                    <div v-if="getOrderDescription(item).length > 0" class="text-xs sm:text-xs md:text-sm text-gray-600 space-y-2 sm:space-y-2.5 md:space-y-2.5 bg-gray-50 rounded-md p-2.5 sm:p-3 md:p-3 border border-gray-100">
                        <div v-for="(description, idx) in getOrderDescription(item)" :key="idx" class="flex items-start gap-2 sm:gap-2.5">
                            <span class="text-[#FE601C] mt-0.5 flex-shrink-0 font-bold">•</span>
                            <span class="text-gray-700 leading-relaxed break-words">{{ description }}</span>
                        </div>
                    </div>
                    </div>

                    <!-- Right Column: Quantity and Controls -->
                    <div class="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-2 sm:gap-3 mt-3 sm:mt-0">
                        <!-- Quantity Controls -->
                        <div class="flex items-center gap-2 sm:gap-2 md:gap-3">
                            <button
                            @click="decreaseQuantity(index)"
                            class="w-8 h-8 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors min-h-8 min-w-8 sm:min-h-8 sm:min-w-8 md:min-h-9 md:min-w-9"
                            aria-label="Decrease quantity"
                            >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                            </button>
                            <span class="w-6 sm:w-6 md:w-7 text-center font-bold text-gray-900 text-sm sm:text-sm md:text-base">{{ item.quantity }}</span>
                            <button
                            @click="increaseQuantity(index)"
                            class="w-8 h-8 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors min-h-8 min-w-8 sm:min-h-8 sm:min-w-8 md:min-h-9 md:min-w-9"
                            aria-label="Increase quantity"
                            >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            </button>
                        </div>

                        <!-- Item Total (Mobile) / Remove Button (Desktop positioning) -->
                        <div class="text-right sm:text-right">
                            <p class="text-gray-500 text-xs sm:text-xs md:text-sm mb-1">₱{{ (((item.basePrice || item.price) + (item.addonsCost || 0)) * item.quantity).toFixed(2) }}</p>
                        </div>
                        
                        <!-- Remove Button -->
                        <button
                        @click="removeItem(index)"
                        class="w-8 h-8 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-all duration-200 hover:scale-110 min-h-8 min-w-8 sm:min-h-8 sm:min-w-8 md:min-h-9 md:min-w-9"
                        aria-label="Remove item"
                        >
                        <svg class="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        </button>
                    </div>
                </div>
                </div>

                <!-- Continue Shopping Button -->
                <div class="px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6 bg-gray-50 border-t border-gray-200">
                <NuxtLink 
                    to="/menu"
                    class="inline-flex items-center gap-2 text-[#FE601C] font-['Unbounded'] font-semibold hover:text-[#e5540a] transition-colors text-sm sm:text-sm md:text-base"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Continue Shopping
                </NuxtLink>
                </div>
            </div>
            </div>

            <!-- Order Summary Section -->
            <div class="lg:col-span-1">
            <div class="bg-[#1e3a8a] text-white rounded-2xl sm:rounded-2xl md:rounded-3xl lg:rounded-3xl shadow-lg p-5 sm:p-6 md:p-7 lg:p-8 lg:sticky lg:top-32">
                
                <!-- Summary Header -->
                <h2 class="order-summary-title font-['Unbounded'] font-bold mb-5 sm:mb-6 text-white">
                Order Summary
                </h2>

                <!-- Price Breakdown -->
                <div class="space-y-2 sm:space-y-2.5 md:space-y-3 mb-5 pb-5 border-b border-white/20">
                <div class="flex justify-between text-xs sm:text-sm text-white/90">
                    <span>Subtotal</span>
                    <span class="font-semibold">₱{{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-xs sm:text-sm text-white/90">
                    <span>Delivery Fee</span>
                    <span class="font-semibold">₱{{ deliveryFee.toFixed(2) }}</span>
                </div>
                </div>

                <!-- Total -->
                <div class="mb-5 pb-5 border-b border-white/20">
                <div class="flex justify-between items-baseline gap-3">
                    <span class="text-sm md:text-base font-bold font-['Unbounded'] text-white">
                    Total
                    </span>
                    <span class="font-['Unbounded'] font-bold text-xl sm:text-2xl md:text-3xl text-[#FEB90E]">
                    ₱{{ total.toFixed(2) }}
                    </span>
                </div>
                </div>

                <!-- Payment Method -->
                <div class="mb-5 pb-5 border-b border-white/20">
                <div class="payment-method flex items-center gap-2 sm:gap-3">
                    <div class="w-2.5 h-2.5 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span class="text-xs sm:text-sm font-medium text-white/90">
                    Cash on Delivery
                    </span>
                </div>
                </div>

                <!-- Buttons -->
                <div class="flex flex-col gap-3">

                <!-- Place Order -->
                <button
                    @click="openOrderConfirmModal"
                    class="w-full px-4 md:px-5 bg-gradient-to-r from-[#FEB90E] to-[#FFD86B]
                        text-[#1e3a8a] font-['Unbounded'] font-bold py-3
                        text-sm md:text-base rounded-lg transition-all duration-200
                        hover:shadow-xl hover:brightness-105 min-h-11 flex items-center justify-center"
                >
                    Place Order
                </button>

                <!-- View Status -->
                <button
                    @click="goToOrderStatus"
                    :disabled="!hasActiveOrder || isOrderCancelled"
                    :class="[
                    'w-full px-4 md:px-5 font-bold py-3 text-sm md:text-base rounded-lg transition-all duration-200 min-h-11 flex items-center justify-center font-[\'Unbounded\']',
                    hasActiveOrder && !isOrderCancelled
                        ? 'bg-gradient-to-r from-[#FEB90E] to-[#FFD86B] text-[#1e3a8a] hover:shadow-xl'
                        : 'bg-white/30 text-white/50 cursor-not-allowed opacity-60'
                    ]"
                >
                    View Status
                </button>

                </div>

                <!-- Info Text -->
                <p class="text-xs text-white/70 text-center mt-4 px-2">
                Secure checkout powered by Buffs Chicken
                </p>

            </div>
            </div>

        </div>
        </div>
    </div>
</template>

    <script>
    import OrderConfirmModal from './OrderConfirmModal.vue';
    
    export default {
    name: 'Cart',
    components: {
        OrderConfirmModal
    },
    data() {
        return {
        cartItems: [],
        deliveryFee: 40,
        hasActiveOrder: false,
        showOrderConfirmModal: false,
        orderStatus: ''
        };
    },
    computed: {
        isOrderDelivered() {
            const order = localStorage.getItem('buffs_order');
            if (!order) return false;
            const parsedOrder = JSON.parse(order);
            return parsedOrder.status === 'delivered';
        },
        isOrderCancelled() {
            const order = localStorage.getItem('buffs_order');
            if (!order) return false;
            const parsedOrder = JSON.parse(order);
            return parsedOrder.status === 'cancelled';
        },
        subtotal() {
        return this.cartItems.reduce((sum, item) => {
            // Use totalPrice if available (which includes basePrice + addonsCost for 1 quantity)
            // Then multiply by quantity
            const itemPrice = item.basePrice || item.price;
            const addonsTotal = item.addonsCost || 0;
            const itemTotalPrice = (itemPrice + addonsTotal) * item.quantity;
            return sum + itemTotalPrice;
        }, 0);
        },
        total() {
        return this.subtotal + this.deliveryFee;
        }
    },
    methods: {
        getImageUrl(image) {
            if (!image) return '';

            // Normalize any stored URL (localhost, full https, or Nuxt IPX) to a clean /backend-images/... path
            const match = image.match(/\/backend-images\/[^^?"']+/);
            if (match && match[0]) {
                return match[0];
            }
            return image;
        },
        getOrderDescription(item) {
            const descriptions = [];
            
            // Add variant if selected
            if (item.selectedVariants && Object.keys(item.selectedVariants).length > 0) {
                Object.values(item.selectedVariants).forEach(variantOption => {
                    if (variantOption) {
                        descriptions.push(variantOption);
                    }
                });
            }
            
            // Add sauces if selected - handle both object and array formats
            if (item.selectedSauces) {
                let sauceNames = [];
                
                // Check if it's an array (direct format from database)
                if (Array.isArray(item.selectedSauces)) {
                    sauceNames = item.selectedSauces
                        .map(sauce => typeof sauce === 'string' ? sauce : sauce.name)
                        .filter(Boolean);
                } else if (typeof item.selectedSauces === 'object' && Object.keys(item.selectedSauces).length > 0) {
                    // Handle object format {sauceName: [options]}
                    Object.entries(item.selectedSauces).forEach(([sauceName, selectedOptions]) => {
                        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
                            selectedOptions.forEach(option => {
                                const optionName = typeof option === 'string' ? option : option.name;
                                if (optionName) {
                                    sauceNames.push(optionName);
                                }
                            });
                        }
                    });
                }
                
                if (sauceNames.length > 0) {
                    descriptions.push(`Sauces: ${sauceNames.join(', ')}`);
                }
            }
            
            // Add add-ons if selected
            if (item.selectedAddons && item.selectedAddons.length > 0) {
                const addonNames = item.selectedAddons.map(addon => 
                    typeof addon === 'string' ? addon : addon.name
                ).join(', ');
                if (addonNames) {
                    descriptions.push(`Add-ons: ${addonNames}`);
                }
            }
            
            // Add notes if provided
            if (item.notes && item.notes.trim()) {
                descriptions.push(`Notes: ${item.notes}`);
            }
            
            return descriptions;
        },
        increaseQuantity(index) {
        if (this.cartItems[index]) {
            this.cartItems[index].quantity++;
            this.saveCart();
        }
        },
        decreaseQuantity(index) {
        if (this.cartItems[index] && this.cartItems[index].quantity > 1) {
            this.cartItems[index].quantity--;
            this.saveCart();
        } else {
            this.removeItem(index);
        }
        },
        removeItem(index) {
        this.cartItems.splice(index, 1);
        this.saveCart();
        },
        openOrderConfirmModal() {
        this.showOrderConfirmModal = true;
        },
        handleModalClose() {
        this.showOrderConfirmModal = false;
        },
        handleConfirmOrder(customerData) {
        // Submit order to backend
        this.submitOrderToBackend(customerData);
        },
        async submitOrderToBackend(customerData) {
        try {
            const config = useRuntimeConfig();
            const API_BASE_URL = config.public.apiBase;
            
            // Transform cart items to match backend schema
            // selectedAddons and selectedSauces should be {name, price} objects
            const transformedCartItems = this.cartItems.map(item => {
                const selectedAddonsArray = item.selectedAddons || [];
                const itemAddons = item.addons || [];
                const itemSauces = item.sauces || [];
                const selectedSaucesObj = item.selectedSauces || {};
                
                // Convert addon names to {name, price} objects
                const transformedAddons = selectedAddonsArray.map(addonName => {
                    const addonObj = itemAddons.find(a => a.name === addonName);
                    return {
                        name: addonName,
                        price: addonObj ? addonObj.price : 0
                    };
                });
                
                // Convert sauces from object {sauceName: [options]} to array of {_id, name, price} objects
                let transformedSauces = [];
                
                // Check if sauces are already in array format (from database)
                if (Array.isArray(selectedSaucesObj) && selectedSaucesObj.length > 0) {
                    transformedSauces = selectedSaucesObj;
                } else if (typeof selectedSaucesObj === 'object' && Object.keys(selectedSaucesObj).length > 0) {
                    // Convert from object format {sauceName: [options]}
                    Object.entries(selectedSaucesObj).forEach(([sauceName, selectedOptions]) => {
                        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
                            selectedOptions.forEach(optionName => {
                                // Find the sauce group and option to get price
                                const sauceGroup = itemSauces.find(s => s.name === sauceName);
                                if (sauceGroup) {
                                    const sauceOption = sauceGroup.options.find(o => o.name === optionName);
                                    if (sauceOption) {
                                        transformedSauces.push({
                                            _id: sauceOption._id || undefined,
                                            name: optionName,
                                            price: sauceOption.price || 0
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
                
                return {
                    ...item,
                    selectedAddons: transformedAddons,
                    selectedSauces: transformedSauces
                };
            });
            
            // Prepare order payload
            const orderPayload = {
                userId: customerData.userId,
                name: customerData.name,
                email: customerData.email,
                phone: customerData.phone,
                address: customerData.address,
                cartItems: transformedCartItems,
                subtotal: this.subtotal,
                deliveryFee: this.deliveryFee,
                total: this.total,
                notes: customerData.notes || ''
            };

            // Submit to backend
            const response = await fetch(`${API_BASE_URL}/orders/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderPayload)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to submit order (${response.status})`);
            }
            
            const data = await response.json();

            // Save order to localStorage for order status page
            const orderData = {
                orderId: data.order._id,
                orderNumber: data.orderNumber,
                userId: customerData.userId,
                items: this.cartItems,
                subtotal: this.subtotal,
                deliveryFee: this.deliveryFee,
                total: this.total,
                itemsCount: this.cartItems.length,
                status: 'pending',
                timestamp: new Date().toISOString(),
                customer: customerData,
                verificationStatus: customerData.verificationStatus
            };
            
            localStorage.setItem('buffs_order', JSON.stringify(orderData));
            
            // Clear cart after order placed
            this.cartItems = [];
            this.saveCart();
            
            // Update active order state
            this.hasActiveOrder = true;
            
            // Close modal
            this.showOrderConfirmModal = false;
            
            // Redirect to order status page
            this.$router.push('/order-status');
        } catch (error) {
            console.error('Error submitting order:', error);
            alert(error.message || 'Failed to submit order. Please try again.');
        }
        },
        goToOrderStatus() {
        if (this.hasActiveOrder) {
            this.$router.push('/order-status');
        }
        },
        saveCart() {
        // Save cart to localStorage for persistence
        localStorage.setItem('buffs_cart', JSON.stringify(this.cartItems));
        // Dispatch custom event to notify navbar of cart changes
        if (process.client) {
          window.dispatchEvent(new Event('cart-updated'));
        }
        },
        loadCart() {
        // Load cart from localStorage
        const saved = localStorage.getItem('buffs_cart');
        if (saved) {
            this.cartItems = JSON.parse(saved);
        }
        },
        checkForActiveOrder() {
        const order = localStorage.getItem('buffs_order');
        this.hasActiveOrder = !!order;
        }
    },
    mounted() {
        this.loadCart();
        this.checkForActiveOrder();
    }
    };
    </script>

    <style scoped>
    .cart-container {
        transition: background 0.3s ease;
    }

    .empty-cart-text {
        margin-bottom: 1rem;
    }

    /* ============ CART ITEMS SECTION ============ */
    .content-wrapper {
        margin-top: 5rem;
    }

    .bg-white.rounded-3xl.shadow-lg {
        padding: 0 ;
        overflow: hidden;
    }

    /* Cart Items Wrapper */
    .divide-y.divide-gray-200 {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    /* Individual Cart Item */
    .divide-y.divide-gray-200 > div {
        padding: 1rem;
        border-radius: 1rem;
        background: #fafafa;
        border: 1px solid #f0f0f0;
        display: flex;
        gap: 1.5rem;
        transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .divide-y.divide-gray-200 > div:hover {
        background: #f5f5f5;
        border-color: #e5e5e5;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    @media (prefers-reduced-motion: reduce) {
        .divide-y.divide-gray-200 > div {
            transition: none;
        }
    }

    /* Item Name */
    .divide-y.divide-gray-200 > div h3 {
        font-size: 1.125rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0.5rem 0 ;
        line-height: 1.5;
    }

    /* Item Price */
    .divide-y.divide-gray-200 > div p {
        color: #FE601C;
        font-weight: 700;
        font-size: 1.125rem;
        margin: 0.5rem 0 ;
    }

    /* Quantity Controls Container */
    .divide-y.divide-gray-200 > div .flex {
        gap: 1.25rem ;
        margin-top: 0.5rem;
        align-items: center;
    }

    /* Quantity Buttons */
    .divide-y.divide-gray-200 > div button {
        margin: 0 ;
    }

    /* Continue Shopping Section */
    .px-8.py-8.bg-gray-50 {
        padding: 2rem ;
        border-top: 2px solid #f0f0f0;
    }

    /* ============ ORDER SUMMARY SECTION ============ */
    .bg-gradient-to-br.rounded-3xl.shadow-lg {
        padding: 2.5rem ;
        display: flex ;
        flex-direction: column;
        gap: 2rem ;
    }

    /* Order Summary Header - UPDATED */
    .order-summary-title {
        font-size: 1rem;
        font-weight: 700;
        text-align: center;
        line-height: 1.2;
        color: white;
    }

    /* Price Breakdown Container */
    .bg-gradient-to-br.rounded-3xl .space-y-4 {
        display: flex ;
        flex-direction: column;
        gap: 1.5rem ;
        padding: 0 ;
        margin: 0 ;
    }

    /* Individual Price Row */
    .bg-gradient-to-br.rounded-3xl .flex.justify-between.text-sm {
        padding: 0.75rem 0;
        gap: 1rem;
    }

    .bg-gradient-to-br.rounded-3xl .flex.justify-between.text-sm span {
        word-break: break-word;
    }

    /* Total Price Container */
    .bg-gradient-to-br.rounded-3xl .mb-8.pb-8.border-b {
        margin-top: -1rem;
        padding: 2rem 0 2rem 0 ;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2) ;
    }

    /* Total Row */
    .bg-gradient-to-br.rounded-3xl .flex.justify-between.text-lg {
        gap: 1rem;
        padding: 0.5rem 0;
        margin-top: -1rem;
    }

    .bg-gradient-to-br.rounded-3xl .flex.justify-between.text-lg .font-bold:first-child {
        font-size: 1.25rem;
    }

    /* Total Amount Text */
    .bg-gradient-to-br.rounded-3xl .text-2xl {
        font-size: 2rem;
        font-weight: 700;
        line-height: 1.2;
    }

    /* Place Order Button */
    .bg-gradient-to-br.rounded-3xl button {
        width: auto;
        padding: 1rem 1.5rem ;
        font-size: 1rem;
        font-weight: 700;
        border-radius: 0.75rem;
        transition: background-color 0.2s ease, transform 0.2s ease;
        min-width: 200px;
    }

    .bg-gradient-to-br.rounded-3xl button:hover {
        transform: scale(1.02);
    }

    @media (prefers-reduced-motion: reduce) {
        .bg-gradient-to-br.rounded-3xl button {
            transition: none;
        }
    }

    /* Info Text */
    .bg-gradient-to-br.rounded-3xl p.text-xs {
        font-size: 0.65rem;
        line-height: 1.6;
        margin: 0.5rem 0 0 0 ;
        padding: 0 ;
        letter-spacing: 0.5px;
    }
    </style>

