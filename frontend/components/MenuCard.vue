<template>
    <div>
        <div 
            @click="openModal"
            class="menu-card bg-white rounded-2xl p-3 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 group cursor-pointer"
        >
            <!-- Image Section -->
            <div class="image-container rounded-xl p-2 mb-2 flex items-center justify-center overflow-hidden transition-colors duration-300">
                <img 
                    :src="image" 
                    :alt="name" 
                    class="w-full h-40 object-contain transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            
            <!-- Text Section: Name on left, Price on right -->
            <div class="text-section flex items-center justify-between px-1 pb-0 pt-0">
                <span class="product-name text-lg font-bold text-[#1A4189] font-['Unbounded'] tracking-tight leading-tight">
                    {{ name }}
                </span>
                <span class="product-price text-base font-bold text-gray-800 font-['Unbounded'] tracking-tight">
                    P{{ price }}
                </span>
            </div>
            
            <!-- Description Section -->
            <div class="description-section px-1 pt-2">
                <span class="product-description text-gray-600 font-['Unbounded']">
                    {{ description }}
                </span>
            </div>
        </div>

        <!-- Modal -->
        <MenuModal
            :isOpen="isModalOpen"
            :item="{ name, price, image, description }"
            @close="closeModal"
            @add-to-cart="handleAddToCart"
        />
    </div>
</template>

<script>
import MenuModal from './MenuModal.vue';

export default {
    name: 'MenuCard',
    components: {
        MenuModal
    },
    data() {
        return {
            isModalOpen: false
        };
    },
    props: {
        image: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: false
        }
    },
    methods: {
        openModal() {
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
        },
        handleAddToCart(itemData) {
            this.$emit('add-to-cart', itemData);
        }
    }
};
</script>

<style scoped>
.menu-card {
    min-height: 300px;
    transition: transform 0.3s ease;
}

.menu-card:hover {
    transform: translateY(-4px);
}

.image-container {
    min-height: 220px;
}

.product-description {
    font-size: 8px;
    line-height: 1;
    padding-bottom: 8px;
    margin-left: -4px;
}

.description-section {
  margin-top: -0.5rem; /* moves it upward */
  padding-left: 0.25rem; /* same as px-1 */
  padding-top: 0; /* remove any extra padding at the top */
}
</style>
