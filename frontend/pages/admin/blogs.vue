<template>
  <div class="p-4 lg:p-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="font-['Poppins'] font-bold text-4xl text-[#1A4189] mb-2">Blog</h1>
        <p class="font-['Poppins'] text-gray-600">Manage your blog posts</p>
      </div>
      <button
        @click="openAddBlog"
        class="px-6 py-2 bg-[#FE601C] text-white font-['Poppins'] font-bold rounded-lg hover:bg-[#e5551a] transition"
      >
        + New Post
      </button>
    </div>

    <!-- Published Blogs -->
    <div>
      <h2 class="font-['Poppins'] text-xl font-bold text-[#1A4189] mb-4">Published Posts</h2>

      <div v-if="publishedBlogs.length === 0" class="text-center py-12">
        <p class="text-gray-500 font-['Poppins'] text-lg">No published blogs yet</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="blog in publishedBlogs"
          :key="blog._id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <!-- Blog Image -->
          <div class="w-full h-48 bg-gray-200 overflow-hidden">
            <img
              v-if="blog.image"
              :src="blog.image"
              :alt="blog.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-['Poppins']">
              No Image
            </div>
          </div>

          <!-- Blog Info -->
          <div class="p-4 lg:p-6">
            <h3 class="font-['Poppins'] font-bold text-xl text-[#1A4189] mb-2">{{ blog.title }}</h3>
            <p class="text-gray-600 text-sm font-['Poppins'] mb-3 line-clamp-2">{{ blog.excerpt }}</p>

            <div class="flex items-center justify-between mb-4 text-xs font-['Poppins'] text-gray-600">
              <span>{{ formatDate(blog.publishedAt) }}</span>
              <span>{{ blog.views }} views</span>
            </div>

            <!-- Image Status Indicator -->
            <div class="mb-4 p-2 bg-gray-50 rounded text-xs font-['Poppins']">
              <span v-if="blog.image" class="text-green-600">✓ Image: Uploaded</span>
              <span v-else class="text-red-600">✗ No Image</span>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-2">
              <button
                @click="openEditBlog(blog)"
                class="flex-1 px-3 py-2.5 sm:py-2 bg-blue-100 text-blue-700 font-['Poppins'] font-bold text-sm rounded-lg hover:bg-blue-200 transition"
              >
                Edit
              </button>
              <button
                @click="deleteBlog(blog._id)"
                class="flex-1 px-3 py-2.5 sm:py-2 bg-red-100 text-red-700 font-['Poppins'] font-bold text-sm rounded-lg hover:bg-red-200 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Blog Form Modal -->
    <Modal
      :is-open="showBlogModal"
      :title="editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'"
      @close="closeBlogModal"
      @submit="saveBlog"
    >
      <div class="space-y-4">
        <!-- Title -->
        <div>
          <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">
            Blog Title *
          </label>
          <input
            v-model="blogForm.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
            placeholder="Enter blog title"
          />
        </div>

        <!-- Excerpt -->
        <div>
          <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">
            Excerpt *
          </label>
          <textarea
            v-model="blogForm.excerpt"
            rows="2"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] resize-none"
            placeholder="Brief summary of the blog post"
          ></textarea>
        </div>

        <!-- Blog Content -->
        <div>
          <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">
            Blog Content *
          </label>
          <textarea
            v-model="blogForm.content"
            rows="8"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] resize-none font-mono text-sm"
            placeholder="Write your blog content here..."
          ></textarea>
          <p class="text-xs text-gray-500 font-['Poppins'] mt-1">Supports HTML and Markdown</p>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">
            Featured Image
          </label>
          <div
            @click="triggerFileInput"
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#FE601C] transition"
          >
            <div v-if="!blogForm.imagePreview" class="text-gray-500 font-['Poppins']">
              <p class="mb-2">Click to upload or drag and drop</p>
              <p class="text-sm">PNG, JPG, GIF up to 10MB</p>
            </div>
            <div v-else class="relative inline-block">
              <img
                :src="blogForm.imagePreview"
                alt="Preview"
                class="max-h-40 rounded-lg"
              />
              <button
                @click.stop="blogForm.imagePreview = ''; blogForm.image = ''"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
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

        <!-- SEO Section -->
        <div class="border-t pt-4">
          <h3 class="font-['Poppins'] font-bold text-[#1A4189] mb-3">SEO Settings</h3>

          <!-- Meta Description -->
          <div class="mb-4">
            <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">
              Meta Description *
            </label>
            <textarea
              v-model="blogForm.metaDescription"
              rows="2"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] resize-none"
              placeholder="Brief description for search engines (150-160 chars)"
              maxlength="160"
            ></textarea>
            <p class="text-xs text-gray-500 font-['Poppins'] mt-1">
              {{ blogForm.metaDescription?.length || 0 }}/160 characters
            </p>
          </div>
        </div>

        <!-- Publishing -->
        <div class="border-t pt-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="blogForm.isPublished"
              type="checkbox"
              class="w-4 h-4 rounded"
            />
            <span class="font-['Poppins'] font-semibold text-[#1A4189]">
              Publish this post
            </span>
          </label>
        </div>
      </div>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :is-open="showDeleteConfirm"
      title="Delete Blog Post?"
      :message="`Are you sure you want to delete '${deletingBlog?.title}'? This action cannot be undone.`"
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
import { useAdmin } from '~/composables/useAdmin'
import Modal from '~/components/admin/Modal.vue'
import ConfirmModal from '~/components/admin/ConfirmModal.vue'

