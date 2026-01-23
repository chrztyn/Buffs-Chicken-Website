import axios from 'axios'
import { useAdmin } from './useAdmin'

const API_BASE_URL = 'http://localhost:5001/api'

export const useApi = () => {
  const { token, getAuthHeader } = useAdmin()

  // Create axios instance
  const api: any = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Add token to requests
  api.interceptors.request.use((config) => {
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
    (response) => response,
    (error) => {
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
  const adminLogin = (email: string, password: string) =>
    api.post('/admin/login', { email, password })

  const adminRegister = (name: string, email: string, password: string) =>
    api.post('/admin/register', { name, email, password })

  // Product endpoints
  const getProducts = () => api.get('/products')
  const getProduct = (id: string) => api.get(`/products/${id}`)
  const getProductsByCategory = (categoryId: string) =>
    api.get(`/products/category/${categoryId}`)
  const createProduct = (data: any) => api.post('/admin/products', data)
  const updateProduct = (id: string, data: any) =>
    api.put(`/admin/products/${id}`, data)
  const deleteProduct = (id: string) => api.delete(`/admin/products/${id}`)

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
  const cancelOrder = (id: string) => api.put(`/orders/${id}/cancel`, {})

  // Blog endpoints
  const getBlogs = () => api.get('/blogs')
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
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllOrders,
    getUserOrders,
    getOrder,
    updateOrderStatus,
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
    deleteNotification
  }
}
