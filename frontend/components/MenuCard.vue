<template>
    <div>
        <div 
            @click="disabled ? null : openModal()"
            :class="[
                'menu-card bg-white rounded-2xl p-2 sm:p-2.5 flex flex-col shadow-sm transition-all duration-300 border border-gray-100 group',
                disabled 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-xl hover:border-gray-200 cursor-pointer'
            ]"
        >
            <!-- Image Section -->
            <div class="image-container rounded-xl p-1 sm:p-1.5 mb-2 sm:mb-2.5 flex items-center justify-center overflow-hidden transition-colors duration-300">
                <NuxtImg 
                    :src="image" 
                    :alt="name" 
                    width="300"
                    height="300"
                    loading="lazy"
                    sizes="sm:100vw md:50vw lg:33vw"
                    format="webp"
                    :class="[
                        'w-full h-32 sm:h-40 object-contain transition-transform duration-300',
                        disabled ? 'grayscale' : 'group-hover:scale-105'
                    ]"
                />
            </div>
            
            <!-- Text Section: Name on left, Price on right -->
            <div class="text-section flex items-start justify-between gap-2 px-1 sm:px-1.5 pb-1.5 sm:pb-2 pt-0">
                <span class="product-name text-xs sm:text-sm font-bold text-[#1A4189] font-['Unbounded'] tracking-tight leading-snug flex-1">
                    {{ name }}
                </span>
                <span class="product-price text-xs sm:text-sm font-bold text-[#FE601C] font-['Unbounded'] tracking-tight whitespace-nowrap flex-shrink-0 mt-0.5">
                    ₱{{ price }}
                </span>
            </div>
            
            <!-- Description Section -->
            <div class="description-section flex-1 px-1 sm:px-1.5 pb-2 sm:pb-2.5 min-h-0 flex flex-col">
                <p class="product-description text-gray-600 font-['Unbounded'] leading-relaxed">
                    {{ description }}
                </p>
            </div>

            <!-- Disabled Overlay Badge -->
            <div 
                v-if="disabled"
                class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold font-['Unbounded'] px-2 py-1 rounded-full"
            >
                Closed
            </div>
        </div>

        <!-- Modal -->
        <MenuModal
            :isOpen="isModalOpen"
            :item="product"
            :disabled="disabled"
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
        product: {
            type: Object,
            required: true,
            properties: {
                id: String,
                name: String,
                price: Number,
                image: String,
                description: String,
                category: String,
                variants: Array,
                addons: Array
            }
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        image() {
            return this.product.image;
        },
        name() {
            return this.product.name;
        },
        price() {
            return this.product.price;
        },
        description() {
            return this.product.description;
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
    min-height: 320px;
    transition: transform 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.menu-card:hover {
    transform: translateY(-4px);
}

.image-container {
    min-height: 160px;
    flex-shrink: 0;
}

.text-section {
    flex-shrink: 0;
}

.product-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.product-price {
    color: #FE601C;
}

.description-section {
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.product-description {
    font-size: 0.65rem;
    line-height: 1.4;
    color: #6b7280;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
}

/* Small Mobile (375px) */
@media (min-width: 375px) {
    .menu-card {
        min-height: 340px;
    }
    
    .image-container {
        min-height: 180px;
    }
    
    .product-description {
        font-size: 0.7rem;
        line-height: 1.45;
        -webkit-line-clamp: 3;
        line-clamp: 3;
    }
}

/* Tablet (640px) */
@media (min-width: 640px) {
    .menu-card {
        min-height: 360px;
    }
    
    .image-container {
        min-height: 200px;
    }
    
    .product-name {
        font-size: 0.95rem;
    }

    .product-price {
        font-size: 0.95rem;
    }
    
    .product-description {
        font-size: 0.75rem;
        line-height: 1.5;
        -webkit-line-clamp: 4;
        line-clamp: 4;
    }
}

/* Desktop (1024px) */
@media (min-width: 1024px) {
    .menu-card {
        min-height: 480px;
    }
    
    .image-container {
        min-height: 240px;
    }
    
    .product-description {
        font-size: 0.8rem;
        line-height: 1.6;
        -webkit-line-clamp: 4;
        line-clamp: 4;
    }
}
</style>
