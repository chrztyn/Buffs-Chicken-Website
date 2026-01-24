<template>
    <footer class="bg-[#1e3a8a] text-white py-12 px-6">
        <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-8 md:gap-12" style="padding-left: 2rem;">
            <!-- Brand Section -->
            <div>
            <h2 class="text-[#FE601C] font-['Caprasimo'] text-xl mb-4">Buffs Chicken</h2>
            <p class="address text-sm leading-relaxed">
                The Hood, Angeles City<br />
                Pampanga © 2026 Buffs Chicken.<br />
                All Rights Reserved.
            </p>
            </div>

            <!-- Explore Section -->
            <div>
            <h3 class="text-[#FE601C] text-xl font-semibold mb-4">Explore</h3>
            <nav>
                <ul class="space-y-2">
                <li>
                    <NuxtLink to="/" class="hover:text-[#ff6b35] transition-colors">
                    Home
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/blogs" class="hover:text-[#ff6b35] transition-colors">
                    Blogs
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/menu" class="hover:text-[#ff6b35] transition-colors">
                    Menu
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/about" class="hover:text-[#ff6b35] transition-colors">
                    About
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/contact" class="hover:text-[#ff6b35] transition-colors">
                    Contact
                    </NuxtLink>
                </li>
                </ul>
            </nav>
            </div>

            <!-- Hours Section -->
            <div>
            <h3 class="text-[#FE601C] text-xl font-semibold mb-4">Hours</h3>
            <p class="mb-6">
                Friday—Sunday<br />
                3pm — 10pm
            </p>
            
            <!-- Social Media Icons -->
            <div class="flex gap-4">
                <a
                href="https://web.facebook.com/buffschicken"
                target="_blank"
                rel="noopener noreferrer"
                class="w-8 h-8 bg-[#FE601C] rounded-full flex items-center justify-center hover:bg-[#ff8555] transition-colors"
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
                class="w-8 h-8 bg-[#FE601C] rounded-full flex items-center justify-center hover:bg-[#ff8555] transition-colors"
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
                class="w-8 h-8 bg-[#FE601C] rounded-full flex items-center justify-center hover:bg-[#ff8555] transition-colors"
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