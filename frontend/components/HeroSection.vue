<template>
    <section class="hero-wrapper relative w-full min-h-screen overflow-hidden">
        <!-- Background Pattern -->
        <div class="background-pattern"></div>
        
        <!-- Dot Pattern - adds texture and depth -->
        <div class="dot-pattern"></div>
        
        <!-- Decorative Gradient Orbs -->
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
        
        <!-- Subtle Grid Pattern -->
        <div class="grid-overlay"></div>
        
        <div class="hero-container relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 lg:py-8 flex items-start lg:items-center">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            <!-- Content Side -->
            <div class="content-wrapper space-y-4 lg:space-y-6">

            <!-- Main Heading -->
            <div class="heading-wrapper animate-fade-in-up" style="animation-delay: 0.2s;">
                <h1 class="font-['Caprasimo'] text-[#1A4189] leading-[0.9] mb-4" style="font-size: clamp(3.5rem, 12vw, 7rem);">
                Buffs<br />
                <span class="text-[#1A4189]">Chicken</span>
                </h1>
            </div>

            <!-- Subheading -->
            <h2 class="font-['Unbounded'] font-bold text-[#FE601C] leading-tight animate-fade-in-up" 
                style="font-size: clamp(1.25rem, 5vw, 2.5rem); animation-delay: 0.3s;">
                your go-to comfort
            </h2>

            <!-- Description -->
            <p class="font-['Unbounded'] text-black/85 leading-relaxed max-w-xl text-base sm:text-lg animate-fade-in-up" 
                style="animation-delay: 0.4s;">
                Welcome to Buffs Chicken, your go-to spot at The Hood, Angeles City for the crispiest and juiciest chicken around. From signature OG Buffs wings to cheesy pastas and loaded combos, every meal is cooked fresh and packed with flavor.

            </p>

            <!-- CTA Button -->
            <div class="cta-wrapper animate-fade-in-up" style="animation-delay: 0.6s;">
                <NuxtLink to="/menu" class="cta-button group">
                <span class="relative z-10 font-['Unbounded'] font-semibold text-sm">Order Now</span>
                <div class="cta-glow"></div>
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </NuxtLink>
            </div>
            </div>

            <!-- Image Side -->
            <div class="image-wrapper relative animate-fade-in-scale" style="animation-delay: 0.3s;">
            <!-- Main image container -->
            <div class="image-container group">
                <div class="image-frame">
                <img 
                    src="/hero-main.webp" 
                    alt="Buffs Chicken" 
                    fetchpriority="high"
                    class="main-image"
                />
                
                <!-- Decorative corner accents -->
                <div class="corner-accent corner-tl"></div>
                <div class="corner-accent corner-tr"></div>
                <div class="corner-accent corner-bl"></div>
                <div class="corner-accent corner-br"></div>
                </div>

                <!-- Floating stats cards -->
                <div class="stat-card stat-card-1">
                <div class="stat-number">4.9</div>
                <div class="stat-label">★ Rating</div>
                </div>
                
                <div class="stat-card stat-card-2">
                <div class="stat-number">100+</div>
                <div class="stat-label">Daily Orders</div>
                </div>
            </div>

            <!-- Decorative star -->
            <div class="floating-star">
                <img src="/hero-star.png" alt="Star" class="w-20 h-20 animate-spin-slow" />
            </div>
            </div>

        </div>
        </div>

    </section>
