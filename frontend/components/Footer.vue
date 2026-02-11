<template>
    <footer class="footer-container">
        <div class="footer-wrapper">
            <div class="footer-grid">
                <!-- Brand Section -->
                <div class="footer-brand">
                    <h2 class="footer-title">Buffs Chicken</h2>
                    <p class="footer-address">
                        The Hood, Angeles City<br />
                        Pampanga © 2026 Buffs Chicken.<br />
                        All Rights Reserved.
                    </p>
                </div>

                <!-- Explore Section -->
                <div class="footer-explore">
                    <h3 class="footer-subtitle">Explore</h3>
                    <nav class="footer-nav">
                        <ul class="footer-list">
                            <li class="footer-item">
                                <NuxtLink to="/" class="footer-link">
                                    Home
                                </NuxtLink>
                            </li>
                            <li class="footer-item">
                                <NuxtLink to="/blogs" class="footer-link">
                                    Blogs
                                </NuxtLink>
                            </li>
                            <li class="footer-item">
                                <NuxtLink to="/menu" class="footer-link">
                                    Menu
                                </NuxtLink>
                            </li>
                            <li class="footer-item">
                                <NuxtLink to="/about" class="footer-link">
                                    About
                                </NuxtLink>
                            </li>
                            <li class="footer-item">
                                <NuxtLink to="/contact" class="footer-link">
                                    Contact
                                </NuxtLink>
                            </li>
                        </ul>
                    </nav>
                </div>

                <!-- Hours Section -->
                <div class="footer-hours">
                    <h3 class="footer-subtitle">Hours</h3>
                    <p class="footer-schedule">
                        Friday—Sunday<br />
                        3pm — 10pm
                    </p>
                    
                    <!-- Social Media Icons -->
                    <div class="footer-socials">
                        <a 
                            href="https://web.facebook.com/buffschicken"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="footer-social-link"
                            aria-label="Facebook"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                        
                        <a 
                            href="https://www.instagram.com/buffschickenph/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="footer-social-link"
                            aria-label="Instagram"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        
                        <a
                            href="https://www.tiktok.com/@buffschickenph"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="footer-social-link"
                            aria-label="TikTok"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer-container {
    background-color: #1A4189;
    color: white;
    padding: 1rem 1rem;
    width: 100%;
}

@media (min-width: 768px) {
    .footer-container {
        padding: 2rem 2rem;
    }
}

/* Footer Wrapper */
.footer-wrapper {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
}

@media (min-width: 1024px) {
    .footer-wrapper {
        padding-left: 3rem;
        padding-right: 2rem;
    }
}

/* Footer Grid */
.footer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
}

@media (min-width: 768px) {
    .footer-grid {
        grid-template-columns: minmax(200px, 1fr) minmax(100px, auto) minmax(120px, auto);
        gap: 2rem;
        align-items: start;
    }
}

@media (min-width: 1024px) {
    .footer-grid {
        gap: 3rem;
    }
}

/* Brand Section */
.footer-brand {
    display: block;
    margin-left: 0;
}

@media (min-width: 768px) {
    .footer-brand {
        margin-left: 0;
    }
}

@media (min-width: 1024px) {
    .footer-brand {
        margin-left: -2rem;
    }
}

.footer-title {
    color: #FEB90E;
    font-family: 'Caprasimo', cursive;
    font-size: 1.25rem;
    font-weight: 100;
    margin: 0 0 0.5rem 0;
    line-height: 1.2;
}

@media (min-width: 768px) {
    .footer-title {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }
}

.footer-address {
    margin: 0;
    font-size: 0.7rem;
    line-height: 1.5;
    color: white;
}

@media (min-width: 768px) {
    .footer-address {
        font-size: 0.75rem;
        margin-left: 0rem;
    }
}

/* Explore Section */
.footer-explore {
    display: block;
}

.footer-subtitle {
    color: #FEB90E;
    font-size: 0.75rem;
    font-weight: 600;
    margin: 0 0 0.75rem 0;
    line-height: 1.2;
}

@media (min-width: 768px) {
    .footer-subtitle {
        font-size: 0.75rem;
    }
}

.footer-nav {
    display: block;
}

.footer-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.footer-item {
    font-size: 0.8rem;
    color: white;
}

@media (min-width: 768px) {
    .footer-item {
        font-size: 0.75rem;
    }
}

.footer-link {
    color: white;
    text-decoration: none;
    transition: color 0.2s ease;
}

.footer-link:hover {
    color: #FEB90E;
}

/* Hours Section */
.footer-hours {
    display: block;
}

.footer-schedule {
    margin: 0 0 1rem 0;
    font-size: 0.75rem;
    line-height: 1.5;
    color: white;
}

@media (min-width: 768px) {
    .footer-schedule {
        font-size: 0.75rem;
        margin-bottom: 1.25rem;
    }
}

/* Social Media */
.footer-socials {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.footer-social-link {
    width: 1.75rem;
    height: 1.75rem;
    background-color: #FEB90E;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
}

@media (min-width: 768px) {
    .footer-social-link {
        width: 2rem;
        height: 2rem;
    }
}

.footer-social-link:hover {
    background-color: #db9d00;
}

.footer-social-link svg {
    width: 1rem;
    height: 1rem;
}
    
@media (min-width: 768px) {
    .footer-social-link svg {
        width: 1.25rem;
        height: 1.25rem;
    }
}
</style>