// Extend the Window interface so TypeScript knows about gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

interface TrackingParams {
  [key: string]: string | number | undefined
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
  const trackOrderConfirmed = (orderNumber: string, total: number): void => {
    track('order_confirmed', { order_number: orderNumber, total })
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
