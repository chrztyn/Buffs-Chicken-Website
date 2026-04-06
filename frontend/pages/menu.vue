<template>
  <div class="menu-page min-h-screen bg-[#FBF4E5] overflow-x-hidden w-full">
    <!-- Toast Notification -->
    <transition name="toast-fade">
      <div
        v-if="notification.show"
        @click="$router.push('/cart'); notification.show = false"
        class="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-lg px-6 py-4 max-w-sm cursor-pointer hover:shadow-xl transition-shadow"
      >
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="font-semibold text-gray-800">{{ notification.title }}</p>
          <p class="text-sm text-gray-600">{{ notification.message }}</p>
          <p class="text-xs text-green-600 font-semibold mt-0.5">Tap to view cart →</p>
        </div>
        <button @click.stop="notification.show = false" class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </transition>

    <Navbar class="relative z-20"/>

    <!-- Store Status Banner -->
    <div
      v-if="storeStatus"
      :class="[
        'py-4 px-6 shadow-md border-b-2',
        storeStatus.isOpen
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'
          : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-400'
      ]"
    >
      <div class="max-w-[1920px] mx-auto">
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div :class="['w-3 h-3 rounded-full animate-pulse', storeStatus.isOpen ? 'bg-green-500' : 'bg-red-500']"></div>
              <h3 :class="['text-lg sm:text-xl font-bold font-[\'Unbounded\']', storeStatus.isOpen ? 'text-green-800' : 'text-red-800']">
                {{ storeStatus.isOpen ? "We're Open!" : "We're Closed" }}
              </h3>
            </div>
            <button @click="showOperatingHours = !showOperatingHours" class="text-xs sm:text-sm font-semibold font-['Unbounded'] text-gray-600 hover:text-gray-800 flex items-center gap-1 transition-colors">
              {{ showOperatingHours ? 'Hide' : 'View' }} Hours
              <svg :class="['w-4 h-4 transition-transform duration-300', { 'rotate-180': showOperatingHours }]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>
          <p v-if="storeStatus.message" :class="['text-sm sm:text-base font-[\'Unbounded\']', storeStatus.isOpen ? 'text-green-700' : 'text-red-700']">
            {{ storeStatus.message }}
          </p>
          <transition enter-active-class="transition-all duration-300 ease-out" leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 max-h-0" leave-to-class="opacity-0 max-h-0">
            <div v-if="showOperatingHours" class="mt-2 pt-3 border-t border-gray-300">
              <h4 class="text-sm font-bold font-['Unbounded'] text-gray-800 mb-2">Operating Hours</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                <div v-for="(hours, day) in operatingHours" :key="day" class="flex flex-col text-xs sm:text-sm font-['Unbounded'] bg-white px-3 py-2 rounded-lg">
                  <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-700 capitalize">{{ day }}:</span>
                    <span :class="['font-medium', hours.isOpen ? 'text-gray-600' : 'text-red-600']">
                      {{ hours.isOpen ? `${formatTime(hours.openTime)} - ${formatTime(hours.closeTime)}` : 'Closed' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         MOBILE + TABLET STICKY BAR (hidden on lg+)
         search row + category pill tabs, always on top while scrolling
    ══════════════════════════════════════════════════════════════ -->
    <div class="lg:hidden sticky top-0 z-30 bg-[#FBF4E5] border-b border-gray-200 shadow-sm">
      <div class="flex items-center gap-3 px-4 pt-3 pb-2">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search meals"
            class="w-full pl-4 pr-10 py-2 rounded-full border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1A4189] transition-all text-sm shadow-sm"
          />
          <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <div class="relative flex-shrink-0">
          <button @click="goToCart" class="w-10 h-10 bg-[#FEB90E] rounded-full text-[#1A4189] hover:bg-[#e5a70d] transition-all flex items-center justify-center shadow-md">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </button>
          <transition name="badge-pop">
            <div v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-white">
              {{ cartCount > 99 ? '99+' : cartCount }}
            </div>
          </transition>
        </div>
      </div>
      <div v-if="categorizedMenu.length > 0" class="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
        <button
          v-for="cat in categorizedMenu"
          :key="cat.slug"
          @click="scrollToSection(cat.slug)"
          :class="[
            'flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold font-[\'Unbounded\'] transition-all duration-200',
            activeSection === cat.slug
              ? 'bg-[#1A4189] text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1A4189] hover:text-[#1A4189]'
          ]"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <div class="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[1920px] mx-auto w-full">
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-start">

        <!-- Desktop Sidebar -->
        <aside class="hidden lg:block w-[240px] xl:w-[260px] flex-shrink-0 sticky top-0 self-start pt-8 pb-8 max-h-screen overflow-y-auto scrollbar-hide">
          <h2 class="text-3xl xl:text-4xl font-['Unbounded'] text-[#1A4189] mb-6 leading-tight">Grab your favorites</h2>

          <!-- Search + Cart -->
          <div class="flex gap-3 items-center mb-8">
            <div class="relative flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search meals"
                class="w-full pl-4 pr-10 py-2.5 rounded-full border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1A4189] focus:ring-2 focus:ring-[#1A4189]/20 transition-all shadow-sm text-sm"
              />
              <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <div class="relative flex-shrink-0">
              <button @click="goToCart" class="w-11 h-11 bg-[#FEB90E] rounded-full text-[#1A4189] hover:bg-[#e5a70d] transition-all hover:scale-105 flex items-center justify-center shadow-md">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </button>
              <transition name="badge-pop">
                <div v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-white">
                  {{ cartCount > 99 ? '99+' : cartCount }}
                </div>
              </transition>
            </div>
          </div>

          <!-- Category Nav -->
          <div>
            <h3 class="text-sm font-bold text-gray-800 mb-3 font-['Unbounded']">Categories</h3>
            <div class="border-b border-gray-200 mb-3"></div>
            <nav class="flex flex-col gap-1">
              <button
                v-for="cat in categorizedMenu"
                :key="cat.slug"
                @click="scrollToSection(cat.slug)"
                :class="[
                  'flex items-center justify-between w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 font-[\'Unbounded\'] text-sm',
                  activeSection === cat.slug
                    ? 'bg-[#1A4189] text-white font-bold shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#1A4189]'
                ]"
              >
                <span>{{ cat.name }}</span>
                <span :class="['text-xs rounded-full px-2 py-0.5', activeSection === cat.slug ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500']">
                  {{ cat.items.length }}
                </span>
              </button>
            </nav>
          </div>
        </aside>

        <!-- Right Content -->
        <div class="flex-1 w-full min-w-0 pt-8 pb-16 sm:pb-24">

          <!-- Store Closed Alert -->
          <div v-if="storeStatus && !storeStatus.isOpen" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p class="text-sm font-semibold font-['Unbounded'] text-red-800">Sorry, we're currently closed. You can browse but ordering is disabled.</p>
          </div>

          <!-- Loading skeleton -->
          <div v-if="loading" class="space-y-10">
            <div v-for="s in 3" :key="s">
              <div class="h-7 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                <div v-for="n in 3" :key="n" class="h-[220px] bg-white rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>

          <!-- Category Sections -->
          <template v-else>
            <div v-if="categorizedMenu.length === 0" class="text-center py-24">
              <div class="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p class="text-xl font-semibold font-['Unbounded'] text-gray-600 mb-2">No items found</p>
              <p class="text-gray-400">Try adjusting your search</p>
            </div>

            <div
              v-for="cat in categorizedMenu"
              :key="cat.slug"
              :id="`section-${cat.slug}`"
              :data-category-slug="cat.slug"
              class="category-section mb-12 sm:mb-16 menu-scroll-target"
            >
              <div class="flex items-center gap-4 mb-5">
                <h2 class="text-xl sm:text-2xl font-bold font-['Unbounded'] text-[#1A4189] capitalize whitespace-nowrap">
                  {{ cat.name }}
                </h2>
                <div class="flex-1 h-px bg-gray-200"></div>
                <span class="text-xs text-gray-400 font-['Unbounded'] whitespace-nowrap">
                  {{ cat.items.length }} item{{ cat.items.length !== 1 ? 's' : '' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                <ClientOnly>
                  <MenuCard
                    v-for="item in cat.items"
                    :key="item.id"
                    :product="item"
                    :disabled="storeStatus && !storeStatus.isOpen"
                    @added="handleAdded"
                  />
                </ClientOnly>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <Footer/>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useApi } from '~/composables/useApi'
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'
import MenuCard from '~/components/MenuCard.vue'

export default {
  name: 'MenuPage',
  setup() {
    const { getProducts } = useApi()
    const config = useRuntimeConfig()

    function buildMenuSections(products) {
      if (!products?.length) return []
      const categoryMap = {}
      for (const p of products) {
        if (!p.isAvailable) continue
        const cat = p.category || 'Other'
        if (!categoryMap[cat]) categoryMap[cat] = []
        const rawImage = p.image
        const imageUrl = rawImage ? (rawImage.startsWith('http') ? rawImage : `${config.public.socketUrl}${rawImage}`) : null
        const item = { '@type': 'MenuItem', name: p.name, description: p.description || '', offers: { '@type': 'Offer', price: String(p.price), priceCurrency: 'PHP', availability: 'https://schema.org/InStock' } }
        if (imageUrl) item.image = imageUrl
        categoryMap[cat].push(item)
      }
      return Object.entries(categoryMap).map(([cat, items]) => ({ '@type': 'MenuSection', name: cat.charAt(0).toUpperCase() + cat.slice(1), hasMenuItem: items }))
    }

    const { data: menuSchemaData } = useAsyncData('menu-schema-products', async () => {
      try { const r = await getProducts(); return r?.data?.data || [] } catch { return [] }
    })

    useHead({
      script: [{ type: 'application/ld+json', innerHTML: computed(() => {
        const products = menuSchemaData.value || []
        if (!products.length) return ''
        return JSON.stringify({ '@context': 'https://schema.org', '@type': 'FoodEstablishment', name: 'Buffs Chicken', url: 'https://www.buffschicken.com/menu', hasMenu: { '@type': 'Menu', name: 'Buffs Chicken Menu', url: 'https://www.buffschicken.com/menu', hasMenuSection: buildMenuSections(products) } })
      }) }]
    })
  },
  head() {
    return {
      title: 'Menu - Buffs Chicken | Order Wings, Combos & Pastas Online',
      meta: [
        { name: 'description', content: 'Browse our full menu of crispy wings, loaded combos, and cheesy pastas. Order online from Buffs Chicken at The Hood, Angeles City.' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'Menu - Buffs Chicken' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://www.buffschicken.com/menu' }
      ],
      link: [{ rel: 'canonical', href: 'https://www.buffschicken.com/menu' }]
    }
  },
  components: { Navbar, Footer, MenuCard },
  data() {
    return {
      searchQuery: '',
      cartCount: 0,
      menuItems: [],
      categories: [],
      loading: true,
      notification: { show: false, title: '', message: '' },
      activeSection: '',
      storeStatus: null,
      showOperatingHours: false,
      operatingHours: {},
      _observer: null
    }
  },
  computed: {
    categorizedMenu() {
      const catMeta = {}
      this.categories.forEach((cat, idx) => {
        catMeta[cat.slug] = { name: cat.name, order: cat.displayOrder ?? idx }
      })
      const query = this.searchQuery.toLowerCase().trim()
      const groups = {}
      for (const item of this.menuItems) {
        const slug = item.category || 'other'
        if (!groups[slug]) groups[slug] = []
        const matches = !query || item.name.toLowerCase().includes(query) || (item.description || '').toLowerCase().includes(query)
        if (matches) groups[slug].push(item)
      }
      return Object.entries(groups)
        .filter(([, items]) => items.length > 0)
        .map(([slug, items]) => ({
          slug,
          name: catMeta[slug]?.name || (slug.charAt(0).toUpperCase() + slug.slice(1)),
          order: catMeta[slug]?.order ?? 999,
          items
        }))
        .sort((a, b) => a.order - b.order)
    }
  },
  async mounted() {
    try {
      await Promise.all([this.loadCategories(), this.loadProducts()])
    } catch (e) {
      console.error('[Menu] mount error', e)
    }
    try { const { trackMenuViewed } = useTracking(); trackMenuViewed() } catch (_) {}
    try { await this.loadStoreStatus() } catch (_) {}
    const savedCart = localStorage.getItem('buffs_cart')
    if (savedCart) {
      const cartItems = JSON.parse(savedCart)
      this.cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    }
    this.$nextTick(() => this.setupObserver())
  },
  beforeUnmount() {
    if (this._observer) this._observer.disconnect()
  },
  methods: {
    async loadCategories() {
      try {
        const { getCategories } = useApi()
        const response = await getCategories()
        this.categories = response?.data?.data || response?.data || []
      } catch (e) {
        console.error('[Menu] loadCategories error', e)
      }
    },
    async loadProducts() {
      this.loading = true
      try {
        const { getProducts } = useApi()
        const response = await getProducts({ page: 1, limit: 200 })
        const raw = response.data.data || []
        this.menuItems = raw
          .map(p => ({ ...p, id: p._id }))
          .sort((a, b) => {
            const diff = (a.displayOrder || 0) - (b.displayOrder || 0)
            return diff !== 0 ? diff : new Date(a.createdAt) - new Date(b.createdAt)
          })
      } catch (e) {
        console.error('[Menu] loadProducts error', e)
      } finally {
        this.loading = false
        this.$nextTick(() => this.setupObserver())
      }
    },
    setupObserver() {
      if (this._observer) this._observer.disconnect()
      const sections = document.querySelectorAll('.category-section')
      if (!sections.length) return
      this._observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) this.activeSection = entry.target.dataset.categorySlug
          })
        },
        { rootMargin: '-10% 0px -75% 0px', threshold: 0 }
      )
      sections.forEach(el => this._observer.observe(el))
      if (!this.activeSection && sections.length) this.activeSection = sections[0].dataset.categorySlug
    },
    scrollToSection(slug) {
      const el = document.getElementById(`section-${slug}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        this.activeSection = slug
      }
    },
    handleAdded() {
      const saved = localStorage.getItem('buffs_cart')
      const cartItems = saved ? JSON.parse(saved) : []
      this.cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
      const last = cartItems[cartItems.length - 1]
      if (last) this.showNotification(last.name, `Added ${last.quantity} item${last.quantity > 1 ? 's' : ''} to cart`)
    },
    showNotification(title, message) {
      this.notification = { show: true, title, message }
      setTimeout(() => { this.notification.show = false }, 4000)
    },
    goToCart() { this.$router.push('/cart') },
    async loadStoreStatus() {
      try {
        const { getStoreStatus } = useApi()
        const statusResponse = await getStoreStatus()
        if (statusResponse.data?.data) {
          const { isOpen, manualOverride, operatingHours, activeClosure } = statusResponse.data.data
          let displayMessage = ''
          if (activeClosure) displayMessage = activeClosure.message || 'Temporarily closed'
          else if (manualOverride?.isActive) displayMessage = manualOverride.message
          else {
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            displayMessage = operatingHours?.[dayNames[new Date().getDay()]]?.customMessage || ''
          }
          this.storeStatus = { isOpen, message: displayMessage, activeClosure: activeClosure || null }
          this.operatingHours = operatingHours || {}
        }
      } catch (e) { console.error('[Menu] loadStoreStatus', e) }
    },
    formatTime(time) {
      if (!time) return ''
      const [h, m] = time.split(':')
      const hour = parseInt(h, 10)
      return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
    }
  }
}
</script>

<style scoped>
/* Scrollbar hide */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/*
  scroll-margin-top: push section headers below the sticky bar when jumping.
  Mobile/tablet sticky bar is ~110px tall (search ~52px + tabs ~44px + padding).
  Desktop has no sticky bar so just a small offset.
*/
.menu-scroll-target { scroll-margin-top: 120px; }
@media (min-width: 1024px) {
  .menu-scroll-target { scroll-margin-top: 32px; }
}

/* Toast */
.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateX(100%); }

/* Badge */
.badge-pop-enter-active, .badge-pop-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.badge-pop-enter-from, .badge-pop-leave-to { opacity: 0; transform: scale(0); }

/* Menu card */
:deep(.menu-card) {
  display: flex; flex-direction: column; background: #ffffff; border-radius: 12px;
  padding: 0.875rem; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1);
  position: relative; overflow: hidden; max-width: 280px; margin: 0 auto; height: 220px;
}
:deep(.menu-card:hover) { transform: translateY(-6px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
:deep(.menu-card .image-container) {
  background: linear-gradient(135deg,#fafbfc 0%,#f3f4f6 100%); border-radius: 10px;
  padding: 0.5rem; margin-bottom: 0.625rem; height: 145px;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
:deep(.menu-card .image-container img) { width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); transition: transform 0.3s ease; }
:deep(.menu-card:hover .image-container img) { transform: scale(1.1); }
:deep(.menu-card .text-section) { flex: 1; display: flex; flex-direction: row; justify-content: space-between; align-items: center; gap: 0.625rem; }
:deep(.menu-card .product-name) { font-size: 0.8rem; font-weight: 700; color: #1a4189; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
:deep(.menu-card .product-price) { font-size: 0.95rem; font-weight: 700; color: #1a4189; white-space: nowrap; flex-shrink: 0; }

@media (prefers-reduced-motion: reduce) { :deep(.menu-card) { transition: none; } }
</style>