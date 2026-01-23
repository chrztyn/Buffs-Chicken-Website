<template>
  <div class="bg-white min-h-screen">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B5B9E]"></div>
        <p class="mt-4 text-gray-600">Loading article...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <p class="text-2xl font-bold text-gray-900 mb-4">Article Not Found</p>
        <p class="text-gray-600 mb-8">{{ error }}</p>
        <NuxtLink 
          to="/"
          class="inline-block bg-[#2B5B9E] text-white px-8 py-3 rounded-lg hover:bg-[#1e4670] transition-colors"
        >
          Back to Home
        </NuxtLink>
      </div>
    </div>

    <!-- Hero Section -->
    <div v-else-if="blog" class="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
      <!-- Hero Image -->
      <img
        v-if="blog.image"
        :src="blog.image"
        :alt="blog.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gradient-to-r from-[#1A4189] to-[#FE601C]"></div>
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      <!-- Back Button -->
      <button
        @click="goBack"
        class="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 group"
      >
        <svg
          class="w-5 h-5 text-gray-800 group-hover:text-[#FE601C] transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
      </button>

      <!-- Title Overlay -->
      <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 lg:p-16">
        <div class="max-w-5xl mx-auto">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-white/80 text-xs sm:text-sm font-['Unbounded']">
              {{ formatDate(blog.createdAt) }}
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-2 font-['Caprasimo']">
            {{ blog.title }}
          </h1>
          <p class="text-lg sm:text-xl md:text-2xl text-white/90 font-light italic font-['Unbounded']">
            {{ blog.excerpt || blog.metaDescription }}
          </p>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div v-if="blog" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
      <!-- Main Content Card -->
      <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 mb-12">
        <!-- Description -->
        <div class="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8">
          <p class="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {{ blog.description || blog.content }}
          </p>
        </div>

        <!-- Divider -->
        <div class="my-8 sm:my-12 border-t border-gray-200"></div>

        <!-- Full Content -->
        <div class="mt-8 sm:mt-12">
          <div class="prose prose-lg max-w-none space-y-6 text-gray-700 leading-relaxed">
            <div v-html="parseContent(blog.content)" class="font-['Unbounded'] text-base leading-8"></div>
          </div>
        </div>

                <!-- Meta Information -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div class="w-10 h-10 bg-[#FE601C]/20 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 text-[#FE601C]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-['Unbounded']">Published</p>
              <p class="text-sm font-semibold text-gray-800 font-['Unbounded']">
                {{ formatDateShort(blog.createdAt) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div class="w-10 h-10 bg-[#1A4189]/20 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 text-[#1A4189]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-['Unbounded']">Reading Time</p>
              <p class="text-sm font-semibold text-gray-800 font-['Unbounded']">
                {{ readTime }} min read
              </p>
            </div>
          </div>

          <div v-if="blog.category" class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div class="w-10 h-10 bg-[#FBF4E5] rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 text-[#FE601C]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-['Unbounded']">Category</p>
              <p class="text-sm font-semibold text-gray-800 font-['Unbounded']">
                {{ blog.category }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Posts Section -->
      <div v-if="relatedPosts.length > 0" class="mt-12 sm:mt-16">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 font-['Caprasimo']">
          More Stories
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="post in relatedPosts"
            :key="post._id"
            @click="goToRelatedBlog(post.slug)"
            class="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100"
          >
            <!-- Image Container -->
            <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                v-if="post.image"
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-[#1A4189] to-[#FE601C]"></div>
            </div>

            <!-- Content Container -->
            <div class="p-5 sm:p-6 flex flex-col flex-grow">
              <!-- Title -->
              <h3 class="text-base sm:text-lg md:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#FE601C] transition-colors font-['Unbounded']">
                {{ post.title }}
              </h3>

              <!-- Excerpt -->
              <p class="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 italic font-['Unbounded']">
                {{ post.excerpt || post.metaDescription }}
              </p>

              <!-- Footer -->
              <div class="flex items-center gap-2 text-xs text-gray-500 font-['Unbounded']">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                {{ formatDateShort(post.createdAt) }}
              </div>

              <!-- View Details Button -->
              <button class="mt-4 w-full bg-gradient-to-r from-[#FE601C] to-[#e5551a] text-white py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:from-[#e5551a] hover:to-[#cc4815] shadow-lg font-['Unbounded']">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from '~/composables/useApi'

const route = useRoute()
const router = useRouter()
const blog = ref<any>(null)
const relatedPosts = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const { getBlogBySlug, getBlogs } = useApi()

// Calculate read time (average 200 words per minute)
const readTime = computed(() => {
  if (!blog.value?.content || !blog.value?.description) return 5
  const wordCount = (blog.value.content + blog.value.description).split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 200))
})

// Format date
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format date short
const formatDateShort = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Parse content - simple markdown to HTML conversion
const parseContent = (content: string) => {
  if (!content) return ''
  
  let html = content
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Headings
    .replace(/^### (.*?)$/gm, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-3xl font-bold mt-10 mb-6">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-4xl font-bold mt-12 mb-8">$1</h1>')
    // Line breaks for paragraphs
    .split('\n\n')
    .map((para) => `<p class="mb-6">${para}</p>`)
    .join('')
    // Lists
    .replace(/\n- (.*?)(?=\n|$)/g, '<li class="ml-4 mb-2">$1</li>')
    .replace(/(<li.*?<\/li>)+/g, '<ul class="list-disc space-y-2 mb-6">$&</ul>')

  return html
}

// Fetch related posts
const fetchRelatedPosts = async () => {
  try {
    const response = await getBlogs()
    const allBlogs = response.data || []
    
    // Filter out current blog and get random 3
    const filtered = allBlogs.filter((b: any) => b._id !== blog.value._id)
    const shuffled = filtered.sort(() => 0.5 - Math.random())
    relatedPosts.value = shuffled.slice(0, 3)
  } catch (err) {
    console.error('Error fetching related posts:', err)
  }
}

// Fetch blog post
const loadBlog = async () => {
  try {
    loading.value = true
    const slug = route.params.slug as string
    
    if (!slug) {
      error.value = 'No article specified'
      return
    }

    const data = await getBlogBySlug(slug)
    
    if (!data || !data.data) {
      error.value = 'Article not found. It may have been deleted or the URL is incorrect.'
      return
    }

    blog.value = data.data
    
    // Fetch related posts after blog is loaded
    await fetchRelatedPosts()

    // Set page title and meta tags for SEO
    useHead({
      title: `${blog.value.title} | Buffs Chicken Blog`,
      meta: [
        {
          name: 'description',
          content: blog.value.metaDescription || blog.value.excerpt || `Read about ${blog.value.title} on Buffs Chicken blog`
        },
        {
          name: 'keywords',
          content: blog.value.metaKeywords?.join(', ') || 'buffs, chicken, blog'
        },
        {
          property: 'og:title',
          content: blog.value.title
        },
        {
          property: 'og:description',
          content: blog.value.metaDescription || blog.value.excerpt || blog.value.title
        },
        {
          property: 'og:type',
          content: 'article'
        },
        {
          property: 'article:published_time',
          content: blog.value.createdAt
        }
      ]
    })
  } catch (err) {
    console.error('Failed to load blog:', err)
    error.value = 'Failed to load the article. Please try again later.'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const goToRelatedBlog = (slug: string) => {
  router.push(`/blogs/${slug}`)
  window.scrollTo(0, 0)
}

onMounted(() => {
  loadBlog()
})
</script>

<style scoped>
/* Add any additional styles here */
.prose {
  color: #374151;
}

.prose strong {
  font-weight: 700;
  color: #1a4189;
}

.prose em {
  font-style: italic;
  color: #555;
}

.prose h1, .prose h2, .prose h3 {
  color: #1a4189;
  font-family: 'Caprasimo', cursive;
}
</style>
