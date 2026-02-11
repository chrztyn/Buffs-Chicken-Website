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
    inlineSSRStyles: (id) => {
      // Only inline critical components, not node_modules (saves memory)
      return !id?.includes('node_modules')
    },
  },
  
  features: {
    inlineStyles: false, // Disabled for server builds, but CSS still optimized
  },
  
  build: {
    transpile: ['@nuxt/image'],
    analyze: false, // Disable bundle analyzer in production
  },
  vite: {
    build: {
      cssCodeSplit: false, // Bundle all CSS into one file to reduce requests
      cssMinify: 'esbuild', // Less memory than lightningcss, still good compression
      rollupOptions: {
        output: {
          manualChunks: undefined, // Prevent code splitting for better initial load
        }
      },
      chunkSizeWarningLimit: 1000, // Suppress warnings for server builds
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
    minify: true, // Minify server code for smaller output
    sourceMap: false, // Disable source maps in production for smaller size
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
      crawlLinks: false, // Disabled for memory efficiency
      routes: ['/', '/menu', '/about', '/contact', '/blogs'], // Only prerender key pages
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

  // Site configuration (required for sitemap)
  site: {
    url: 'https://buffschicken.com'
  },

  // Minimal image config
  image: {
    quality: 80,
  },

  // Sitemap configuration - simplified
  sitemap: {
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