<template>
    <div class="about-section relative overflow-hidden flex items-center justify-center w-full min-h-screen">
        <!-- Background Image -->
        <img
            src="/about-photo.jpg"
            alt="About Background"
            class="about-bg-image"
        />
        
        <!-- Cream Overlay -->
        <div class="about-overlay"></div>
        
        <!-- Cards Container -->
        <div class="cards-container">
            <div class="card">
                <h2 class="card-title">Who we are</h2>
                <p class="card-content">
                    Buffs Chicken started in Malolos, Bulacan with one goal—to serve juicy,
                    flavorful chicken that's worth every peso. After moving to Angeles City in
                    March 2025, Buffs has found its perfect home among food-loving students and
                    young professionals.
                </p>
            </div>

            <div class="card">
                <h2 class="card-subtitle">Our Mission</h2>
                <p class="card-content">
                    To deliver high-quality, flavor-packed meals that bring people together—whether
                    at The Hood, during pop-ups, or from the comfort of your own home.
                </p>
            </div>

            <div class="card">
                <h2 class="card-subtitle">Our Vision</h2>
                <p class="card-content">
                    To become a local favorite chicken destination across Pampanga, known for bold
                    flavors, great prices, and unbeatable service.
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ============== ABOUT SECTION ============= */

/* About Section Container */
.about-section {
    margin: 0;
    padding: 0;
    width: 100vw;
    max-width: 100vw;
}

/* Background Image */
.about-bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
}

/* Cream Overlay */
.about-overlay {
    position: absolute;
    inset: 0;
    background: rgba(251, 244, 229, 0.82);
    z-index: 1;
}

/* Cards Grid Layout */
.cards-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem 2rem; /* OPTION 2: vertical gap 1rem, horizontal gap 2rem */
    padding: 2rem;
    z-index: 3;
    position: relative;
}

.card {
    background: transparent;
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border-radius: 24px;
    padding: 2.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25), 
                0 2px 8px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 200px;
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35), 
                0 4px 12px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
}

.card:first-child {
    grid-column: 1;
    grid-row: 1 / 3;
    min-height: 280px;
}

.card:nth-child(2) {
    grid-column: 2;
    grid-row: 1;
    min-height: 130px;
}

.card:nth-child(3) {
    grid-column: 2;
    grid-row: 2;
    min-height: 130px;
}

.card-title {
    font-family: 'Unbounded', sans-serif;
    font-weight: 700;
    color: #1A4189;
    margin-bottom: 1.25rem;
    text-align: center;
    letter-spacing: -0.02em;
    font-size: clamp(1.5rem, 4vw, 2.25rem);
    line-height: 1.2;
    text-shadow: 0 2px 8px rgba(255, 255, 255, 0.8);
}

.card-subtitle {
    font-family: 'Unbounded', sans-serif;
    font-weight: 600;
    color: #1A4189;
    margin-bottom: 1rem;
    text-align: center;
    letter-spacing: 0.02em;
    font-size: clamp(1rem, 2.5vw, 1.375rem);
    line-height: 1.3;
    text-transform: uppercase;
    text-shadow: 0 2px 6px rgba(255, 255, 255, 0.8);
}

.card-content {
    line-height: 1.75;
    color: #1f2937;
    text-align: center;
    font-weight: 500;
    font-size: clamp(0.875rem, 1.8vw, 1rem);
    letter-spacing: 0.01em;
    text-shadow: 0 1px 4px rgba(255, 255, 255, 0.9);
}

/* Large Tablet */
@media (max-width: 1024px) {
    .cards-container {
        padding: 2rem 1.5rem;
        max-width: 900px;
        gap: 1rem 1.5rem;
    }

    .card {
        padding: 2rem;
    }

    .card:first-child {
        min-height: 240px;
    }

    .card:nth-child(2),
    .card:nth-child(3) {
        min-height: 120px;
    }
}

/* Tablet Styles */
@media (max-width: 900px) {
    .cards-container {
        padding: 1.75rem 1.25rem;
        gap: 0.875rem 1.25rem;
    }

    .card {
        padding: 1.75rem;
        border-radius: 20px;
    }
}

/* Mobile Styles */
@media (max-width: 768px) {
    .cards-container {
        grid-template-columns: 1fr;
        gap: 1.25rem;
        padding: 1.5rem 1rem;
    }

    .card:first-child,
    .card:nth-child(2),
    .card:nth-child(3) {
        grid-column: 1;
        grid-row: auto;
        min-height: auto;
    }

    .card {
        padding: 1.5rem;
        min-height: auto;
    }

    .card-title {
        margin-bottom: 1rem;
    }

    .card-subtitle {
        margin-bottom: 0.875rem;
    }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
    .cards-container {
        padding: 1.25rem 0.875rem;
        gap: 1rem;
    }

    .card {
        padding: 1.25rem;
        border-radius: 18px;
    }

    .card-title {
        margin-bottom: 0.875rem;
    }

    .card-subtitle {
        margin-bottom: 0.75rem;
    }
}

/* Extra Small Mobile */
@media (max-width: 375px) {
    .cards-container {
        padding: 1rem 0.75rem;
    }

    .card {
        padding: 1rem;
    }
}
</style>