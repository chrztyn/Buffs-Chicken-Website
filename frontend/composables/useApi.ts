import axios from 'axios'
import type { AxiosError, AxiosResponse } from 'axios'
import { useRuntimeConfig } from '#app'
import { useAdmin } from './useAdmin'

export const useApi = () => {
  const config = useRuntimeConfig()
  const { token, getAuthHeader } = useAdmin()

  // Create axios instance with runtime config
  const api: any = axios.create({
    baseURL: config.public.apiBase,
    headers: {
      'Content-Type': 'application/json'
    }
  })

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
        // Token expired - logout
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
  const getProducts = (params?: { page?: number; limit?: number }) => 
    api.get('/products', { params })
  const getProduct = (id: string) => api.get(`/products/${id}`)
  const getPopularPicks = () => api.get('/products/popular')
  const getProductsByCategory = (categoryId: string) =>
    api.get(`/products/category/${categoryId}`)
  const createProduct = (data: any) => api.post('/products/admin/create', data)
  const updateProduct = (id: string, data: any) =>
    api.put(`/products/admin/${id}`, data)
  const deleteProduct = (id: string) => api.delete(`/products/admin/${id}`)
  const getAllProductsAdmin = () => api.get('/products/admin/all')

  // Category endpoints
  const getCategories = () => api.get('/categories')
  const getCategory = (id: string) => api.get(`/categories/${id}`)
  const createCategory = (data: any) => api.post('/admin/categories', data)
  const updateCategory = (id: string, data: any) =>
    api.put(`/admin/categories/${id}`, data)
  const deleteCategory = (id: string) => api.delete(`/admin/categories/${id}`)

  // Order endpoints
  const getAllOrders = () => api.get('/admin/orders')
  const getUserOrders = (userId: string) => api.get(`/orders/user/${userId}`)
  const getOrder = (id: string) => api.get(`/orders/${id}`)
  const updateOrderStatus = (id: string, status: string) =>
    api.put(`/admin/orders/${id}/status`, { status })
  const verifyOrderStatus = (id: string) =>
    api.get(`/admin/orders/${id}/verify`)
  const cancelOrder = (id: string) => api.put(`/orders/${id}/cancel`, {})

  // Blog endpoints
  const getBlogs = (params?: { page?: number; limit?: number }) => 
    api.get('/blogs', { params })
  const getBlogBySlug = (slug: string) => api.get(`/blogs/slug/${slug}`)
  const getBlogsByCategory = (category: string) =>
    api.get(`/blogs/category/${category}`)
  const createBlog = (data: any) => api.post('/admin/blogs', data)
  const updateBlog = (id: string, data: any) => api.put(`/admin/blogs/${id}`, data)
  const deleteBlog = (id: string) => api.delete(`/admin/blogs/${id}`)

  // Analytics endpoints
  const getAnalytics = () => api.get('/admin/analytics/dashboard')

  // Notification endpoints
  const getAdminNotifications = () => api.get('/notifications/admin')
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
    createCategory,
    updateCategory,
    deleteCategory,
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
    getAdminNotifications,
    markNotificationRead,
    deleteNotification,
    submitContactForm,
    uploadImage,
    getPopularPicks
  }
}
