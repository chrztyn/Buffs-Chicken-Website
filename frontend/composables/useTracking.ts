// Extend the Window interface so TypeScript knows about gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

interface TrackingParams {
  [key: string]: string | number | undefined
}

interface CartItem {
  _id?: string
  id?: string
  name: string
  price: number
  basePrice?: number
  addonsCost?: number
  quantity: number
}

export const useTracking = () => {
  /**
   * Core internal helper — every public function routes through here.
   * SSR-safe and silently swallows errors so tracking never breaks the UI.
   */
  const track = (eventName: string, params?: TrackingParams): void => {
    if (!import.meta.client) return
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params)
      }
    } catch {
      // Silently fail — a tracking error must never break the ordering flow
    }
  }

  /** Fire when the /menu page is mounted */
  const trackMenuViewed = (): void => {
    track('menu_viewed')
  }

  /** Fire when a product modal is opened */
  const trackProductModalOpened = (productName: string, category?: string): void => {
    track('product_modal_opened', { product_name: productName, category })
  }

  /** Fire after an item is successfully added to the cart */
  const trackAddToCart = (productName: string, price: number, category?: string): void => {
    track('add_to_cart', { product_name: productName, price, category })
  }

  /** Fire when the cart page is mounted and cart data is loaded */
  const trackCartViewed = (itemCount: number, cartTotal: number): void => {
    track('cart_viewed', { item_count: itemCount, cart_total: cartTotal })
  }

  /** Fire when the order confirm modal first opens */
  const trackCheckoutStarted = (itemCount: number, cartTotal: number): void => {
    track('checkout_started', { item_count: itemCount, cart_total: cartTotal })
  }

  /** Fire after the backend confirms the order and returns an order number */
  const trackOrderConfirmed = (orderNumber: string, total: number, cartItems: CartItem[] = []): void => {
    // Fire standard GA4 purchase event for revenue tracking
    if (!import.meta.client) return
    try {
      const utm = JSON.parse(localStorage.getItem('utm_data') || '{}')
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'purchase', {
          transaction_id: orderNumber,
          value: total,
          currency: 'PHP',
          campaign_source: utm.source,  
          campaign_medium: utm.medium,    
          campaign_name: utm.campaign,
          items: cartItems.map(item => ({
            item_id: item._id || item.id,
            item_name: item.name,
            price: (item.basePrice || item.price) + (item.addonsCost || 0),
            quantity: item.quantity
          }))
        })
      }
    } catch { /* never break the UI */ }
  }

  return {
    trackMenuViewed,
    trackProductModalOpened,
    trackAddToCart,
    trackCartViewed,
    trackCheckoutStarted,
    trackOrderConfirmed,
  }
}
