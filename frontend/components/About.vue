<template>
    <div class="relative overflow-hidden flex items-center justify-center w-full" style="height: 100vh; min-height: 100vh; margin-top: -5rem;">
        <!-- Background Image -->
        <img
            src="/about-photo.jpg"
            alt="About Background"
            class="about-bg-image absolute inset-0 w-full h-full object-cover z-0"
            style="object-position: center; width: 100vw; height: 100vh; min-height: 100vh; left: 0; right: 0; top: 0; bottom: 0;"
        />
        
        <!-- Cream Overlay -->
        <div class="about-overlay absolute inset-0 bg-[rgba(251,244,229,0.82)] z-0" style="width: 100vw; height: 100vh; min-height: 100vh; left: 0; right: 0; top: 0; bottom: 0;"></div>
        
        <!-- Cards Container -->
        <div class="cards-container relative w-full py-12 px-6 max-w-6xl mx-auto z-10" style="margin-top: 8rem; padding-top: 2rem;">
            <div class="card card-left">
                <h2 class="card-title font-['Caprasimo']">Who we are</h2>
                <p class="card-content">
                    Buffs Chicken started in Malolos, Bulacan with one goal—to serve juicy,
                    flavorful chicken that's worth every peso. After moving to Angeles City in
                    March 2025, Buffs has found its perfect home among food-loving students and
                    young professionals.
                </p>
            </div>

            <div class="card card-right">
                <h2 class="card-subtitle font-['Unbounded']">Our Mission</h2>
                <p class="card-content">
                    To deliver high-quality, flavor-packed meals that bring people together—whether
                    at The Hood, during pop-ups, or from the comfort of your own home.
                </p>
            </div>

            <div class="card card-left">
                <h2 class="card-subtitle font-['Unbounded']">Our Vision</h2>
                <p class="card-content">
                    To become a local favorite chicken destination across Pampanga, known for bold
                    flavors, great prices, and unbeatable service.
                </p>
            </div>
        </div>
    </div>
</template>