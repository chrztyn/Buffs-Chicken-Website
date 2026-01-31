<template>
    <div class="relative overflow-hidden flex items-center justify-center w-full min-h-screen">
        <!-- Background Image -->
        <img
            src="/about-photo.jpg"
            alt="About Background"
            class="about-bg-image absolute inset-0 w-full h-full object-cover z-0"
            style="object-position: center;"
        />
        
        <!-- Cream Overlay -->
        <div class="about-overlay absolute inset-0 bg-[rgba(251,244,229,0.82)] z-0"></div>
        
        <!-- Cards Container -->
        <div class="cards-container relative w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-14 md:py-16 lg:py-20 max-w-6xl mx-auto z-10 lg:-mt-20">
            <div class="card card-left mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                <h2 class="card-title font-['Caprasimo'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-5 md:mb-6">Who we are</h2>
                <p class="card-content text-sm sm:text-base md:text-lg leading-relaxed">
                    Buffs Chicken started in Malolos, Bulacan with one goal—to serve juicy,
                    flavorful chicken that's worth every peso. After moving to Angeles City in
                    March 2025, Buffs has found its perfect home among food-loving students and
                    young professionals.
                </p>
            </div>

            <div class="card card-right mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                <h2 class="card-subtitle font-['Unbounded'] text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 sm:mb-5 md:mb-6">Our Mission</h2>
                <p class="card-content text-sm sm:text-base md:text-lg leading-relaxed">
                    To deliver high-quality, flavor-packed meals that bring people together—whether
                    at The Hood, during pop-ups, or from the comfort of your own home.
                </p>
            </div>

            <div class="card card-left">
                <h2 class="card-subtitle font-['Unbounded'] text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 sm:mb-5 md:mb-6">Our Vision</h2>
                <p class="card-content text-sm sm:text-base md:text-lg leading-relaxed">
                    To become a local favorite chicken destination across Pampanga, known for bold
                    flavors, great prices, and unbeatable service.
                </p>
            </div>
        </div>
    </div>
</template>