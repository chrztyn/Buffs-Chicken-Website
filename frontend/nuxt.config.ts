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
    inlineSSRStyles: true, // Inline critical CSS to prevent render blocking
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
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        }
      },
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: false,
      sourcemap: false,
    },
    css: {
      devSourcemap: false,
    },
    server: {
      allowedHosts: ['buffschicken.com', 'www.buffschicken.com', 'localhost', '127.0.0.1']
    }
  },
  nitro: {
    // Dev only: proxy backend-served product images so relative `/backend-images/...`
    // URLs resolve the same way locally as they do behind nginx in production.
    devProxy: {
      '/backend-images': {
        target: `${process.env.NUXT_PUBLIC_SOCKET_URL || 'http://localhost:5001'}/backend-images`,
        changeOrigin: true
      }
    },
    compressPublicAssets: false,
    minify: false, // Disabled for faster builds on 1GB RAM
    sourceMap: false,
    timing: false,
    externals: {
      inline: ['defu']
    },
    routeRules: {
      '/': {
        swr: 3600,
        isr: true,
        headers: {
          'Link': '</buffs-logo.webp>; rel=preload; as=image; fetchpriority=high, </hero-main.webp>; rel=preload; as=image; fetchpriority=high'
        }
      },
      '/admin/**': { robots: 'noindex, nofollow' },
      '/cart': { robots: 'noindex, nofollow' },
      '/order-status': { robots: 'noindex, nofollow' },
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
      routes: [],
      // Completely disable prerendering during build
      ignore: ['/'],
      failOnError: false,
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
  css: ['leaflet/dist/leaflet.css', '~/assets/css/main.css'],
  modules: ['@nuxt/image', '@nuxtjs/sitemap', '@nuxt/scripts'],
  // Sitemap temporarily disabled for faster builds
  // modules: ['@nuxt/image', '@nuxt/scripts'],
  
  scripts: {
    registry: {
      googleAnalytics: {
        id: 'G-P48SW3GZ05'
      }
    },
    // Defer all scripts for better performance
    defaultScriptOptions: {
      trigger: 'onNuxtReady'
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

  // Sitemap configuration
  sitemap: {
    exclude: ['/admin/**', '/cart', '/order-status'],
    sources: [
      '/api/__sitemap__/urls'
    ]
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
          rel: 'dns-prefetch',
          href: 'https://www.buffschicken.com',
        },
        // Map tiles (delivery location picker) — warm the connection early
        { rel: 'preconnect', href: 'https://tile.openstreetmap.org', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://tile.openstreetmap.org' },
        // Non-blocking font loading with media trick
        {
          rel: 'preload',
          as: 'style',
          href: 'https://fonts.googleapis.com/css2?family=Caprasimo&family=Poppins:wght@300;400;500;600;700&family=Unbounded:wght@400;600;700&display=swap',
          onload: "this.onload=null;this.rel='stylesheet'"
        },
        // Fallback for browsers without JS
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Caprasimo&family=Poppins:wght@300;400;500;600;700&family=Unbounded:wght@400;600;700&display=swap',
          media: 'print',
          onload: "this.media='all'"
        },
      ],
      script: [
        // TODO: Replace CLARITY_ID_HERE with your actual Microsoft Clarity project ID from https://clarity.microsoft.com
        // Only injected in production builds to avoid polluting dev analytics.
        ...(process.env.NODE_ENV === 'production'
          ? [
              {
                innerHTML: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","CLARITY_ID_HERE");`,
              },
            ]
          : []),
      ],
    }
  },
})