</template>

    <script>
    export default {
    name: 'HeroSection'
    };
    </script>

    <style scoped>

    /* Background Base  */
    .hero-wrapper {
        background: 
            linear-gradient(160deg, #FEF9F0 0%, #FBF4E5 25%, #F8EDD8 50%, #F5E8D0 75%, #FEF9F0 100%);
        position: relative;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
    }

    /* Background Pattern */
    .background-pattern {
        position: absolute;
        inset: 0;
        background-image: 
            radial-gradient(ellipse 120% 80% at 10% 20%, rgba(254, 96, 28, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 100% 70% at 90% 80%, rgba(26, 65, 137, 0.1) 0%, transparent 45%),
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(254, 185, 14, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 70% 30%, rgba(254, 185, 14, 0.08) 0%, transparent 30%);
        background-size: 100% 100%;
        opacity: 1;
        z-index: 0;
    }

    /* Gradient Orbs */
    .gradient-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(70px);
        opacity: 0.65;
        animation: float-orb 20s ease-in-out infinite;
        z-index: 0;
    }

    .orb-1 {
        width: 550px;
        height: 550px;
        background: radial-gradient(circle, rgba(230, 112, 61, 0.35) 0%, rgba(221, 108, 60, 0.08) 40%, transparent 70%);
        top: -200px;
        left: -150px;
        animation-delay: 0s;
    }

    .orb-2 {
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(26, 65, 137, 0.526) 0%, rgba(26, 65, 137, 0.06) 40%, transparent 70%);
        bottom: -150px;
        right: -100px;
        animation-delay: -7s;
    }

    .orb-3 {
        width: 420px;
        height: 420px;
        background: radial-gradient(circle, rgba(254, 185, 14, 0.3) 0%, rgba(254, 185, 14, 0.06) 40%, transparent 70%);
        top: 50%;
        right: 15%;
        animation-delay: -14s;
    }

    @keyframes float-orb {
        0%, 100% {
            transform: translate(0, 0) scale(1);
        }
        33% {
            transform: translate(30px, -30px) scale(1.1);
        }
        66% {
            transform: translate(-30px, 30px) scale(0.9);
        }
    }

    /* Grid Overlay - subtle professional grid with vignette */
    .grid-overlay {
        position: absolute;
        inset: 0;
        background-image: 
            linear-gradient(rgba(26, 65, 137, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26, 65, 137, 0.04) 1px, transparent 1px);
        background-size: 48px 48px;
        opacity: 0.8;
        z-index: 0;
        mask-image: radial-gradient(ellipse 90% 60% at 50% 40%, black 30%, transparent 85%);
    }

    /* Decorative diagonal stripes */
    .hero-wrapper::before {
        content: '';
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 80px,
            rgba(26, 65, 137, 0.015) 80px,
            rgba(26, 65, 137, 0.015) 81px
        );
        z-index: 0;
        pointer-events: none;
        mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black 20%, transparent 70%);
    }

    /* Dot pattern */
    .dot-pattern {
        position: absolute;
        inset: 0;
        background-image: radial-gradient(
            circle at center,
            rgba(26, 65, 137, 0.06) 1px,
            transparent 1px
        );
        background-size: 24px 24px;
        z-index: 0;
        opacity: 0.7;
        mask-image: radial-gradient(ellipse 85% 55% at 50% 45%, black 25%, transparent 80%);
    }

    @keyframes float {
    0%, 100% {
        transform: translate(0, 0) scale(1);
    }
    33% {
        transform: translate(50px, -50px) scale(1.1);
    }
    66% {
        transform: translate(-50px, 50px) scale(0.9);
    }
    }


    @keyframes rotate-shape {
    0%, 100% {
        transform: rotate(0deg) scale(1);
    }
    50% {
        transform: rotate(180deg) scale(1.2);
    }
    }


    /* CTA Button */
    .cta-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    background: linear-gradient(135deg, #FE601C 30%, #FEB90E 100%);
    color: #1A4189;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(254, 96, 28, 0.25);
    }

    .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(254, 96, 28, 0.4);
    }

    .cta-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(254, 96, 28, 0.3);
    }

    .cta-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.019) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    }

    .cta-button:hover .cta-glow {
    opacity: 1;
    }

    .arrow-icon {
    width: 18px;
    height: 18px;
    color: #1A4189;
    transition: transform 0.3s ease;
    }

    .cta-button:hover .arrow-icon {
    transform: translateX(4px);
    }


    /* Image Wrapper */
    .image-wrapper {
    position: relative;
    max-width: 600px;
    margin: 0 auto;
    }

    /* Image Container */
    .image-container {
    position: relative;
    z-index: 1;
    }

    .image-frame {
    position: relative;
    border-radius: 30px;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    padding: 8px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.4s ease;
    }

    .image-container:hover .image-frame {
    transform: translateY(-10px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
    }

    .main-image {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 24px;
    transition: transform 0.4s ease;
    }

    .image-container:hover .main-image {
    transform: scale(1.05);
    }

    /* Corner Accents */
    .corner-accent {
    position: absolute;
    width: 40px;
    height: 40px;
    opacity: 0.6;
    transition: all 0.4s ease;
    }

    .corner-tl {
    top: -2px;
    left: -2px;
    border-right: none;
    border-bottom: none;
    border-top-left-radius: 8px;
    }

    .corner-tr {
    top: -2px;
    right: -2px;
    border-left: none;
    border-bottom: none;
    border-top-right-radius: 8px;
    }

    .corner-bl {
    bottom: -2px;
    left: -2px;
    border-right: none;
    border-top: none;
    border-bottom-left-radius: 8px;
    }

    .corner-br {
    bottom: -2px;
    right: -2px;
    border-left: none;
    border-top: none;
    border-bottom-right-radius: 8px;
    }

    .image-container:hover .corner-accent {
    opacity: 1;
    transform: scale(1.2);
    }

    /* Stat Cards */
    .stat-card {
    position: absolute;
    padding: 16px 24px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
    z-index: 2;
    }

    .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }

    .stat-card-1 {
    top: 10%;
    right: -40px;
    animation: float-card 3s ease-in-out infinite;
    }

    .stat-card-2 {
    bottom: 15%;
    left: -40px;
    animation: float-card 3s ease-in-out infinite reverse;
    animation-delay: -1.5s;
    }

    .stat-number {
    font-family: 'Unbounded', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: #FE601C;
    line-height: 1;
    margin-bottom: 4px;
    }

    .stat-label {
    font-family: 'Unbounded', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: #7A3C00;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    }

    @keyframes float-card {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
    }

    /* Floating Star */
    .floating-star {
    position: absolute;
    top: -30px;
    right: 50px;
    z-index: 3;
    animation: float-star 6s ease-in-out infinite;
    }

    @keyframes float-star {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-20px) rotate(180deg);
    }
    }

    @keyframes animate-spin-slow {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
    }

    .animate-spin-slow {
    animation: animate-spin-slow 20s linear infinite;
    }

    /* Fade In Animations */
    @keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
    }

    @keyframes fade-in-scale {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
    }

    .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out both;
    }

    .animate-fade-in-scale {
    animation: fade-in-scale 1s ease-out both;
    }

    /* Responsive Adjustments */
    @media (max-width: 1023px) {
    .stat-card-1 {
        right: -20px;
    }
    
    .stat-card-2 {
        left: -20px;
    }
    }

    @media (max-width: 768px) {
    .gradient-orb {
        filter: blur(50px);
        opacity: 0.5;
    }
    
    .orb-1 {
        width: 380px;
        height: 380px;
    }
    
    .orb-2 {
        width: 320px;
        height: 320px;
    }
    
    .orb-3 {
        width: 260px;
        height: 260px;
    }
    
    .stat-card {
        padding: 12px 18px;
    }
    
    .stat-number {
        font-size: 1.5rem;
    }
    
    .stat-label {
        font-size: 0.7rem;
    }
    
    .floating-star {
        top: -20px;
        right: 20px;
    }
    
    .floating-star img {
        width: 60px;
        height: 60px;
    }
    }
    </style>