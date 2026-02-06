<template>
    <section class="popular-picks-section relative overflow-hidden">
        <!-- Decorative background layers -->
        <div class="popular-picks-bg" aria-hidden="true" />
        <div class="popular-picks-glow popular-picks-glow--1" aria-hidden="true" />
        <div class="popular-picks-glow popular-picks-glow--2" aria-hidden="true" />
        <div class="popular-picks-dots" aria-hidden="true" />

        <header class="popular-picks-header relative z-10">
        <p class="popular-picks-subtitle">Customer favorites</p>
        <h2 class="popular-picks-title">Popular Picks</h2>
        <NuxtLink
            to="/menu"
            class="view-full-menu inline-flex items-center justify-center gap-1.5 rounded-full mt-4 px-4 py-2 bg-[#FEB90E] text-[#1A4189] font-['Unbounded'] text-xs font-semibold hover:bg-[#FE601C] hover:text-white transition-all duration-200 hover:shadow-lg active:scale-95 uppercase tracking-wider"
        >
            View full menu
        </NuxtLink>
        </header>

        <div class="popular-picks-grid grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto justify-items-center relative z-10">
        <div
            v-for="item in popularItems"
            :key="item._id"
            class="cursor-pointer transform transition-transform hover:scale-105"
            @click="openMenuModal(item)"
        >
            <FoodCard
                :image="item.image"
                :name="item.name"
                :price="item.price"
                @add-to-cart="() => {}"
            />
        </div>
        </div>
    </section>
    
    <MenuModal 
      v-if="isModalOpen && selectedProduct"
      :is-open="isModalOpen" 
      :item="selectedProduct" 
      @close="closeMenuModal"
      @add-to-cart="handleAddToCart"
    />
    </template>

    <script setup>
    import { ref, onMounted } from 'vue';
    import FoodCard from './FoodCard.vue';
    import MenuModal from './MenuModal.vue';
    import { useApi } from '~/composables/useApi';

    const popularItems = ref([]);
    const selectedProduct = ref(null);
    const isModalOpen = ref(false);
    const loading = ref(true);

    const { getPopularPicks } = useApi();

    const loadPopularPicks = async () => {
      try {
        loading.value = true;
        const response = await getPopularPicks();
        popularItems.value = response.data;
      } catch (error) {
        console.error('Failed to load popular picks:', error);
        // Fallback to default items if loading fails
        popularItems.value = [];
      } finally {
        loading.value = false;
      }
    };

    const openMenuModal = (product) => {
      selectedProduct.value = product;
      isModalOpen.value = true;
    };

    const closeMenuModal = () => {
      isModalOpen.value = false;
      selectedProduct.value = null;
    };

    const handleAddToCart = (cartData) => {
      // Get existing cart from localStorage
      const existingCart = localStorage.getItem('buffs_cart');
      const cart = existingCart ? JSON.parse(existingCart) : [];
      
      // Add new item to cart
      cart.push(cartData);
      
      // Save back to localStorage
      localStorage.setItem('buffs_cart', JSON.stringify(cart));
      
      // Dispatch custom event to notify navbar of cart changes
      if (process.client) {
        window.dispatchEvent(new Event('cart-updated'));
      }
      
      // Close modal
      closeMenuModal();
    };

    onMounted(() => {
      loadPopularPicks();
    });
    </script>

<style scoped>
.popular-picks-section {
  padding: 2rem 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .popular-picks-section {
    padding: 3rem 1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 768px) {
  .popular-picks-section {
    padding: 4rem 2rem;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 1024px) {
  .popular-picks-section {
    padding: 5rem 2rem;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 1280px) {
  .popular-picks-section {
    padding: 6rem 4rem;
    padding-left: 4rem;
    padding-right: 4rem;
  }
}
</style>