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
        </header>

        <div class="popular-picks-grid grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto justify-items-center relative z-10">
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
            name: 'Chicken Poppers Meal',
            price: 215,
            image: '/chicken-poppers.png',
            },
            {
            id: 2,
            name: 'OG Flavored Wings Meal',
            price: 230,
            image: '/og-flavored-wings.png',
            },
            {
            id: 3,
            name: 'Chicken Sandwich Meal',
            price: 260,
            image: '/chicken-sandwich.png',
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