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
  build: {
    transpile: ['@nuxt/image'],
  },
  vite: {
    server: {
      allowedHosts: ['buffschicken.com', 'www.buffschicken.com', 'localhost', '127.0.0.1']
    }
  },
  nitro: {
    compressPublicAssets: true,
    routeRules: {
      '/_nuxt/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      },
      '/backend-images/**': {
        headers: {
          'cache-control': 'public, max-age=2592000'
        }
      },
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
  modules: ['@nuxt/image', '@nuxtjs/sitemap'],

  // Minimal image config
  image: {
    quality: 80,
  },

  // Sitemap configuration - simplified
  sitemap: {
    hostname: 'https://buffschicken.com',
    gzip: true,
    exclude: ['/admin/**', '/cart', '/checkout'],
  },
  router: {
    options: {
      strict: false
    }
  },
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
      htmlAttrs: {
        lang: 'en'
      },
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
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
    }
  },
})