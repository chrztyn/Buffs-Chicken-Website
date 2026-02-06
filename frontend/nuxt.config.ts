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
    '/': { prerender: true },
    '/about': { prerender: true },
    '/contact': { prerender: true },
    '/menu': { cache: { maxAge: 60 * 10 } }, 
    '/blogs': { cache: { maxAge: 60 * 10 } },
    '/blogs/**': { cache: { maxAge: 60 * 10 } },
    '/**': { cache: { maxAge: 60 * 10 } }
  },
  build: {
    transpile: ['@nuxt/image'],
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('pages/admin') || 
                id.includes('layouts/admin.vue') || 
                id.includes('middleware/admin-auth') ||
                id.includes('composables/useAdmin')) {
              return 'admin'
            }
            if (id.includes('node_modules/vue') || 
                id.includes('node_modules/vue-router')) {
              return 'vue-vendor'
            }
            if (id.includes('node_modules/axios') || 
                id.includes('node_modules/socket.io-client')) {
              return 'api-vendor'
            }
          },
        },
      },
    },
    server: {
      allowedHosts: ['buffschicken.com', 'www.buffschicken.com', 'localhost', '127.0.0.1']
    }
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/', '/about', '/contact', '/menu', '/blogs', '/cart']
    }
  } as any,
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://buffschicken.com/api',
      socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL || 'https://buffschicken.com',
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
  pwa: {
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
        },
        {
          src: '/icon.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: '^https://fonts\\.googleapis\\.com',
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-stylesheets',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          },
        },
        {
          urlPattern: '^https://fonts\\.gstatic\\.com',
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          },
        },
        {
          urlPattern: '/api/.*',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-responses',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 5,
            },
          },
        },
      ],
    },
  } as any,
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
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
})