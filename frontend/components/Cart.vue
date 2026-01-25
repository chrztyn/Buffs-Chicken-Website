<template>
    <div class="cart-container bg-[#FBF4E5] min-h-screen flex flex-col">
        <!-- Order Confirm Modal -->
        <OrderConfirmModal
            :isOpen="showOrderConfirmModal"
            :subtotal="subtotal"
            :deliveryFee="deliveryFee"
            :total="total"
            :itemsCount="cartItems.length"
            @close="handleModalClose"
            @confirm="handleConfirmOrder"
        />

        <!-- Empty Cart State -->
        <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center flex-1 px-4">
        <svg class="w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
        <h2 class="text-2xl sm:text-3xl font-['Unbounded'] font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p class="text-gray-500 text-center empty-cart-text">Add some delicious items from our menu to get started!</p>
        <NuxtLink 
            to="/menu" 
            class="w-45 h-5 text-center px-8 py-3 bg-[#FE601C] text-white rounded-full font-['Unbounded'] font-semibold hover:bg-[#e5540a] transition-all duration-200 hover:scale-105 text-sm"
        >
            Continue Shopping
        </NuxtLink>
        </div>

        <!-- Cart Content -->
        <div v-else class="content-wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <div class="content-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Cart Items Section -->
            <div class="lg:col-span-2">
            <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
                <!-- Cart Items List -->
                <div class="divide-y divide-gray-200 px-6 py-6">
                <div 
                    v-for="(item, index) in cartItems" 
                    :key="index"
                    class="py-6 px-4 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-6 border-b last:border-b-0"
                >
                    <!-- Item Image -->
                    <div class="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-2xl overflow-hidden">
                    <img 
                        :src="item.image" 
                        :alt="item.name"
                        class="w-full h-full object-contain p-2"
                    />
                    </div>

                    <!-- Item Details -->
                    <div class="flex-grow">
                    <h3 class="text-lg sm:text-xl font-['Unbounded'] font-bold text-gray-900 mb-1">
                        {{ item.name }}
                    </h3>
                    <p class="text-[#FE601C] font-bold text-lg mb-4">₱{{ item.price }}</p>
                    
                    <!-- Quantity Controls -->
                    <div class="flex items-center gap-3">
                        <button
                        @click="decreaseQuantity(index)"
                        class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        aria-label="Decrease quantity"
                        >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                        </button>
                        <span class="w-8 text-center font-bold text-gray-900">{{ item.quantity }}</span>
                        <button
                        @click="increaseQuantity(index)"
                        class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        aria-label="Increase quantity"
                        >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        </button>
                        <span class="ml-auto text-gray-500 text-sm font-semibold">₱{{ (item.price * item.quantity).toFixed(2) }}</span>
                    </div>
                    </div>

                    <!-- Remove Button -->
                    <button
                    @click="removeItem(index)"
                    class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
                    aria-label="Remove item"
                    >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    </button>
                </div>
                </div>

                <!-- Continue Shopping Button -->
                <div class="px-8 py-8 bg-gray-50 border-t border-gray-200">
                <NuxtLink 
                    to="/menu"
                    class="inline-flex items-center gap-2 text-[#FE601C] font-['Unbounded'] font-semibold hover:text-[#e5540a] transition-colors text-sm"
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
            <div class="bg-gradient-to-br from-[#1A4189] to-[#0f2a5f] rounded-3xl shadow-lg p-8 text-white sticky top-32">
                <!-- Summary Header -->
                <h2 class="text-1xl font-['Unbounded'] mb-2 px-2">Order Summary</h2>

                <!-- Price Breakdown -->
                <div class="space-y-2 mb-8 pb-8 border-b border-white border-opacity-20 px-2">
                <div class="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span class="font-semibold">₱{{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span class="font-semibold">₱{{ deliveryFee.toFixed(2) }}</span>
                </div>
                </div>

                <!-- Total -->
                <div class="mb-8 pb-8 border-b border-white border-opacity-20 px-2">
                <div class="flex justify-between text-lg">
                    <span class="font-bold">Total</span>
                    <span class="font-['Unbounded'] font-bold text-2xl text-[#FEB90E]">₱{{ total.toFixed(2) }}</span>
                </div>
                </div>

                <!-- Payment Method -->
                <div class="mb-8 pb-8 border-b border-white border-opacity-10 px-2">
                    <div class="payment-method flex items-center gap-3">
                        <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                        <span class="text-sm font-medium">Cash on Delivery</span>
                    </div>
                </div>

                <!-- Place Order / View Order Status Buttons -->
                <div class="flex gap-3 mx-2">
                  <button
                  @click="openOrderConfirmModal"
                  class="flex-1 px-4 bg-[#FEB90E] text-gray-900 font-['Unbounded'] font-bold py-2 text-sm rounded-lg hover:bg-[#e5a70d] transition-all duration-200 hover:scale-105 transform"
                  >
                  Place Order
                  </button>

                  <!-- View Order Status Button -->
                  <button
                  @click="goToOrderStatus"
                  :disabled="!hasActiveOrder"
                  :class="[
                    'flex-1 px-4 font-bold py-2 text-sm rounded-lg transition-all duration-200 hover:scale-105 transform',
                    hasActiveOrder
                      ? 'bg-gradient-to-r from-[#FE601C] to-[#FEB90E] text-gray-900 hover:shadow-lg cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  ]"
                  style="font-family: 'Unbounded', sans-serif;"
                  >
                  View Status
                  </button>
                </div>

                <!-- Info Text -->
                <p class="text-xs text-white text-center mt-2 px-2">
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
        };
    },
    computed: {
        subtotal() {
        return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },
        total() {
        return this.subtotal + this.deliveryFee;
        }
    },
    methods: {
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
        // Generate order ID
        const orderId = Math.floor(Math.random() * 1000000) + 100000;
        
        // Save order to localStorage
        const orderData = {
            orderId: orderId,
            items: this.cartItems,
            subtotal: this.subtotal,
            deliveryFee: this.deliveryFee,
            total: this.total,
            itemsCount: this.cartItems.length,
            status: 'confirming',
            timestamp: new Date().toISOString(),
            customer: customerData
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
        },
        goToOrderStatus() {
        if (this.hasActiveOrder) {
            this.$router.push('/order-status');
        }
        },
        saveCart() {
        // Save cart to localStorage for persistence
        localStorage.setItem('buffs_cart', JSON.stringify(this.cartItems));
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
        transition: all 0.2s ease;
    }

    .divide-y.divide-gray-200 > div:hover {
        background: #f5f5f5;
        border-color: #e5e5e5;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

    /* Order Summary Header */
    .bg-gradient-to-br.rounded-3xl h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: -1rem;
        padding: 0;
        line-height: 1.2;
        text-align: center;
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
        padding: 1.5rem 0 2rem 0 ;
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
        background: #FEB90E ;
        color: #1f2937 ;
        transition: all 0.2s ease;
        min-width: 200px;
    }

    .bg-gradient-to-br.rounded-3xl button:hover {
        background: #e5a70d ;
        transform: scale(1.02);
    }

    /* Info Text */
    .bg-gradient-to-br.rounded-3xl p.text-xs {
        font-size: 0.65rem;
        line-height: 1.6;
        margin: 0.5rem 0 0 0 ;
        padding: 0 ;
        letter-spacing: 0.5px;
    }

    .payment-method {
        margin-top: -1.2rem;
    }
    </style>

