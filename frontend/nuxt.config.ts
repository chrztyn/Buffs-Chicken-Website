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
  
  experimental: {
    inlineSSRStyles: true, // Inline critical CSS for faster FCP
  },
  
  features: {
    inlineStyles: true, // Inline critical CSS
  },
  
  build: {
    transpile: ['@nuxt/image'],
  },
  vite: {
    build: {
      cssCodeSplit: false, // Bundle all CSS into one file to reduce requests
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: undefined, // Prevent code splitting for better initial load
        }
      }
    },
    css: {
      devSourcemap: false,
    },
    server: {
      allowedHosts: ['buffschicken.com', 'www.buffschicken.com', 'localhost', '127.0.0.1']
    }
  },
  nitro: {
    compressPublicAssets: true,
    routeRules: {
      '/': {
        headers: {
          'Link': '</buffs-logo.webp>; rel=preload; as=image; fetchpriority=high, </hero-main.webp>; rel=preload; as=image; fetchpriority=high'
        }
      },
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
    },
    prerender: {
      crawlLinks: true,
      routes: ['/']
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
  modules: ['@nuxt/image', '@nuxtjs/sitemap', '@nuxt/scripts'],
  
  scripts: {
    registry: {
      googleAnalytics: {
        id: 'G-P48SW3GZ05'
      }
    }
  },

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
        // Non-blocking font loading with media trick
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Caprasimo&family=Unbounded:wght@400;600;700&display=swap',
          media: 'print',
          onload: "this.media='all'"
        },
      ],
      noscript: [
        {
          children: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caprasimo&family=Unbounded:wght@400;600;700&display=swap">'
        }
      ]
    }
  },
})