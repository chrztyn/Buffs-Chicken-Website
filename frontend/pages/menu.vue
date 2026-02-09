<template>
    <div class="menu-page min-h-screen bg-[#FBF4E5] overflow-x-hidden w-full">
        <!-- Toast Notification -->
        <transition name="toast-fade">
            <div 
                v-if="notification.show"
                class="fixed top-6 right-6 z-100 flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-lg px-6 py-4 max-w-sm"
            >
                <div class="flex-shrink-0">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-800">{{ notification.title }}</p>
                    <p class="text-sm text-gray-600">{{ notification.message }}</p>
                </div>
                <button 
                    @click="notification.show = false"
                    class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </transition>

        <Navbar class="relative z-20" />

        <!-- Menu Content Section -->
        <div class="menu-content-container pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-20 md:pb-24 lg:pb-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[1920px] mx-auto w-full">
            <!-- Main Content: Left Sidebar and Right Grid -->
            <div class="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-start w-full">
                <!-- Left Sidebar (Full width on mobile/tablet, 25% on desktop) -->
                <div class="w-full lg:w-[25%] lg:flex-shrink-0">
                    <!-- Title -->
                    <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-['Unbounded'] text-[#1A4189] mb-6 sm:mb-8 lg:mb-10 leading-tight">Grab your favorites</h2>

                    <!-- Search Bar and Cart -->
                    <div class="flex flex-col gap-4 mb-8 sm:mb-10">
                        <div class="flex gap-2 sm:gap-3 items-center w-full">
                            <div class="relative flex-1 min-w-0">
                                <input 
                                    v-model="searchQuery"
                                    type="text" 
                                    placeholder="Search meals" 
                                    class="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1A4189] focus:ring-2 focus:ring-[#1A4189]/20 transition-all shadow-sm hover:shadow-md text-xs sm:text-sm"
                                />
                                <svg class="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <button 
                                @click="goToCart"
                                class="w-9 h-9 sm:w-10 sm:h-10 bg-[#FEB90E] rounded-full text-[#1A4189] hover:bg-[#e5a70d] transition-all duration-200 hover:scale-105 flex items-center justify-center flex-shrink-0 shadow-sm hover:shadow-md"
                                aria-label="View Cart"
                            >
                                <svg class="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Filter Options -->
                    <div class="filter-options">
                        <!-- Mobile Filter Dropdown Toggle -->
                        <button
                            @click="mobileFilterOpen = !mobileFilterOpen"
                            class="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-[#1A4189] hover:bg-gray-50 transition-all duration-200 mb-4"
                        >
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-[#1A4189]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                                </svg>
                                <span class="font-['Unbounded'] font-semibold text-gray-800">
                                    Filters {{ selectedFilters.length > 0 ? `(${selectedFilters.length})` : '' }}
                                </span>
                            </div>
                            <svg 
                                :class="['w-5 h-5 text-[#1A4189] transition-transform duration-300', { 'rotate-180': mobileFilterOpen }]"
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                            </svg>
                        </button>

                        <!-- Mobile Filter Dropdown Content -->
                        <transition
                            enter-active-class="transition-all duration-300 ease-out"
                            leave-active-class="transition-all duration-300 ease-in"
                            enter-from-class="opacity-0 max-h-0"
                            leave-to-class="opacity-0 max-h-0"
                        >
                            <div 
                                v-if="mobileFilterOpen"
                                class="lg:hidden bg-white border-2 border-t-0 border-gray-200 rounded-b-lg overflow-hidden mb-4"
                            >
                                <div class="p-4 space-y-3">
                                    <label 
                                        v-for="category in filterCategories" 
                                        :key="category.id"
                                        class="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                                    >
                                        <input 
                                            type="checkbox" 
                                            :value="category.id"
                                            v-model="selectedFilters"
                                            class="w-5 h-5 cursor-pointer text-[#1A4189] focus:ring-2 focus:ring-[#1A4189]/30 rounded border-gray-300 transition-all flex-shrink-0"
                                        />
                                        <span class="text-sm font-['Unbounded'] text-gray-700 group-hover:text-[#1A4189] transition-colors">{{ category.name }}</span>
                                    </label>
                                    <button
                                        @click="selectedFilters = []; mobileFilterOpen = false"
                                        v-if="selectedFilters.length > 0"
                                        class="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-['Unbounded'] font-semibold rounded-lg transition-colors text-sm"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </transition>

                        <!-- Desktop Filter Options (hidden on mobile) -->
                        <div class="hidden lg:block">
                            <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 font-['Unbounded'] tracking-tight">Filter Options</h3>
                            <div class="border-b border-gray-200 mb-4 sm:mb-6"></div>
                            <div class="filter-checkbox flex flex-col gap-2 sm:gap-4">
                                <label 
                                    v-for="category in filterCategories" 
                                    :key="category.id"
                                    class="flex items-center gap-2 sm:gap-3 cursor-pointer group py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <input 
                                        type="checkbox" 
                                        :value="category.id"
                                        v-model="selectedFilters"
                                        class="w-4 sm:w-5 h-4 sm:h-5 cursor-pointer text-[#1A4189] focus:ring-2 focus:ring-[#1A4189]/30 rounded border-gray-300 transition-all flex-shrink-0"
                                    />
                                    <span class="text-sm sm:text-base text-gray-700 font-normal font-['Unbounded'] group-hover:text-[#1A4189] transition-colors">{{ category.name }}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Main Content (Full width on mobile/tablet, 75% on desktop) -->
                <div class="flex-1 w-full lg:w-[75%] pb-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 menu-grid">
                        <MenuCard
                            v-for="item in filteredMenuItems"
                            :key="item.id"
                            :product="item"
                            @add-to-cart="handleAddToCart"
                        />
                    </div>

                    <!-- Empty State -->
                    <div v-if="filteredMenuItems.length === 0" class="text-center py-24">
                        <div class="inline-block p-4 bg-gray-100 rounded-full mb-4">
                            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <p class="text-xl font-semibold font-['Unbounded'] text-gray-600 mb-2">No items found</p>
                        <p class="text-gray-400">Try adjusting your search or filter options</p>
                    </div>
                </div>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'
import MenuCard from '~/components/MenuCard.vue'
import { useApi } from '~/composables/useApi'

export default {
  name: 'MenuPage',
  head() {
    return {
      title: 'Menu - Buffs Chicken | Order Wings, Combos & Pastas Online',
      meta: [
        {
          name: 'description',
          content: 'Browse our full menu of crispy wings, loaded combos, and cheesy pastas. Order online from Buffs Chicken at The Hood, Angeles City for fresh, flavorful comfort food.'
        },
        { name: 'keywords', content: 'menu, chicken wings, combos, pasta, food menu, order online, Angeles City' },
        { property: 'og:title', content: 'Menu - Buffs Chicken' },
        { property: 'og:type', content: 'website' }
      ]
    }
  },
  components: {
    Navbar,
    Footer,
    MenuCard
  },
  data() {
    return {
      searchQuery: '',
      selectedFilters: [],
      cartCount: 0,
      menuItems: [],
      filterCategories: [],
      loading: true,
      error: null,
      notification: {
        show: false,
        title: '',
        message: ''
      },
      mobileFilterOpen: false,
      // Pagination properties
      currentPage: 1,
      pageSize: 12,
      totalProducts: 0,
      hasMore: true,
      isLoadingMore: false
    }
  },
  async mounted() {
    // Load initial products
    await this.loadProducts(1)
    
    // Load cart count on page load
    const savedCart = localStorage.getItem('buffs_cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      this.cartCount = cartItems.length;
    }

    // Add infinite scroll listener
    window.addEventListener('scroll', this.handleScroll)
  },

  unmounted() {
    // Clean up scroll listener
    window.removeEventListener('scroll', this.handleScroll)
  },
  computed: {
    filteredMenuItems() {
      let items = this.menuItems

      // Filter by selected categories
      if (this.selectedFilters.length > 0) {
        items = items.filter(item => this.selectedFilters.includes(item.category))
      }

      // Filter by search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        items = items.filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        )
      }

      return items
    }
  },
  methods: {
    async loadProducts(page = 1) {
      try {
        const isInitialLoad = page === 1
        if (isInitialLoad) {
          this.loading = true
        } else {
          this.isLoadingMore = true
        }

        const { getProducts } = useApi()
        const response = await getProducts({
          page,
          limit: this.pageSize
        })
        
        const newProducts = response.data.data.map(product => ({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          description: product.description,
          variants: product.variants || [],
          addons: product.addons || [],
          sauces: product.sauces || []
        }))

        // Append new products (infinite scroll) or replace (initial load)
        if (page === 1) {
          this.menuItems = newProducts
        } else {
          this.menuItems.push(...newProducts)
        }

        // Update pagination state
        this.totalProducts = response.data.total || 0
        this.hasMore = this.menuItems.length < this.totalProducts
        this.currentPage = page
        
        // Extract unique categories from products on initial load
        if (isInitialLoad) {
          this.loadCategoriesFromProducts()
        }

        this.loading = false
        this.isLoadingMore = false
      } catch (error) {
        console.error('Error loading products:', error)
        this.error = 'Failed to load menu items'
        this.loading = false
        this.isLoadingMore = false
      }
    },
    loadCategoriesFromProducts() {
      const uniqueCategories = new Set()
      this.menuItems.forEach(item => {
        if (item.category) {
          uniqueCategories.add(item.category)
        }
      })
      
      // Map categories to filter format (capitalize first letter)
      this.filterCategories = Array.from(uniqueCategories).map(cat => ({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1)
      }))
    },
    async loadCategories() {
      try {
        const { getCategories } = useApi()
        const response = await getCategories()
        this.filterCategories = response.data.map(cat => ({
          id: cat._id,
          name: cat.name
        }))
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    },
    handleAddToCart(item) {
      // Load existing cart
      const savedCart = localStorage.getItem('buffs_cart');
      let cartItems = savedCart ? JSON.parse(savedCart) : [];

      // Create a unique key based on product and customizations (including sauces)
      const customizationKey = JSON.stringify({
        selectedVariants: item.selectedVariants || {},
        selectedAddons: item.selectedAddons || [],
        selectedSauces: item.selectedSauces || {}
      });

      // Check if item with same customizations already exists
      const existingItemIndex = cartItems.findIndex(
        cartItem => 
          cartItem.id === item.id && 
          cartItem.customizationKey === customizationKey &&
          cartItem.notes === (item.notes || '')
      );

      if (existingItemIndex > -1) {
        // If item exists with same customizations, increase quantity
        cartItems[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item with all customization details (including sauces)
        cartItems.push({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          notes: item.notes || '',
          selectedVariants: item.selectedVariants || {},
          selectedAddons: item.selectedAddons || [],
          selectedSauces: item.selectedSauces || {},
          basePrice: item.basePrice,
          addonsCost: item.addonsCost,
          totalPrice: item.totalPrice,
          customizationKey: customizationKey
        });
      }

      // Save updated cart to localStorage
      localStorage.setItem('buffs_cart', JSON.stringify(cartItems));
      
      this.cartCount = cartItems.length;
      console.log('Added to cart:', item);
      
      // Show professional notification
      this.showNotification(`${item.name}`, `Added ${item.quantity} item${item.quantity > 1 ? 's' : ''} to cart`);
    },
    showNotification(title, message) {
      this.notification = {
        show: true,
        title: title,
        message: message
      };
      
      // Auto-hide after 4 seconds
      setTimeout(() => {
        this.notification.show = false;
      }, 4000);
    },
    handleSearch() {
      // Search is handled by computed property
    },
    goToCart() {
      this.$router.push('/cart')
    },
    handleScroll() {
      // Check if user scrolled near bottom of page (500px from bottom)
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        // Load more products if available and not already loading
        if (this.hasMore && !this.isLoadingMore && !this.loading) {
          this.loadProducts(this.currentPage + 1)
        }
      }
    }
  }
}
</script>

<style scoped>
/* Toast Notification Animations */
.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
    .toast-fade-enter-active,
    .toast-fade-leave-active {
        transition: none;
    }
}

