import { useHead } from '#imports'
import { useRoute } from 'vue-router'

export interface BreadcrumbItem {
  name: string
  path: string
  position: number
}

export function useBreadcrumbs(breadcrumbs?: BreadcrumbItem[]) {
  const route = useRoute()

  // Default breadcrumbs based on route
  const defaultBreadcrumbs: { [key: string]: BreadcrumbItem[] } = {
    '/': [
      { name: 'Home', path: '/', position: 1 }
    ],
    '/menu': [
      { name: 'Home', path: '/', position: 1 },
      { name: 'Menu', path: '/menu', position: 2 }
    ],
    '/about': [
      { name: 'Home', path: '/', position: 1 },
      { name: 'About', path: '/about', position: 2 }
    ],
    '/contact': [
      { name: 'Home', path: '/', position: 1 },
      { name: 'Contact', path: '/contact', position: 2 }
    ],
    '/blogs': [
      { name: 'Home', path: '/', position: 1 },
      { name: 'Blogs', path: '/blogs', position: 2 }
    ],
    '/cart': [
      { name: 'Home', path: '/', position: 1 },
      { name: 'Cart', path: '/cart', position: 2 }
    ],
    '/order-status': [
      { name: 'Home', path: '/', position: 1 },
      { name: 'Order Status', path: '/order-status', position: 2 }
    ]
  }

  // Get the breadcrumbs for the current route
  const items = breadcrumbs || defaultBreadcrumbs[route.path] || [
    { name: 'Home', path: '/', position: 1 }
  ]

  // Build BreadcrumbList JSON-LD schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map(item => ({
      '@type': 'ListItem',
      'position': item.position,
      'name': item.name,
      'item': `https://www.buffschicken.com${item.path}`
    }))
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(breadcrumbSchema, null, 2)
      }
    ]
  })

  return items
}
