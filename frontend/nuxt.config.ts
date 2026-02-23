declare module 'nuxt/config' {
  interface NuxtConfig {
    pwa?: any
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  devtools: {
    enabled: false, // Disable devtools for faster builds
  },
  
  experimental: {
    payloadExtraction: false, // Disable payload extraction for faster builds
  },
  
  features: {
    inlineStyles: true,
  },
  
  build: {
    transpile: ['@nuxt/image'],
    analyze: false,
  },
  vite: {
    build: {
      cssCodeSplit: false,
      cssMinify: 'esbuild',
      minify: 'esbuild', // Esbuild is faster than terser
      rollupOptions: {
        output: {
          manualChunks: undefined,
        }
      },
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: false, // Skip size reporting for faster builds
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
    minify: true,
    sourceMap: false,
    timing: false, // Disable timing info for faster builds
    externals: {
      inline: ['defu'] // Inline small dependencies
    },
    routeRules: {
      '/': {
        swr: 3600,
        isr: true,
        headers: {
          'Link': '</buffs-logo.webp>; rel=preload; as=image; fetchpriority=high, </hero-main.webp>; rel=preload; as=image; fetchpriority=high'
        }
      },
      '/menu': { swr: 3600, isr: true },
      '/about': { swr: 3600, isr: true },
      '/contact': { swr: 3600, isr: true },
      '/blogs': { swr: 3600, isr: true },
      '/blogs/**': { swr: 3600, isr: true },
      '/_nuxt/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      },
      '/**/*.webp': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      },
      '/**/*.{png,jpg,jpeg,gif,svg}': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      },
      '/backend-images/**': {
        headers: {
          'cache-control': 'public, max-age=2592000'
        }
      }
    },
    prerender: {
      crawlLinks: false,
      // Disable prerendering - use ISR instead for faster builds
      routes: []
    }
  } as any,
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://www.buffschicken.com/api',
      socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL || 'https://www.buffschicken.com',
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

  // Site configuration (required for sitemap)
  site: {
    url: 'https://www.buffschicken.com',
    name: 'Buffs Chicken - Crispy Wings & Comfort Food',
    description: 'Buffs Chicken at The Hood, Angeles City serves crispy and juicy signature OG Buffs wings, cheesy pastas, and loaded combos.'
  },

  // Minimal image config
  image: {
    quality: 80,
  },

  // Sitemap configuration - static routes only for fast builds
  // Google will discover blog posts by crawling the /blogs page
  sitemap: {
    urls: () => {
      return [
        {
          loc: '/',
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 1.0
        },
        {
          loc: '/menu',
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.9
        },
        {
          loc: '/about',
          lastmod: new Date().toISOString(),
          changefreq: 'monthly',
          priority: 0.8
        },
        {
          loc: '/contact',
          lastmod: new Date().toISOString(),
          changefreq: 'monthly',
          priority: 0.8
        },
        {
          loc: '/blogs',
          lastmod: new Date().toISOString(),
          changefreq: 'daily',
          priority: 0.9
        }
      ]
    },
    exclude: ['/admin/**', '/cart', '/checkout']
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
      ]
    }
  },
})