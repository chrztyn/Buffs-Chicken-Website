<template>
  <div class="p-4 lg:p-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="font-['Caprasimo'] text-4xl text-[#1A4189] mb-2">Products</h1>
        <p class="font-['Unbounded'] text-gray-600">Manage your menu items</p>
      </div>
      <button
        @click="openAddProduct"
        class="px-6 py-2 bg-[#FE601C] text-white font-['Unbounded'] font-bold rounded-lg hover:bg-[#e5551a] transition"
      >
        + Add Product
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="mb-6 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] font-['Unbounded']"
        />
        <select
          v-model="filterCategory"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] font-['Unbounded']"
        >
          <option value="">All Categories</option>
          <option value="wings">Wings</option>
          <option value="sandwiches">Sandwiches</option>
          <option value="combos">Combos</option>
          <option value="sides">Sides</option>
          <option value="meals">Meals</option>
          <option value="pasta">Pasta</option>
        </select>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="filteredProducts.length === 0" class="text-center py-12">
      <p class="text-gray-500 font-['Unbounded'] text-lg">No products found</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in filteredProducts"
        :key="product._id"
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-full"
      >
        <!-- Product Image -->
        <div class="w-full h-56 bg-gray-200 overflow-hidden flex-shrink-0">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Product Info -->
        <div class="p-5 flex flex-col flex-grow">
          <!-- Title -->
          <h3 class="font-['Caprasimo'] text-lg text-[#1A4189] mb-1 line-clamp-2">{{ product.name }}</h3>
          
          <!-- Description -->
          <p class="text-gray-600 text-xs font-['Unbounded'] mb-4 line-clamp-2 flex-grow">{{ product.description }}</p>

          <!-- Price & Status -->
          <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <span class="font-['Caprasimo'] text-2xl text-[#FE601C]">${{ product.price }}</span>
            <span
              :class="product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              class="px-2 py-1 rounded-full text-xs font-['Unbounded'] font-bold whitespace-nowrap"
            >
              {{ product.isAvailable ? 'Available' : 'Out of Stock' }}
            </span>
          </div>

          <!-- Variants & Add-ons Preview -->
          <div v-if="product.variants?.length > 0 || product.addons?.length > 0" class="mb-4 text-xs font-['Unbounded'] text-gray-700">
            <div class="flex gap-3">
              <span v-if="product.variants?.length > 0" class="flex items-center gap-1">
                <span class="font-semibold">Variants:</span>
                <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">{{ product.variants.length }}</span>
              </span>
              <span v-if="product.addons?.length > 0" class="flex items-center gap-1">
                <span class="font-semibold">Extras:</span>
                <span class="bg-green-100 text-green-700 px-2 py-1 rounded">{{ product.addons.length }}</span>
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              @click="openEditProduct(product)"
              class="flex-1 px-4 py-2 bg-[#1A4189] text-white font-['Unbounded'] font-bold rounded-lg hover:bg-[#153066] transition"
            >
              Edit
            </button>
            <button
              @click="deleteProduct(product._id)"
              class="flex-1 px-4 py-2 bg-[#FE601C] text-white font-['Unbounded'] font-bold rounded-lg hover:bg-[#e5551a] transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Form Modal -->
    <Modal
      :is-open="showProductModal"
      :title="editingProduct ? 'Edit Product' : 'Add New Product'"
      @close="closeProductModal"
      @submit="saveProduct"
    >
      <div class="space-y-4">
        <!-- Basic Info -->
        <div>
          <label class="block font-['Unbounded'] font-semibold text-[#1A4189] mb-2">
            Product Name *
          </label>
          <input
            v-model="productForm.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
          />
        </div>

        <div>
          <label class="block font-['Unbounded'] font-semibold text-[#1A4189] mb-2">
            Description
          </label>
          <textarea
            v-model="productForm.description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] resize-none"
          ></textarea>
        </div>

        <!-- Price & Category -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-['Unbounded'] font-semibold text-[#1A4189] mb-2">
              Price ($) *
            </label>
            <input
              v-model.number="productForm.price"
              type="number"
              step="0.01"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
            />
          </div>
          <div>
            <label class="block font-['Unbounded'] font-semibold text-[#1A4189] mb-2">
              Category
            </label>
        <select
          v-model="productForm.category"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
        >
          <option value="">Select Category</option>
          <option value="wings">Wings</option>
          <option value="sandwiches">Sandwiches</option>
          <option value="combos">Combos</option>
          <option value="sides">Sides</option>
          <option value="meals">Meals</option>
          <option value="pasta">Pasta</option>
        </select>
          </div>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block font-['Unbounded'] font-semibold text-[#1A4189] mb-2">
            Product Image
          </label>
          <div
            @click="triggerFileInput"
            @dragover.prevent="isDragOver = true"
            @dragleave="isDragOver = false"
            @drop.prevent="handleDrop"
            :class="[
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition',
              isDragOver 
                ? 'border-[#FE601C] bg-orange-50' 
                : 'border-gray-300 hover:border-[#FE601C]'
            ]"
          >
            <div v-if="!productForm.imagePreview" class="text-gray-500 font-['Unbounded']">
              <p class="mb-2">Click to upload or drag and drop</p>
              <p class="text-sm">PNG, JPG, GIF up to 10MB</p>
            </div>
            <div v-else class="relative inline-block">
              <img
                :src="productForm.imagePreview"
                alt="Preview"
                class="max-h-48 rounded-lg"
              />
              <button
                @click.stop="productForm.imagePreview = ''"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageUpload"
          />
        </div>

        <!-- Availability -->
        <div class="flex items-center gap-2">
          <input
            v-model="productForm.isAvailable"
            type="checkbox"
            id="isAvailable"
            class="w-4 h-4 rounded cursor-pointer"
          />
          <label for="isAvailable" class="font-['Unbounded'] font-semibold text-[#1A4189] cursor-pointer">
            Available for Order
          </label>
        </div>

        <!-- Variants Section -->
        <div class="border-t pt-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-['Unbounded'] font-bold text-[#1A4189]">Variants (Sizes/Types)</h3>
            <button
              @click="addVariant"
              type="button"
              class="px-3 py-1 bg-blue-100 text-blue-700 font-['Unbounded'] font-bold rounded text-sm hover:bg-blue-200"
            >
              + Add
            </button>
          </div>
          <div v-for="(variant, idx) in productForm.variants" :key="idx" class="mb-3 p-3 bg-blue-50 rounded-lg">
            <div class="grid grid-cols-2 gap-2 mb-2">
              <input
                v-model="variant.name"
                type="text"
                placeholder="e.g., Small, Medium, Large"
                class="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
              />
              <input
                v-model.number="variant.price"
                type="number"
                step="0.01"
                placeholder="Extra price"
                class="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
              />
            </div>
            <button
              @click="removeVariant(idx)"
              type="button"
              class="text-red-600 font-['Unbounded'] font-bold text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        </div>

        <!-- Add-ons/Extras Section -->
        <div class="border-t pt-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-['Unbounded'] font-bold text-[#1A4189]">Extras (Add-ons)</h3>
            <button
              @click="addAddon"
              type="button"
              class="px-3 py-1 bg-green-100 text-green-700 font-['Unbounded'] font-bold rounded text-sm hover:bg-green-200"
            >
              + Add
            </button>
          </div>
          <div v-for="(addon, idx) in productForm.addons" :key="idx" class="mb-3 p-3 bg-green-50 rounded-lg">
            <div class="grid grid-cols-2 gap-2 mb-2">
              <input
                v-model="addon.name"
                type="text"
                placeholder="e.g., Extra Cheese, Bacon"
                class="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
              />
              <input
                v-model.number="addon.price"
                type="number"
                step="0.01"
                placeholder="Price"
                class="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
              />
            </div>
            <button
              @click="removeAddon(idx)"
              type="button"
              class="text-red-600 font-['Unbounded'] font-bold text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        </div>

        <!-- Special Requests -->
        <div class="border-t pt-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="productForm.allowSpecialRequests"
              type="checkbox"
              class="w-4 h-4 rounded"
            />
            <span class="font-['Unbounded'] font-semibold text-[#1A4189]">
              Allow Special Requests
            </span>
          </label>
          <p class="text-sm text-gray-600 font-['Unbounded'] mt-1">
            Customers can add special requests in checkout
          </p>
        </div>
      </div>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :is-open="showDeleteConfirm"
      title="Delete Product?"
      :message="`Are you sure you want to delete '${deletingProduct?.name}'? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import Modal from '~/components/admin/Modal.vue'
import ConfirmModal from '~/components/admin/ConfirmModal.vue'

definePageMeta({
  layout: 'admin'
})

const { getProducts, getCategories, createProduct, updateProduct, deleteProduct: deleteProductApi } = useApi()

const products = ref<any[]>([])
const categories = ref<any[]>([])
const searchQuery = ref('')
const filterCategory = ref('')
const showProductModal = ref(false)
const editingProduct = ref<any>(null)
const fileInput = ref()
const isDragOver = ref(false)

const productForm = ref<any>({
  name: '',
  description: '',
  price: 0,
  category: '',
  image: '',
  imagePreview: '',
  isAvailable: true,
  variants: [],
  addons: [],
  allowSpecialRequests: false
})

const showDeleteConfirm = ref(false)
const deletingProduct = ref<any>(null)

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !filterCategory.value || product.category === filterCategory.value
    return matchesSearch && matchesCategory
  })
})