definePageMeta({
  layout: 'admin'
})

const { getBlogs, createBlog, updateBlog, deleteBlog: deleteBlogApi, uploadImage } = useApi()
const { token, getAuthHeader } = useAdmin()

const blogs = ref<any[]>([])
const showBlogModal = ref(false)
const editingBlog = ref<any>(null)
const fileInput = ref()

const blogForm = ref<any>({
  title: '',
  excerpt: '',
  content: '',
  image: '',
  imagePreview: '',
  metaDescription: '',
  isPublished: false
})

const showDeleteConfirm = ref(false)
const deletingBlog = ref<any>(null)

const publishedBlogs = computed(() => {
  return Array.isArray(blogs.value) ? blogs.value.filter((blog) => blog.isPublished) : []
})

const loadBlogs = async () => {
  try {
    console.log('Loading blogs from API...')
    const response = await getBlogs()
    console.log('API Response:', response.data)
    
    // Extract the blogs array from the response data
    const blogsData = Array.isArray(response.data) ? response.data : response.data?.data || []
    blogs.value = blogsData
    console.log('Blogs loaded successfully:', blogs.value.length, 'blogs')
  } catch (error) {
    console.error('Failed to load blogs:', error)
    blogs.value = []
  }
}

const openAddBlog = () => {
  editingBlog.value = null
  blogForm.value = {
    title: '',
    excerpt: '',
    content: '',
    image: '',
    imagePreview: '',
    metaDescription: '',
    isPublished: false
  }
  showBlogModal.value = true
}

const openEditBlog = (blog: any) => {
  editingBlog.value = blog
  blogForm.value = {
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content,
    image: blog.image,
    imagePreview: blog.image,
    metaDescription: blog.metaDescription,
    isPublished: blog.isPublished
  }
  showBlogModal.value = true
}

const closeBlogModal = () => {
  showBlogModal.value = false
  editingBlog.value = null
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleImageUpload = async (event: any) => {
  const file = event.target.files?.[0]
  if (!file) return

  console.log('Image upload started for file:', file.name, 'Size:', file.size)

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    blogForm.value.imagePreview = e.target?.result
    console.log('Image preview set')
  }
  reader.readAsDataURL(file)

  // Upload to backend
  try {
    console.log('Uploading to backend...')
    const response = await uploadImage(file)
    console.log('Backend upload successful:', response.data.url)
    blogForm.value.image = response.data.url
    console.log('Image URL set in form:', blogForm.value.image)
  } catch (error) {
    console.error('Image upload failed:', error)
    alert('Failed to upload image. Please try again.')
  }
}

const addKeyword = () => {
  // Keywords removed - no longer needed
}

const removeKeyword = (idx: number) => {
  // Keywords removed - no longer needed
}

const saveBlog = async () => {
  if (!blogForm.value.title || !blogForm.value.excerpt || !blogForm.value.content || !blogForm.value.metaDescription) {
    alert('Please fill in all required fields')
    return
  }

  try {
    console.log('Saving blog with data:', blogForm.value)
    if (editingBlog.value) {
      await updateBlog(editingBlog.value._id, blogForm.value)
    } else {
      await createBlog(blogForm.value)
    }
    closeBlogModal()
    await loadBlogs()
  } catch (error: any) {
    console.error('Error saving blog:', error.response?.data || error.message)
    alert(error.response?.data?.message || 'Failed to save blog')
  }
}

const deleteBlog = (blogId: string) => {
  console.log('Delete button clicked for blog:', blogId)
  deletingBlog.value = blogs.value.find((b) => b._id === blogId)
  console.log('Blog to delete:', deletingBlog.value)
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  try {
    console.log('Confirming delete for blog:', deletingBlog.value._id)
    const response = await deleteBlogApi(deletingBlog.value._id)
    console.log('Delete response:', response)
    
    // Immediately remove from local state before reloading
    const index = blogs.value.findIndex(b => b._id === deletingBlog.value._id)
    if (index !== -1) {
      blogs.value.splice(index, 1)
      console.log('Blog removed from local state')
    }
    
    showDeleteConfirm.value = false
    
    // Reload all blogs from server to ensure sync
    console.log('Reloading blogs from server...')
    await loadBlogs()
    console.log('Blogs reloaded:', blogs.value.length, 'blogs')
    
    alert('Blog deleted successfully!')
  } catch (error: any) {
    console.error('Delete error response:', error.response?.data)
    console.error('Delete error:', error.message)
    alert(error.response?.data?.message || 'Failed to delete blog: ' + error.message)
  }
}

const formatDate = (date: string | Date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadBlogs()
})
</script>
