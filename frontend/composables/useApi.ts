import axios from 'axios'
import type { AxiosError, AxiosResponse } from 'axios'
import { useRuntimeConfig } from '#app'
import { useAdmin } from './useAdmin'

export const useApi = () => {
  const config = useRuntimeConfig()
  const { token, getAuthHeader } = useAdmin()

  const api: any = axios.create({
    baseURL: config.public.apiBase,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  console.log('[useApi] axios baseURL =', api.defaults.baseURL)

  // Add token to requests
  api.interceptors.request.use((config: any) => {
    if (token.value) {
      const authHeader = getAuthHeader()
      config.headers = {
        ...config.headers,
        ...authHeader
      }
    }
    return config
  })

  // Handle errors
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        const { clearToken } = useAdmin()
        clearToken()
        navigateTo('/admin/login')
      }
      return Promise.reject(error)
    }
  )

  // Admin endpoints
  const adminLogin = (username: string, password: string) =>
    api.post('/admin/login', { username, password })

  const adminRegister = (name: string, username: string, password: string) =>
    api.post('/admin/register', { name, username, password })

  // Product endpoints
  // Lightweight wrapper to make API calls resilient during build/SSR
const wrap = (fn: (...args: any[]) => Promise<any>, fallback: any = null) =>
  async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (err: any) {
      const message = err?.message || String(err)
      const url = err?.config?.url || ''
      console.warn(`[useApi] request failed (returning fallback) ${url} — ${message}`)
      // Return fallback wrapped in axios-like shape so components don't break
      return { data: fallback }
    }
  }

  const getProducts = wrap((params?: { page?: number; limit?: number }) =>
    api.get('/products', { params: { ...params, _t: Date.now() } }), [])
  const getProduct = wrap((id: string) => api.get(`/products/${id}`, { params: { _t: Date.now() } }), null)
  const getPopularPicks = wrap(() => api.get('/products/popular', { params: { _t: Date.now() } }), [])
  const getProductsByCategory = wrap((categoryId: string) =>
    api.get(`/products/category/${categoryId}`, { params: { _t: Date.now() } }), [])
  const createProduct = (data: any) => api.post('/products/admin/create', data)
  const updateProduct = (id: string, data: any) =>
    api.put(`/products/admin/${id}`, data)
  const deleteProduct = (id: string) => api.delete(`/products/admin/${id}`)
  const getAllProductsAdmin = () => api.get('/products/admin/all', { params: { _t: Date.now() } })

  // Category endpoints
  const getCategories = wrap(() => api.get('/categories'), [])
  const getCategory = wrap((id: string) => api.get(`/categories/${id}`), null)
  const getAllCategoriesAdmin = wrap(() => api.get('/categories/admin/all'), [])
  const createCategory = (data: any) => api.post('/categories/admin/create', data)
  const updateCategory = (id: string, data: any) =>
    api.put(`/categories/admin/${id}`, data)
  const deleteCategory = (id: string) => api.delete(`/categories/admin/${id}`)
  const reorderCategories = (updates: { categoryId: string; displayOrder: number }[]) =>
  api.patch('/categories/admin/reorder', { updates })

  // Order endpoints
  const getAllOrders = wrap(() => api.get('/admin/orders'), [])
  const getUserOrders = wrap((userId: string) => api.get(`/orders/user/${userId}`), [])
  const getOrder = wrap((id: string) => api.get(`/orders/${id}`), null)
  const updateOrderStatus = (id: string, status: string) =>
    api.put(`/admin/orders/${id}/status`, { status })
  const verifyOrderStatus = (id: string) =>
    api.get(`/admin/orders/${id}/verify`)
  const cancelOrder = (id: string) => api.put(`/orders/${id}/cancel`, {})

  // Blog endpoints - NOT wrapped so they can properly fail/succeed for SSR
  const getBlogs = (params?: { page?: number; limit?: number }) =>
    api.get('/blogs', { params })
  const getBlogBySlug = (slug: string) => api.get(`/blogs/slug/${slug}`)
  const getBlogsByCategory = (category: string) =>
    api.get(`/blogs/category/${category}`)
  const createBlog = (data: any) => api.post('/admin/blogs', data)
  const updateBlog = (id: string, data: any) => api.put(`/admin/blogs/${id}`, data)
  const deleteBlog = (id: string) => api.delete(`/admin/blogs/${id}`)

  // Analytics endpoints
  const getAnalytics = wrap(() => api.get('/admin/analytics/dashboard'), {})
  const getSummaryToday = () => api.get('/orders/summary/today')
  const getMonthlyAnalytics = (year: number, month: number) =>
    api.get(`/admin/analytics/monthly/${year}/${month}`)

  // Notification endpoints
  const getAdminNotifications = wrap(() => api.get('/notifications/admin'), [])
  const markNotificationRead = (id: string) =>
    api.put(`/notifications/${id}/read`, {})
  const deleteNotification = (id: string) => api.delete(`/notifications/${id}`)

  // Contact endpoints
  const submitContactForm = (data: any) => api.post('/contact/submit', data)

  // Upload endpoints
  const uploadImage = (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    
    return api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  // Voucher endpoints
  const getVouchers = () => api.get('/admin/vouchers')
  const createVoucher = (data: any) => api.post('/admin/vouchers', data)
  const updateVoucher = (id: string, data: any) => api.put(`/admin/vouchers/${id}`, data)
  const deleteVoucher = (id: string) => api.delete(`/admin/vouchers/${id}`)
  const toggleVoucher = (id: string) => api.patch(`/admin/vouchers/${id}/toggle`)
  const validateVoucher = (data: { code: string; orderTotal: number; cartItems?: any[] }) =>
  api.post('/vouchers/validate', data)

  // Modifier Group endpoints
  const getModifierGroups = wrap(() => api.get('/modifier-groups', { params: { _t: Date.now() } }), [])
  const createModifierGroup = (data: any) => api.post('/modifier-groups', data)
  const updateModifierGroup = (id: string, data: any) => api.put(`/modifier-groups/${id}`, data)
  const deleteModifierGroup = (id: string) => api.delete(`/modifier-groups/${id}`)

  // Store Settings endpoints
  const getStoreSettings = wrap(() => api.get('/store-settings'), {})
  const getStoreStatus = wrap(() => api.get('/store-settings/status'), {})
  const updateStoreSettings = (data: any) => api.put('/store-settings', data)
  const toggleStoreOverride = (data: any) => api.post('/store-settings/toggle-override', data)
  const addTemporaryClosure = (data: any) => api.post('/store-settings/temporary-closures', data)
  const deleteTemporaryClosure = (id: string) => api.delete(`/store-settings/temporary-closures/${id}`)

  // Event endpoints
  const getEvents = wrap(() => api.get('/events'), [])
  const getEventsByMonth = wrap((year: number, month: number) => 
    api.get(`/events/month/${year}/${month}`), [])
  const getEvent = wrap((id: string) => api.get(`/events/${id}`), null)
  const createEvent = (formData: FormData) => 
    api.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  const updateEvent = (id: string, formData: FormData) => 
    api.put(`/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  const deleteEvent = (id: string) => api.delete(`/events/${id}`)

  return {
    api,
    adminLogin,
    adminRegister,
    getProducts,
    getProduct,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProductsAdmin,
    getCategories,
    getCategory,
    getAllCategoriesAdmin,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    getAllOrders,
    getUserOrders,
    getOrder,
    updateOrderStatus,
    verifyOrderStatus,
    cancelOrder,
    getBlogs,
    getBlogBySlug,
    getBlogsByCategory,
    createBlog,
    updateBlog,
    deleteBlog,
    getAnalytics,
    getSummaryToday,
    getMonthlyAnalytics,
    getAdminNotifications,
    markNotificationRead,
    deleteNotification,
    submitContactForm,
    uploadImage,
    getPopularPicks,
    getStoreSettings,
    getStoreStatus,
    updateStoreSettings,
    toggleStoreOverride,
    addTemporaryClosure,
    deleteTemporaryClosure,
    getEvents,
    getEventsByMonth,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getModifierGroups,
    createModifierGroup,
    updateModifierGroup,
    deleteModifierGroup,
    getVouchers,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    toggleVoucher,
    validateVoucher
  }
}
