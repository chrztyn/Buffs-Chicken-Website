<template>
    <div 
        class="food-card bg-[#F8F4ED] rounded-2xl px-4 pt-4 pb-4 relative w-72 h-96 flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300"
    >
        <!-- Add to Cart: yellow bag icon, top-right -->
        <div class="flex justify-end items-start mb-2 z-10">
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
        <div class="food-card-img-wrap flex-1 flex items-center justify-center overflow-hidden rounded-lg mb-3 bg-gray-200">
        <img 
    	    :src="image" 
    	    :alt="name" 
    	    width="400"
    	    height="400"
    	    loading="lazy"
    	    class="w-full h-full object-cover"
    	    @error="(e) => { e.target.style.display = 'none'; }"
    	/>
        <svg v-if="!image" class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        </div>
        <!-- Pills below image: name left, price right, one line -->
        <div class="food-card-footer flex flex-nowrap gap-2 items-center justify-between">
        <span class="min-w-0 flex-1 inline-flex items-center justify-center px-2.5 py-1 bg-[#FEB90E] text-[#1A4189] rounded-full text-xs font-semibold font-['Unbounded']">
            {{ name }}
        </span>
        <span class="inline-flex px-2.5 py-1 bg-[#1A4189] text-white rounded-full text-xs font-bold shrink-0">
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