const loadProducts = async () => {
  try {
    const response = await getProducts()
    products.value = response.data
  } catch (error) {
    console.error('Failed to load products:', error)
  }
}

const loadCategories = async () => {
  try {
    const response = await getCategories()
    categories.value = response.data
    console.log('Categories loaded:', categories.value)
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const openAddProduct = () => {
  editingProduct.value = null
  productForm.value = {
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    imagePreview: '',
    isAvailable: true,
    variants: [],
    addons: [],
    allowSpecialRequests: false
  }
  showProductModal.value = true
}

const openEditProduct = (product: any) => {
  editingProduct.value = product
  productForm.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image,
    imagePreview: product.image,
    isAvailable: product.isAvailable,
    variants: product.variants || [],
    addons: product.addons || [],
    allowSpecialRequests: product.allowSpecialRequests || false
  }
  showProductModal.value = true
}

const closeProductModal = () => {
  showProductModal.value = false
  editingProduct.value = null
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    // Simulate a change event with the dropped file
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    const changeEvent = new Event('change', { bubbles: true })
    Object.defineProperty(changeEvent, 'target', {
      value: { files: dataTransfer.files },
      enumerable: true
    })
    handleImageUpload(changeEvent)
  }
}

const handleImageUpload = async (event: any) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    productForm.value.imagePreview = e.target?.result
  }
  reader.readAsDataURL(file)

  // Upload to backend (saves locally + Cloudinary backup)
  const formData = new FormData()
  formData.append('image', file)

  try {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      throw new Error('Admin token not found. Please log in again.')
    }

    const response = await fetch('http://localhost:5001/api/admin/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Upload failed')
    }
    
    const data = await response.json()
    productForm.value.image = data.url
    console.log('Image uploaded:', { local: data.url, cloudinary: data.cloudinaryUrl })
  } catch (error) {
    console.error('Image upload failed:', error)
    alert('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

const addVariant = () => {
  productForm.value.variants.push({ name: '', price: 0 })
}

const removeVariant = (idx: number) => {
  productForm.value.variants.splice(idx, 1)
}

const addAddon = () => {
  productForm.value.addons.push({ name: '', price: 0 })
}

const removeAddon = (idx: number) => {
  productForm.value.addons.splice(idx, 1)
}

const saveProduct = async () => {
  if (!productForm.value.name || !productForm.value.price) {
    alert('Please fill in all required fields')
    return
  }

  try {
    if (editingProduct.value) {
      await updateProduct(editingProduct.value._id, productForm.value)
    } else {
      await createProduct(productForm.value)
    }
    closeProductModal()
    await loadProducts()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to save product')
  }
}

const deleteProduct = (productId: string) => {
  deletingProduct.value = products.value.find((p) => p._id === productId)
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  try {
    await deleteProductApi(deletingProduct.value._id)
    showDeleteConfirm.value = false
    await loadProducts()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to delete product')
  }
}

onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>
