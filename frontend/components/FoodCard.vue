<template>
    <div 
        class="food-card bg-[#F8F4ED] rounded-2xl px-5 pt-5 pb-6 relative w-full max-w-30px flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300"
    >
        <!-- Add to Cart: yellow bag icon, top-right -->
        <div class="flex justify-end items-start mb-2">
        <button 
            @click="addToCart"
            class="w-10 h-10 bg-[#FEB90E] rounded-full text-[#1A4189] hover:bg-[#e5a70d] transition-all duration-200 hover:scale-105 flex items-center justify-center shrink-0"
            aria-label="Add to cart"
        >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
        </button>
        </div>
        
        <!-- Image -->
        <div class="food-card-img-wrap">
        <img 
            :src="image" 
            :alt="name" 
            class="w-full h-64 object-contain"
        />
        </div>
        <!-- Pills below image: name left, price right, one line -->
        <div class="food-card-footer flex flex-nowrap gap-2 items-center justify-between">
        <span class="min-w-0 w-50 inline-flex items-center justify-center px-2.5 py-1 bg-[#FEB90E] text-gray-[#1A4189] rounded-full text-xs font-semibold font-['Unbounded']">
            {{ name }}
        </span>
        <span class="inline-flex w-15 items-center justify-center px-2.5 py-1 bg-[#1A4189] text-white rounded-full text-xs font-bold shrink-0">
            ₱{{ price }}
        </span>
        </div>
    </div>
</template>

    <script>
    export default {
    name: 'FoodCard',
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
    },
    methods: {
        addToCart() {
        this.$emit('add-to-cart', { 
            name: this.name, 
            price: this.price,
            image: this.image 
        });
        }
    }
    };
    </script>