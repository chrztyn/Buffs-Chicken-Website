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
  },
  build: {
    transpile: ['@nuxt/image'],
  },
  vite: {
    build: {
      cssCodeSplit: true,
    },
    server: {
      allowedHosts: ['buffschicken.com', 'www.buffschicken.com', 'localhost', '127.0.0.1']
    }
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/', '/about', '/contact', '/menu', '/blogs', '/cart'],
      failOnError: false,
    },
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
      '/**/*.{jpg,jpeg,png,gif,webp,svg,ico}': {
        headers: {
          'cache-control': 'public, max-age=2592000'
        }
      },
      '/**/*.{js,css,woff,woff2,ttf,eot}': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      }
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
  modules: ['@nuxt/image', '@nuxt/scripts', '@vite-pwa/nuxt', '@nuxtjs/sitemap'],

  // Image optimization configuration
  image: {
    quality: 80,
    format: ['webp', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 50,
          height: 50,
        },
      },
      thumbnail: {
        modifiers: {
          format: 'webp',
          width: 300,
          height: 300,
        },
      },
    },
  },

  // Enable experimental features for better performance
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: false,
    typedPages: false,
  },

  // Sitemap configuration
  sitemap: {
    hostname: 'https://buffschicken.com',
    gzip: true,
    exclude: [
      '/admin/**',
      '/cart',
      '/checkout'
    ],
    routes: async () => {
      // Fetch dynamic blog routes
      const blogs = await fetch('https://buffschicken.com/api/blogs')
        .then(res => res.json())
        .catch(() => ({ data: [] }))

      const blogRoutes = (blogs.data || []).map((blog: any) => ({
        url: `/blogs/${blog.slug}`,
        lastmod: blog.updatedAt || blog.createdAt,
        changefreq: 'weekly',
        priority: 0.8
      }))

      return [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/menu', changefreq: 'weekly', priority: 0.9 },
        { url: '/blogs', changefreq: 'daily', priority: 0.9 },
        { url: '/about', changefreq: 'monthly', priority: 0.7 },
        { url: '/contact', changefreq: 'monthly', priority: 0.7 },
        ...blogRoutes
      ]
    }
  },
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
          media: 'print',
          onload: "this.media='all'",
        },
      ],
      script: [
        {
          src: `https://www.googletagmanager.com/gtag/js?id=${process.env.NUXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'}`,
          async: true,
          defer: true,
        },
        {
          innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${process.env.NUXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'}');`,
          type: 'text/partytown',
        },
      ],
      noscript: [
        {
          innerHTML: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caprasimo&family=Unbounded:wght@400;600;700&display=swap">',
        },
      ],
    }
  },
})