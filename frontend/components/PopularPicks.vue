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
            class="w-35 h-6 view-full-menu group mt-4 inline-flex items-center justify-center gap-1 rounded-full px-3 py-1.5 bg-[#FEB90E] text-[#1A4189] font-['Unbounded'] text-[10px] font-semibold hover:bg-[#FE601C] hover:text-white transition-colors uppercase tracking-wider border border-white/30"

        >
            View full menu
        </NuxtLink>
        </header>

        <div class="popular-picks-grid grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto justify-items-center relative z-10">
        <FoodCard
            v-for="item in popularItems"
            :key="item.id"
            :image="item.image"
            :name="item.name"
            :price="item.price"
            @add-to-cart="handleAddToCart"
        />
        </div>
    </section>
    </template>

    <script>
    import FoodCard from './FoodCard.vue';

    export default {
    name: 'PopularPicks',
    components: {
        FoodCard
    },
    data() {
        return {
        popularItems: [
            {
            id: 1,
            name: 'Chicken Poppers',
            price: 215,
            image: '/chicken-poppers.png',
            },
            {
            id: 2,
            name: 'OG Flavored Wings',
            price: 230,
            image: '/og-flavored-wings.png',
            },
            {
            id: 3,
            name: 'Chicken Sandwich',
            price: 260,
            image: '/chicken-sandwich.png',
            },
            {
            id: 4,
            name: 'Poppers and Fries',
            price: 240,
            image: '/poppers-and-fries.png',
            },
        ]
        };
    },
    methods: {
        handleAddToCart(item) {
        console.log('Added to cart:', item);
        }
    }
    };
    </script>