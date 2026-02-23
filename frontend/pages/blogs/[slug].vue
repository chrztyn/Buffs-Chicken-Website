<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Navbar -->
    <Navbar />

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#FE601C] border-t-transparent"></div>
        <p class="mt-6 text-lg text-gray-600 font-['Unbounded']">Loading article...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen px-4">
      <div class="text-center max-w-md">
        <svg class="w-20 h-20 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="text-3xl font-bold text-gray-900 mb-4 font-['Unbounded']">Article Not Found</h2>
        <p class="text-gray-600 mb-8 font-['Unbounded']">{{ error }}</p>
        <NuxtLink
          to="/blogs"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-[#FE601C] to-[#e5540a] text-white px-8 py-3.5 rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-['Unbounded'] font-semibold"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Blog
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="blog" class="bg-[#FBF4E5]">
      <!-- Hero Section with Parallax Effect -->
      <div class="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] overflow-hidden">
        <!-- Hero Image with Parallax -->
        <div class="absolute inset-0 transform transition-transform duration-300" :style="{ transform: `translateY(${scrollY * 0.5}px)` }">
          <img
            v-if="blog.image"
            :src="blog.image"
            :alt="blog.title"
            class="w-full h-full object-cover scale-110"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-[#1A4189] via-[#2B5B9E] to-[#FE601C]"></div>
        </div>

        <!-- Gradient Overlays -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>

        <!-- Back Button -->
        <button
          @click="goBack"
          class="absolute top-6 left-4 sm:left-6 md:left-8 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-full shadow-xl hover:bg-white hover:shadow-2xl transition-all duration-300 group z-30 transform hover:scale-110"
        >
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 group-hover:text-[#FE601C] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>

        <!-- Title Content -->
        <div class="absolute bottom-0 left-0 right-0 pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-4 sm:px-6 md:px-8 lg:px-12 z-20">
          <div class="max-w-5xl mx-auto">
            <!-- Meta Info -->
            <div class="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <span class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs sm:text-sm font-['Unbounded'] font-medium">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ formatDate(blog.publishedAt || blog.createdAt) }}
              </span>
              <span class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs sm:text-sm font-['Unbounded'] font-medium">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ readTime }} min read
              </span>
            </div>

            <!-- Title -->
            <h1 class="blog-title-slug text-s sm:text-l md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 sm:mb-6 font-['Unbounded'] drop-shadow-2xl">
              {{ blog.title }}
            </h1>

            <!-- Excerpt -->
            <p class="blog-excerpt-slug text-base sm:text-md md:text-l lg:text-xl text-white/95 font-light max-w-3xl font-['Unbounded'] leading-relaxed drop-shadow-lg">
              {{ blog.excerpt || blog.metaDescription }}
            </p>
          </div>
        </div>
      </div>

      <!-- Article Content Container -->
      <div class="bg-[#FBF4E5] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 relative z-10">
        <!-- Main Content Card with Drop Shadow -->
        <article class="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden mb-8 sm:mb-12 md:mb-16">
          <div class="p-6 sm:p-8 md:p-10 lg:p-14">
            <!-- Article Content -->
            <div class="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none">
              <!-- Main Content -->
              <div v-html="parseContent(blog.content)" class="article-content font-['Unbounded'] text-base sm:text-lg leading-7 sm:leading-8 text-gray-800 space-y-5"></div>
            </div>

            <!-- Article Meta -->
            <div class="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 md:pt-10 border-t-2 border-gray-100">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div class="flex items-center gap-4 p-5 bg-gradient-to-br from-[#FE601C]/10 to-[#FE601C]/5 rounded-2xl border border-[#FE601C]/20">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#FE601C] to-[#e5540a] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm text-gray-600 font-['Unbounded'] mb-1">Published On</p>
                    <p class="text-sm sm:text-base font-bold text-gray-900 font-['Unbounded']">
                      {{ formatDateFull(blog.publishedAt || blog.createdAt) }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4 p-5 bg-gradient-to-br from-[#1A4189]/10 to-[#1A4189]/5 rounded-2xl border border-[#1A4189]/20">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#1A4189] to-[#2B5B9E] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm text-gray-600 font-['Unbounded'] mb-1">Written By</p>
                    <p class="text-sm sm:text-base font-bold text-gray-900 font-['Unbounded']">
                      Buffs Chicken Team
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- CTA Section -->
        <div class="bg-gradient-to-r from-[#1A4189] to-[#2B5B9E] rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden mb-8 sm:mb-12 md:mb-16 transform hover:scale-[1.02] transition-transform duration-500">
          <div class="relative p-6 sm:p-8 md:p-10 lg:p-12 text-center">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute top-0 left-0 w-40 h-40 bg-[#FBF4E5] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div class="absolute bottom-0 right-0 w-60 h-60 bg-[#FBF4E5] rounded-full translate-x-1/3 translate-y-1/3"></div>
            </div>

            <!-- Content -->
            <div class="relative z-10">
              <div class="inline-block mb-6">
                <div class="w-16 h-16 sm:w-20 sm:h-20 bg-[#FE601C] rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
              </div>

              <h3 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 font-['Unbounded']">
                Craving Something Delicious?
              </h3>
              <p class="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto font-['Unbounded'] leading-relaxed">
                Order our signature crispy chicken wings, loaded combos, and cheesy pastas now. Fresh, hot, and delivered straight to your door!
              </p>

              <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <NuxtLink
                  to="/menu"
                  class="inline-flex items-center gap-3 bg-gradient-to-r from-[#FE601C] to-[#e5540a] text-white px-8 sm:px-10 py-4 sm:py-4.5 rounded-full font-bold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-['Unbounded'] group w-full sm:w-auto justify-center"
                >
                  Order Now
                  <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </NuxtLink>

                <NuxtLink
                  to="/contact"
                  class="inline-flex items-center gap-3 bg-white text-[#1A4189] px-8 sm:px-10 py-4 sm:py-4.5 rounded-full font-bold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-['Unbounded'] w-full sm:w-auto justify-center"
                >
                  Contact Us
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Latest Blogs Section -->
        <div class="mb-8 sm:mb-12">
          <div class="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-['Unbounded']">
              Latest Blogs
            </h2>
            <p class="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-['Unbounded']">
              Explore more delicious stories and updates from Buffs Chicken
            </p>
          </div>

          <!-- Blog Cards Grid -->
          <div v-if="latestBlogs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <BlogCard
              v-for="post in latestBlogs"
              :key="post._id"
              :blog="post"
              @click="goToRelatedBlog(post.slug)"
            />
          </div>

          <!-- No Blogs Message -->
          <div v-else class="text-center py-8">
            <p class="text-gray-500 font-['Unbounded'] text-sm sm:text-base">
              No other blog posts available at the moment.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter, useSeoMeta } from '#app'
import { useApi } from '~/composables/useApi'
import BlogCard from '~/components/BlogCard.vue'
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'

const route = useRoute()
const router = useRouter()
const scrollY = ref(0)

const { getBlogBySlug, getBlogs } = useApi()

// Get slug from route params
const slug = computed(() => route.params.slug as string)

// Fetch blog data with proper SSR support and dynamic key
const { data: blogData, error: fetchError, refresh: refreshBlog } = await useAsyncData(
  () => `blog-${slug.value}`, // Dynamic key function
  async () => {
    console.log('Fetching blog with slug:', slug.value)
    const response = await getBlogBySlug(slug.value)
    console.log('Blog response:', response)
    // Backend returns { data: blog }, axios wraps in response.data
    const blog = response?.data?.data || null
    console.log('Extracted blog:', blog)
    
    if (!blog) {
      throw new Error('Blog not found')
    }
    
    return blog
  },
  { 
    watch: [() => route.params.slug], // Watch the route param directly
    server: true,
    lazy: false
  }
)

// Fetch latest blogs with SSR support
const { data: latestBlogsData } = await useAsyncData(
  () => `latest-blogs-${slug.value}`,
  async () => {
    const response = await getBlogs()
    const allBlogs = response?.data?.data || response?.data || []
    
    // Filter out current blog and show only published ones
    return allBlogs
      .filter((b: any) => 
        b.slug !== slug.value && 
        b.isPublished !== false
      )
      .sort((a: any, b: any) => {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime()
        const dateB = new Date(b.publishedAt || b.createdAt).getTime()
        return dateB - dateA
      })
      .slice(0, 3)
  },
  { 
    watch: [() => route.params.slug],
    server: true,
    lazy: false
  }
)

const blog = computed(() => blogData.value)
const latestBlogs = computed(() => latestBlogsData.value || [])
const loading = computed(() => !blogData.value && !fetchError.value)
const error = computed(() => {
  if (fetchError.value) return 'Failed to load the article. Please try again later.'
  if (!blogData.value) return 'Article not found. It may have been deleted or the URL is incorrect.'
  return null
})

// Set up SEO meta tags - these work with SSR for proper crawling
useSeoMeta({
  title: () => blog.value ? `${blog.value.title} | Buffs Chicken Blog` : 'Buffs Chicken Blog',
  description: () => blog.value?.metaDescription || blog.value?.excerpt || 'Read the latest from Buffs Chicken',
  ogTitle: () => blog.value?.title || 'Buffs Chicken Blog',
  ogDescription: () => blog.value?.metaDescription || blog.value?.excerpt || '',
  ogType: 'article',
  ogImage: () => blog.value?.image || 'https://www.buffschicken.com/buffs-logo.webp',
  ogUrl: () => `https://www.buffschicken.com/blogs/${slug.value}`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => blog.value?.title || 'Buffs Chicken Blog',
  twitterDescription: () => blog.value?.metaDescription || blog.value?.excerpt || '',
  twitterImage: () => blog.value?.image || 'https://www.buffschicken.com/buffs-logo.webp',
})

// Add canonical URL and JSON-LD structured data for SEO
useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `https://www.buffschicken.com/blogs/${slug.value}`
    }
  ],
  script: blog.value ? [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blog.value.title,
        description: blog.value.metaDescription || blog.value.excerpt || '',
        image: {
          '@type': 'ImageObject',
          url: blog.value.image || 'https://www.buffschicken.com/buffs-logo.webp',
          width: 1200,
          height: 630
        },
        datePublished: blog.value.publishedAt || blog.value.createdAt,
        dateModified: blog.value.updatedAt || blog.value.createdAt,
        author: { 
          '@type': 'Organization', 
          name: 'Buffs Chicken', 
          url: 'https://www.buffschicken.com' 
        },
        publisher: {
          '@type': 'Organization',
          name: 'Buffs Chicken',
          url: 'https://www.buffschicken.com',
          logo: { 
            '@type': 'ImageObject', 
            url: 'https://www.buffschicken.com/buffs-logo.webp',
            width: 600,
            height: 60
          }
        },
        mainEntityOfPage: { 
          '@type': 'WebPage', 
          '@id': `https://www.buffschicken.com/blogs/${slug.value}` 
        },
        articleBody: (blog.value.content || '').substring(0, 500) + '...',
        wordCount: (blog.value.content || '').split(/\s+/).length,
        inLanguage: 'en-PH',
        keywords: blog.value.category || 'food, chicken, restaurant, Philippines'
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://www.buffschicken.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Blogs',
            'item': 'https://www.buffschicken.com/blogs'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': blog.value.title,
            'item': `https://www.buffschicken.com/blogs/${slug.value}`
          }
        ]
      })
    }
  ] : []
}))

