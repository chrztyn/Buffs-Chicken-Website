<template>
    <div class="cart-container bg-gradient-to-br from-[#FBF4E5] via-[#FFF8E7] to-[#FBF4E5] min-h-screen flex flex-col">
        <!-- Order Confirm Modal -->
        <OrderConfirmModal
            :isOpen="showOrderConfirmModal"
            :subtotal="subtotal"
            :total="total"
            :itemsCount="cartItems.length"
            :cartItems="cartItems"
            @close="handleModalClose"
            @confirm="handleConfirmOrder"
        />

        <!-- Empty Cart State -->
        <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center flex-1 px-4 py-16">
            <!-- Animated Shopping Cart Icon -->
            <div class="relative mb-8">
                <div class="cart-icon-wrapper">
                    <svg class="w-32 h-32 text-[#1A4189]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <div class="empty-cart-badge">
                        <span class="text-white text-sm font-bold">0</span>
                    </div>
                </div>
            </div>
            
            <h2 class="text-3xl sm:text-4xl font-['Unbounded'] font-bold text-[#1A4189] mb-3">Your Cart is Empty</h2>
            <p class="text-gray-600 text-center text-base mb-10 max-w-md" v-if="!hasActiveOrder">
                Start adding delicious items from our menu!
            </p>
            <p class="text-gray-600 text-center text-base mb-10 max-w-md" v-else>
                You have an active order. Track it or continue shopping!
            </p>
            
            <div v-if="hasActiveOrder && !isOrderDelivered" class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <NuxtLink 
                    to="/menu" 
                    class="group flex items-center justify-center px-8 py-4 bg-[#FE601C] text-white rounded-xl font-['Unbounded'] font-semibold text-base transition-all duration-300 hover:bg-[#e5540a] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                    <svg class="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Continue Shopping
                </NuxtLink>
                <NuxtLink 
                    to="/order-status" 
                    class="flex items-center justify-center px-8 py-4 bg-[#1A4189] text-white rounded-xl font-['Unbounded'] font-semibold text-base transition-all duration-300 hover:bg-[#0f2a5e] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                    View Order Status
                </NuxtLink>
            </div>
            <div v-else>
                <NuxtLink 
                    to="/menu" 
                    class="group flex items-center justify-center px-10 py-4 bg-gradient-to-r from-[#FE601C] to-[#ff7a3d] text-white rounded-xl font-['Unbounded'] font-semibold text-base transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
                >
                    <svg class="w-5 h-5 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    Start Shopping
                </NuxtLink>
            </div>
        </div>

        <!-- Cart Content -->
            <div v-else class="content-wrapper w-full px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-5 md:py-7 lg:py-8 mt-14 sm:mt-16 md:mt-20 lg:mt-24">
            <!-- Cart Header with Item Count -->
            <div class="max-w-7xl mx-auto mb-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="cart-header-icon">
                            <svg class="w-8 h-8 text-[#1A4189]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            <div class="cart-badge">{{ cartItems.length }}</div>
                        </div>
                        <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-['Unbounded'] font-bold text-[#1A4189]">
                            Shopping Cart
                        </h1>
                    </div>
                    <NuxtLink 
                        to="/menu"
                        class="hidden sm:flex items-center gap-2 text-[#FE601C] font-['Unbounded'] font-semibold hover:text-[#e5540a] transition-all hover:-translate-x-1 text-sm"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Back to Menu
                    </NuxtLink>
                </div>
            </div>

            <div class="content-grid grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                <!-- Cart Items Section -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <!-- Cart Items Header -->
                        <div class="bg-gradient-to-r from-[#1A4189] to-[#2557b8] px-6 py-4">
                            <div class="flex items-center justify-between text-white">
                                <h2 class="font-['Unbounded'] font-bold text-lg">Your Items</h2>
                                <span class="text-sm bg-white/20 px-3 py-1 rounded-full">{{ cartItems.length }} {{ cartItems.length === 1 ? 'item' : 'items' }}</span>
                            </div>
                        </div>

                        <!-- Cart Items List -->
                        <div class="divide-y divide-gray-100">
                            <div
                                v-for="(item, index) in cartItems"
                                :key="index"
                                class="cart-item relative p-5 sm:p-6 hover:bg-gradient-to-r hover:from-[#FBF4E5] hover:to-transparent transition-all duration-300 group"
                            >
                                <!-- Mobile Delete Button -->
                                <button
                                    @click="removeItem(index)"
                                    class="absolute top-3 right-3 sm:hidden w-9 h-9 rounded-full bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 shadow-sm"
                                    aria-label="Remove item"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>

                                <div class="flex flex-col sm:flex-row gap-5">
                                    <!-- Item Image with Border -->
                                    <div class="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 group-hover:border-[#FE601C]/30 transition-all duration-300 shadow-sm">
                                        <img
                                            :src="getImageUrl(item.image)"
                                            :alt="item.name"
                                            class="w-full h-full object-contain p-3"
                                        />
                                    </div>

                                    <!-- Item Details -->
                                    <div class="flex-grow min-w-0 flex flex-col justify-between pr-12 sm:pr-0">
                                        <div>
                                            <h3 class="text-lg sm:text-xl font-['Unbounded'] font-bold text-[#1A4189] mb-2 line-clamp-2 group-hover:text-[#2557b8] transition-colors">
                                                {{ item.name }}
                                            </h3>

                                            <div class="flex items-baseline gap-2 mb-3">
                                                <p class="text-[#FE601C] font-bold text-xl">₱{{ ((item.basePrice || item.price) + (item.addonsCost || 0)).toFixed(2) }}</p>
                                                <span class="text-gray-400 text-sm">per item</span>
                                            </div>
                                        </div>

                                        <!-- Order Customization Details -->
                                        <div v-if="getOrderDescription(item).length > 0" class="text-sm text-gray-700 space-y-2 bg-gradient-to-br from-[#FBF4E5] to-[#FFF8E7] rounded-lg p-3 border border-[#FEB90E]/20">
                                            <div v-for="(description, idx) in getOrderDescription(item)" :key="idx" class="flex items-start gap-2">
                                                <svg class="w-4 h-4 text-[#FE601C] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                                </svg>
                                                <span class="text-gray-700 leading-relaxed">{{ description }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Right Column: Quantity and Controls -->
                                    <div class="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-4 mt-2 sm:mt-0">
                                        <!-- Quantity Controls -->
                                        <div class="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                                            <button
                                                @click="decreaseQuantity(index)"
                                                class="w-9 h-9 rounded-lg bg-white hover:bg-[#FE601C] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                                                aria-label="Decrease quantity"
                                            >
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"></path>
                                                </svg>
                                            </button>
                                            <span class="w-10 text-center font-bold text-[#1A4189] text-lg">{{ item.quantity }}</span>
                                            <button
                                                @click="increaseQuantity(index)"
                                                class="w-9 h-9 rounded-lg bg-white hover:bg-[#FE601C] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                                                aria-label="Increase quantity"
                                            >
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
                                                </svg>
                                            </button>
                                        </div>

                                        <!-- Item Total Price -->
                                        <div class="text-right">
                                            <p class="text-xs text-gray-500 mb-1">Subtotal</p>
                                            <p class="text-xl font-bold text-[#1A4189]">₱{{ (((item.basePrice || item.price) + (item.addonsCost || 0)) * item.quantity).toFixed(2) }}</p>
                                        </div>

                                        <!-- Remove Button - Desktop -->
                                        <button
                                            @click="removeItem(index)"
                                            class="hidden sm:flex w-10 h-10 rounded-lg bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
                                            aria-label="Remove item"
                                        >
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Continue Shopping Footer -->
                        <div class="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
                            <NuxtLink 
                                to="/menu"
                                class="group inline-flex items-center gap-2 text-[#FE601C] font-['Unbounded'] font-semibold hover:text-[#e5540a] transition-all duration-200 text-sm"
                            >
                                <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                        <!-- Buttons -->
                        <div class="flex flex-col gap-3">
                            <!-- Store Closed Warning -->
                            <div v-if="!storeOpen" class="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-2">
                                <div class="flex items-start gap-2">
                                    <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                    </svg>
                                    <div class="flex-1">
                                        <h4 class="font-['Unbounded'] text-sm font-bold text-red-800 mb-1">Store Currently Closed</h4>
                                        <p class="font-['Unbounded'] text-xs text-red-700">We're not accepting orders right now. Please check back during our operating hours.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Place Order -->
                            <button
                                @click="openOrderConfirmModal"
                                :disabled="!storeOpen"
                                :class="[
                                    'w-full px-4 md:px-5 font-[\'Unbounded\'] font-bold py-3 text-sm md:text-base rounded-lg transition-all duration-200 min-h-11 flex items-center justify-center',
                                    storeOpen 
                                        ? 'bg-gradient-to-r from-[#FEB90E] to-[#FFD86B] text-[#1e3a8a] hover:shadow-xl hover:brightness-105 cursor-pointer'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                                ]"
                            >
                                {{ storeOpen ? 'Place Order' : 'Store Closed - Cannot Order' }}
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
            hasActiveOrder: false,
            showOrderConfirmModal: false,
            orderStatus: '',
            storeOpen: true,
            storeStatus: null
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
                const itemPrice = item.basePrice || item.price;
                const addonsTotal = item.addonsCost || 0;
                const itemTotalPrice = (itemPrice + addonsTotal) * item.quantity;
                return sum + itemTotalPrice;
            }, 0);
        },
        total() {
            return this.subtotal;
        }
    },
    methods: {
        getImageUrl(image) {
            if (!image) return '';
            const match = image.match(/\/backend-images\/[^^?"']+/);
            if (match && match[0]) {
                return match[0];
            }
            return image;
        },
        getOrderDescription(item) {
            const descriptions = [];
            
            if (item.selectedVariants && Object.keys(item.selectedVariants).length > 0) {
                Object.values(item.selectedVariants).forEach(variantOption => {
                    if (variantOption) {
                        descriptions.push(variantOption);
                    }
                });
            }
            
            if (item.selectedSauces) {
                let sauceNames = [];
                
                if (Array.isArray(item.selectedSauces)) {
                    sauceNames = item.selectedSauces
                        .map(sauce => typeof sauce === 'string' ? sauce : sauce.name)
                        .filter(Boolean);
                } else if (typeof item.selectedSauces === 'object' && Object.keys(item.selectedSauces).length > 0) {
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
            
            if (item.selectedAddons && item.selectedAddons.length > 0) {
                const addonNames = item.selectedAddons.map(addon => 
                    typeof addon === 'string' ? addon : addon.name
                ).join(', ');
                if (addonNames) {
                    descriptions.push(`Add-ons: ${addonNames}`);
                }
            }
            
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
            this.submitOrderToBackend(customerData);
        },
        async submitOrderToBackend(customerData) {
            try {
                const config = useRuntimeConfig();
                const API_BASE_URL = config.public.apiBase;
                
                const transformedCartItems = this.cartItems.map(item => {
                    const selectedAddonsArray = item.selectedAddons || [];
                    const itemAddons = item.addons || [];
                    const itemSauces = item.sauces || [];
                    const selectedSaucesObj = item.selectedSauces || {};
                    
                    const transformedAddons = selectedAddonsArray.map(addonName => {
                        const addonObj = itemAddons.find(a => a.name === addonName);
                        return {
                            name: addonName,
                            price: addonObj ? addonObj.price : 0
                        };
                    });
                    
                    let transformedSauces = [];
                    
                    if (Array.isArray(selectedSaucesObj) && selectedSaucesObj.length > 0) {
                        transformedSauces = selectedSaucesObj;
                    } else if (typeof selectedSaucesObj === 'object' && Object.keys(selectedSaucesObj).length > 0) {
                        Object.entries(selectedSaucesObj).forEach(([sauceName, selectedOptions]) => {
                            if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
                                selectedOptions.forEach(optionName => {
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
                
                const orderPayload = {
                    userId: customerData.userId,
                    name: customerData.name,
                    email: customerData.email,
                    phone: customerData.phone,
                    address: customerData.address,
                    cartItems: transformedCartItems,
                    subtotal: this.subtotal,
                    total: this.total,
                    notes: customerData.notes || '',
                    paymentMethod: customerData.paymentMethod || 'cash_on_delivery',
                    paymentReference: customerData.paymentReference || null,
                    gcashReference: customerData.gcashReference || null
                };

                const response = await fetch(`${API_BASE_URL}/orders/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderPayload)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    
                    // Check if store is closed
                    if (errorData.storeClosed) {
                        alert('Store is Currently Closed\n\n' + errorData.message + '\n\nPlease check our operating hours and try again when we\'re open.');
                        // Refresh the page to show updated store status
                        window.location.reload();
                        return;
                    }
                    
                    throw new Error(errorData.message || `Failed to submit order (${response.status})`);
                }
                
                const data = await response.json();

                // Track successful order confirmation
                const { trackOrderConfirmed } = useTracking()
                trackOrderConfirmed(data.orderNumber, this.total)

                const orderData = {
                    orderId: data.order._id,
                    orderNumber: data.orderNumber,
                    userId: customerData.userId,
                    items: this.cartItems,
                    subtotal: this.subtotal,
                    total: this.total,
                    itemsCount: this.cartItems.length,
                    status: 'pending',
                    timestamp: new Date().toISOString(),
                    customer: customerData,
                    verificationStatus: customerData.verificationStatus
                };
                
                localStorage.setItem('buffs_order', JSON.stringify(orderData));
                
                this.cartItems = [];
                this.saveCart();
                
                this.hasActiveOrder = true;
                this.showOrderConfirmModal = false;
                
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
            localStorage.setItem('buffs_cart', JSON.stringify(this.cartItems));
            if (process.client) {
                window.dispatchEvent(new Event('cart-updated'));
            }
        },
        loadCart() {
            const saved = localStorage.getItem('buffs_cart');
            if (saved) {
                this.cartItems = JSON.parse(saved);
            }
        },
        checkForActiveOrder() {
            const order = localStorage.getItem('buffs_order');
            this.hasActiveOrder = !!order;
        },
        async loadStoreStatus() {
            try {
                const { getStoreStatus } = useApi();
                const response = await getStoreStatus();
                if (response.data && response.data.data) {
                    this.storeOpen = response.data.data.isOpen;
                    this.storeStatus = response.data.data;
                }
            } catch (error) {
                console.error('Failed to load store status:', error);
                // Assume open if we can't check
                this.storeOpen = true;
            }
        }
    },
    mounted() {
        this.loadCart();
        this.checkForActiveOrder();
        this.loadStoreStatus();
        // Track cart view
        const { trackCartViewed } = useTracking()
        trackCartViewed(this.cartItems.length, this.subtotal)
    }
};
</script>

<style scoped>
/* Cart Icon Wrapper */
.cart-icon-wrapper {
    position: relative;
    display: inline-block;
}

.empty-cart-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: linear-gradient(135deg, #FE601C, #ff7a3d);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(254, 96, 28, 0.4);
}

/* Cart Header Icon */
.cart-header-icon {
    position: relative;
    display: inline-block;
}

.cart-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: linear-gradient(135deg, #FE601C, #ff7a3d);
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(254, 96, 28, 0.4);
}

/* Cart Item Hover Animation */
.cart-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cart-item:hover {
    transform: translateX(4px);
}

/* Pulse Animation for Payment Indicator */
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Order Summary Title - Original Design */
.order-summary-title {
    font-size: 1rem;
    font-weight: 700;
    text-align: center;
    line-height: 1.2;
    color: white;
}

/* Smooth Transitions */
button {
    transition: all 0.2s ease-in-out;
}

/* Gradient Text Effect */
.text-gradient {
    background: linear-gradient(135deg, #FEB90E, #FFD86B);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Responsive Adjustments */
@media (max-width: 640px) {
    .cart-badge {
        width: 20px;
        height: 20px;
        font-size: 0.65rem;
    }

    /* Main heading */
    h1 {
        font-size: 20px;
    }
    
    /* Cart item names */
    .cart-item h3 {
        font-size: 14px ;
    }
    
    /* Prices */
    .cart-item .text-xl {
        font-size: 16px;
    }
    
    /* Order summary title */
    .order-summary-title {
        font-size: 16px;
    }
    
    /* Total price in summary */
    .order-summary-title + * .text-3xl {
        font-size: 20px;
    }
    
    /* Add-ons/customization text */
    .cart-item .text-sm {
        font-size: 10px;
    }
    
    /* Quantity number */
    .cart-item .text-lg {
        font-size: 14px;
    }
    
    /* Subtotal label and other small text */
    .cart-item .text-xs {
        font-size: 8px;
    }
}

/* Backdrop Blur Support */
@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
    .backdrop-blur-sm {
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: #1A4189;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #0f2a5e;
}
</style>