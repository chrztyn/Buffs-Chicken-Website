<template>
    <!-- Toast Notification -->
    <transition name="toast-fade">
        <div
            v-if="notification.show"
            @click="$router.push('/menu'); notification.show = false"
            class="fixed top-6 right-6 z-[200] flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-lg px-6 py-4 max-w-sm cursor-pointer hover:shadow-xl transition-shadow"
        >
            <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <div class="flex-1">
                <p class="font-semibold text-gray-800">{{ notification.title }}</p>
                <p class="text-sm text-gray-600">{{ notification.message }}</p>
                <p class="text-xs text-green-600 font-semibold mt-0.5">Tap to view menu →</p>
            </div>
            <button
                @click.stop="notification.show = false"
                class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    </transition>

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

        <div class="popular-picks-grid grid grid-cols-1 md:grid-cols-2 min-[1400px]:grid-cols-4 gap-8 max-w-7xl mx-auto justify-items-center relative z-10">
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
      :product="selectedProduct" 
      @close="closeMenuModal"
      @added="handleAfterAdd"
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
    const notification = ref({ show: false, title: '', message: '' });
    let notifTimer = null;

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

    const handleAfterAdd = () => {
      closeMenuModal();
      navigateTo('/menu');
    };

    onMounted(() => {
      loadPopularPicks();
    });
    </script>

<style scoped>
/* Toast transition */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

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