// Handle scroll for parallax effect
const handleScroll = () => {
  scrollY.value = window.scrollY
}

onMounted(() => {
  if (process.client) {
    window.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScroll)
  }
})

// Calculate read time
const readTime = computed(() => {
  if (!blog.value?.content || !blog.value?.description) return 5
  const wordCount = (blog.value.content + blog.value.description).split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 200))
})

// Format dates
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatDateFull = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Parse markdown content
const parseContent = (content: string) => {
  if (!content) return ''

  let html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#1A4189]">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/^### (.*?)$/gm, '<h3 class="text-xl sm:text-2xl font-bold mt-10 mb-5 text-[#1A4189] font-[\'Unbounded\']">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-2xl sm:text-3xl font-bold mt-12 mb-6 text-[#1A4189] font-[\'Unbounded\']">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-3xl sm:text-4xl font-bold mt-14 mb-8 text-[#1A4189] font-[\'Unbounded\']">$1</h1>')
    .split('\n\n')
    .map((para) => `<p class="mb-6">${para}</p>`)
    .join('')
    .replace(/\n- (.*?)(?=\n|$)/g, '<li class="ml-4 mb-3">$1</li>')
    .replace(/(<li.*?<\/li>)+/g, '<ul class="list-disc list-inside space-y-3 mb-8 pl-4">$&</ul>')

  return html
}

// Navigation functions
const goBack = () => {
  router.push('/blogs')
}

const goToRelatedBlog = async (newSlug: string) => {
  await router.push(`/blogs/${newSlug}`)
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Article Content Styling */
.article-content :deep(p) {
  margin-bottom: 1.5rem;
  line-height: 1.75;
}

.article-content :deep(strong) {
  font-weight: 700;
  color: #1A4189;
}

.article-content :deep(em) {
  font-style: italic;
  color: #374151;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3) {
  font-family: 'Unbounded', cursive;
}

.article-content :deep(ul) {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.article-content :deep(li) {
  color: #374151;
  line-height: 1.75;
  margin-bottom: 0.75rem;
}

/* Smooth Scroll */
html {
  scroll-behavior: smooth;
}
</style>
