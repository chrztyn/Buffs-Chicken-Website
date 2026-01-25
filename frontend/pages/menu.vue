<template>
    <div class="menu-page min-h-screen bg-[#FBF4E5] overflow-x-hidden w-full">
        <Navbar class="relative z-20" />

        <!-- Menu Content Section -->
        <div class="menu-content-container pt-16 pb-24 md:pb-32 px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 max-w-[1920px] mx-auto">
            <!-- Main Content: Left Sidebar and Right Grid -->
            <div class="flex flex-col lg:flex-row gap-10 lg:gap-14 xl:gap-20 items-start">
                <!-- Left Sidebar (25-30% width) -->
                <div class="w-full lg:w-[28%] xl:w-[25%] flex-shrink-0">
                    <!-- Title -->
                    <h2 class="text-4xl md:text-5xl font-['Caprasimo'] text-[#1A4189] mb-10 leading-tight">Grab your favorites</h2>

                    <!-- Search Bar and Cart -->
                    <div class="flex flex-col gap-4 mb-10">
                        <div class="flex gap-3 items-center">
                            <div class="relative flex-1">
                                <input 
                                    v-model="searchQuery"
                                    type="text" 
                                    placeholder="Search for meals" 
                                    class="w-full px-4 py-2.5 rounded-full border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1A4189] focus:ring-2 focus:ring-[#1A4189]/20 transition-all shadow-sm hover:shadow-md text-sm"
                                />
                                <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <button 
                                @click="goToCart"
                                class="w-10 h-10 bg-[#FEB90E] rounded-full text-[#1A4189] hover:bg-[#e5a70d] transition-all duration-200 hover:scale-105 flex items-center justify-center shrink-0"
                                aria-label="View Cart"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Filter Options -->
                    <div class="filter-options">
                        <h3 class="text-lg font-bold text-gray-800 mb-4 font-['Unbounded'] tracking-tight">Filter Options</h3>
                        <div class="border-b border-gray-200 mb-6"></div>
                        <div class="filter-checkbox flex flex-col gap-4">
                            <label 
                                v-for="category in filterCategories" 
                                :key="category.id"
                                class="flex items-center gap-3 cursor-pointer group py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <input 
                                    type="checkbox" 
                                    :value="category.id"
                                    v-model="selectedFilters"
                                    class="w-5 h-5 cursor-pointer text-[#1A4189] focus:ring-2 focus:ring-[#1A4189]/30 rounded border-gray-300 transition-all"
                                />
                                <span class="text-gray-700 font-normal font-['Unbounded'] group-hover:text-[#1A4189] transition-colors">{{ category.name }}</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Right Main Content (70-75% width) -->
                <div class="flex-1 w-full lg:w-[72%] xl:w-[75%] pb-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 lg:gap-8">
                        <MenuCard
                            v-for="item in filteredMenuItems"
                            :key="item.id"
                            :image="item.image"
                            :name="item.name"
                            :price="item.price"
                            :description="item.description"
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

export default {
  name: 'MenuPage',
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
      filterCategories: [
        { id: 'wings', name: 'Wings' },
        { id: 'sandwiches', name: 'Sandwiches' },
        { id: 'combos', name: 'Combos' },
        { id: 'sides', name: 'Sides' }
      ],
      menuItems: [
        {
          id: 1,
          name: 'OG Flavored Wings',
          price: 230,
          image: '/og-flavored-wings.png',
          category: 'wings',
          description: 'Signature crispy wings with our OG flavor'
        },
        {
          id: 2,
          name: 'Chicken Poppers',
          price: 215,
          image: '/chicken-poppers.png',
          category: 'sides',
          description: 'Crispy bite-sized chicken pieces'
        },
        {
          id: 3,
          name: 'Chicken Sandwich',
          price: 260,
          image: '/chicken-sandwich.png',
          category: 'sandwiches',
          description: 'Juicy chicken breast in a soft bun'
        },
        {
          id: 4,
          name: 'Poppers and Fries',
          price: 240,
          image: '/poppers-and-fries.png',
          category: 'combos',
          description: 'Chicken poppers served with crispy fries'
        },
        {
          id: 5,
          name: 'Buffalo Wings',
          price: 245,
          image: '/og-flavored-wings.png',
          category: 'wings',
          description: 'Spicy buffalo sauce wings'
        },
        {
          id: 6,
          name: 'Honey Mustard Wings',
          price: 245,
          image: '/og-flavored-wings.png',
          category: 'wings',
          description: 'Sweet and tangy honey mustard wings'
        },
        {
          id: 7,
          name: 'BBQ Wings',
          price: 245,
          image: '/og-flavored-wings.png',
          category: 'wings',
          description: 'Smoky BBQ flavored wings'
        },
        {
          id: 8,
          name: 'Spicy Chicken Sandwich',
          price: 270,
          image: '/chicken-sandwich.png',
          category: 'sandwiches',
          description: 'Spicy chicken with special sauce'
        },
        {
          id: 9,
          name: 'Classic Combo',
          price: 280,
          image: '/poppers-and-fries.png',
          category: 'combos',
          description: 'Wings, fries, and drink'
        },
        {
          id: 10,
          name: 'Family Combo',
          price: 450,
          image: '/poppers-and-fries.png',
          category: 'combos',
          description: 'Perfect for sharing with the family'
        },
        {
          id: 11,
          name: 'Crispy Fries',
          price: 120,
          image: '/poppers-and-fries.png',
          category: 'sides',
          description: 'Golden crispy fries'
        },
        {
          id: 12,
          name: 'Onion Rings',
          price: 130,
          image: '/chicken-poppers.png',
          category: 'sides',
          description: 'Crispy battered onion rings'
        }
      ]
    }
  },
  mounted() {
    // Load cart count on page load
    const savedCart = localStorage.getItem('buffs_cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      this.cartCount = cartItems.length;
    }
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
    handleAddToCart(item) {
      // Load existing cart
      const savedCart = localStorage.getItem('buffs_cart');
      let cartItems = savedCart ? JSON.parse(savedCart) : [];

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(
        cartItem => cartItem.name === item.name && cartItem.notes === (item.notes || '')
      );

      if (existingItemIndex > -1) {
        // If item exists, increase quantity
        cartItems[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item with quantity
        cartItems.push({
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          notes: item.notes || '',
          totalPrice: item.totalPrice
        });
      }

      // Save updated cart to localStorage
      localStorage.setItem('buffs_cart', JSON.stringify(cartItems));
      
      this.cartCount = cartItems.length;
      console.log('Added to cart:', item);
      alert('Item added to cart!');
    },
    handleSearch() {
      // Search is handled by computed property
    },
    goToCart() {
      this.$router.push('/cart')
    }
  }
}
</script>

<style scoped>
/* ============ MENU CARD STYLES - SHORTENED ============ */
:deep(.menu-card) {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  padding: 0.875rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  max-width: 280px;
  margin: 0 auto;
  height: 165px;
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
  height: 95px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s ease;
}

:deep(.menu-card:hover .image-container) {
  background: linear-gradient(135deg, #f0f1f3 0%, #e8eaed 100%);
}

:deep(.menu-card .image-container img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  max-width: 85%;
  max-height: 85%;
}

:deep(.menu-card:hover .image-container img) {
  transform: scale(1.06);
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