.toast-fade-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.toast-fade-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

/* Mobile Filter Dropdown Animation */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-300 {
    transition-duration: 300ms;
}

.ease-out {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.ease-in {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.opacity-0 {
    opacity: 0;
}

.max-h-0 {
    max-height: 0;
}

/* ============ TABLET (md breakpoint - 768px) - 2 COLUMNS ============ */
@media (min-width: 768px) and (max-width: 1023px) {
    .menu-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1.5rem;
    }
}

/* ============ LARGE DESKTOP (lg breakpoint - 1024px) - 3 COLUMNS ============ */
@media (min-width: 1024px) and (max-width: 1369px) {
    .menu-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1.5rem;
    }
}

/* ============ MENU CARD STYLES - SHORTENED ============ */
:deep(.menu-card) {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  padding: 0.875rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  max-width: 280px;
  margin: 0 auto;
  height: 220px;
}

:deep(.menu-card:hover) {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

:deep(.menu-card .image-container) {
  background: linear-gradient(135deg, #fafbfc 0%, #f3f4f6 100%);
  border-radius: 10px;
  padding: 0.5rem;
  margin-bottom: 0.625rem;
  height: 145px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: background 0.3s ease;
}

:deep(.menu-card:hover .image-container) {
  background: linear-gradient(135deg, #f0f1f3 0%, #e8eaed 100%);
}

@media (prefers-reduced-motion: reduce) {
    :deep(.menu-card) {
        transition: none;
    }
    :deep(.menu-card .image-container) {
        transition: none;
    }
}

:deep(.menu-card .image-container img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  max-width: 100%;
  max-height: 100%;
  transform: scale(1.06);
}

:deep(.menu-card:hover .image-container img) {
  transform: scale(1.1);
}

:deep(.menu-card .text-section) {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.625rem;
  padding: 0.1rem 0;
}

:deep(.menu-card .product-name) {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1a4189;
  letter-spacing: 0.3px;
  text-transform: capitalize;
  word-break: break-word;
  line-height: 1.3;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.menu-card .product-price) {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a4189;
  white-space: nowrap;
  text-align: right;
  flex-shrink: 0;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.grid > * {
    animation: fadeInUp 0.5s ease-out;
}
</style>