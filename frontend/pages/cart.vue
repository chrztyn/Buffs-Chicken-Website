<template>
    <div class="menu-page min-h-screen bg-[#FBF4E5] overflow-x-hidden w-full">
            <Navbar class="relative z-20" />
        <Cart @place-order="handlePlaceOrder" />
        <Footer />
    </div>
</template>

<script setup>
useSeoMeta({ robots: 'noindex, nofollow' })
</script>

    <script>
    import Navbar from '~/components/Navbar.vue';
    import Cart from '~/components/Cart.vue';
    import Footer from '~/components/Footer.vue';

    export default {
    name: 'CartPage',
    components: {
        Navbar,
        Cart,
        Footer
    },
    methods: {
        handlePlaceOrder(orderData) {
        console.log('Order placed:', orderData);
        }
    }
    };
    </script>

    <style scoped>
    .cart-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    }
    </style>