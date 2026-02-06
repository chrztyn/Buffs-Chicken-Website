declare module 'nuxt/config' {
  interface NuxtConfig {
    pwa?: any
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },
    routeRules: {
    // Prerender these routes
    '/': { prerender: true },
    '/about': { prerender: true },
    '/contact': { prerender: true },
    '/menu': { prerender: true },
    '/blogs': { prerender: true },
    '/blogs/**': { prerender: true },
    '/**': { swr: 3600 }  // Cache other routes for 1 hour
  },
  build: {
    transpile: ['@nuxt/image'],
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Admin should be separate
            if (id.includes('pages/admin') || 
                id.includes('layouts/admin.vue') || 
                id.includes('middleware/admin-auth') ||
                id.includes('composables/useAdmin')) {
              return 'admin'
            }
            // Vue vendor chunks
            if (id.includes('node_modules/vue') || 
                id.includes('node_modules/vue-router')) {
              return 'vue-vendor'
            }
            // API vendor chunks
            if (id.includes('node_modules/axios') || 
                id.includes('node_modules/socket.io-client')) {
              return 'api-vendor'
            }
          },
        },
      },
    },
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/', 'sitemap.xml'],
      ignore: ['/admin']
    }
  },
  components: {
    dirs: [ {
      path: '~/components',
      pathPrefix: false,
      prefix: '',
    }]
  },
  pages: true,
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/image', '@nuxt/scripts', '@vite-pwa/nuxt'],
  router: {
    options: {
      strict: false
    }
  },
  // Progressive Web App (PWA) configuration
  pwa: {
    icon: {
      source: '/icon.png',
    },
    manifest: {
      name: 'Buffs Restaurant',
      short_name: 'Buffs',
      description: 'Order food online from Buffs Restaurant',
      theme_color: '#1A4189',
      background_color: '#FBF4E5',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/icon.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: '/icon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      enabled: true,
      runtimeCaching: [
        {
          urlPattern: '^https://fonts\\.googleapis\\.com',
          handler: 'CacheFirst',
          method: 'GET',
          options: {
            cacheName: 'google-fonts-stylesheets',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
        {
          urlPattern: '^https://fonts\\.gstatic\\.com',
          handler: 'CacheFirst',
          method: 'GET',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
        {
          urlPattern: '/api/.*',
          handler: 'NetworkFirst',
          method: 'GET',
          options: {
            cacheName: 'api-responses',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 5, // 5 minutes
            },
          },
        },
        {
          urlPattern: '.*\\.png|jpg|jpeg|svg|gif|webp$',
          handler: 'CacheFirst',
          method: 'GET',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
      ],
    },
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      // Add cssnano for minification in production
      cssnano:
        process.env.NODE_ENV === 'production'
          ? { preset: ['default', { discardComments: { removeAll: true } }] }
          : false,
    },
  },
  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Caprasimo&family=Unbounded:wght@400;600;700&display=swap',
        },
      ],
            // Google Analytics Script (add your measurement ID)
            script: [
              {
                src: `https://www.googletagmanager.com/gtag/js?id=${process.env.NUXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'}`,
                async: true,
              },
              {
                innerHTML: `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NUXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'}');`,
              },
            ],
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5001/api',
      socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL || 'http://localhost:5001'
    }
  },
    image: {
    dir: 'public/',
    domains: ['localhost', 'your-production-domain.com'],
    providers: {
      ipx: {
        modifiers: {
          quality: 80,
          format: 'webp',
        },
      },
    },
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
})