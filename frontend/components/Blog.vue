<template>
    <section class="blog-section bg-[#FBF4E5] pb-16 lg:pb-20 pt-24 lg:pt-28 pl-4 sm:pl-6 lg:pl-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-12">
                <p class="text-gray-600">Loading blog posts...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-12">
                <p class="text-red-600">{{ error }}</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="blogPosts.length === 0" class="text-center py-12">
                <p class="text-gray-600">No blog posts available yet.</p>
            </div>

            <!-- Blog Posts List -->
            <div v-else class="space-y-0">
                <ClientOnly>
                    <article 
                        v-for="(post, index) in blogPosts" 
                        :key="post._id || post.id"
                        class="blog-post-item"
                        :style="{ animationDelay: `${index * 80}ms` }"
                    >
                        <div class="flex flex-col md:flex-row gap-6 md:gap-8">
                            <!-- Blog Image -->
                            <div class="w-full md:w-[300px] h-[200px] md:h-[280px] bg-[#D1D5DB] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                                <img 
                                    v-if="post.image"
                                    :src="post.image"
                                    :alt="post.title"
                                    class="w-full h-full object-cover"
                                />
                                <div 
                                    v-else 
                                    class="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-[Unbounded]"
                                >
                                    No Image
                                </div>
                            </div>
                            
                            <!-- Content -->
                            <div class="blog-content flex-1">
                                <p class="text-sm text-gray-600 mb-2 font-[Unbounded]">
                                    {{ new Date(post.createdAt || post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                                </p>
                                <h3 class="text-xl md:text-2xl lg:text-2xl font-bold text-gray-900 mb-3 font-[Unbounded]">
                                    {{ post.title }}
                                </h3>
                                <p class="text-gray-700 mb-4 leading-relaxed font-[Unbounded]">
                                    {{ post.excerpt || post.metaDescription }}
                                </p>
                                <NuxtLink 
                                    :to="`/blogs/${post.slug}`"
                                    class="inline-block text-[#2B5B9E] font-bold text-sm uppercase tracking-wide hover:underline font-[Unbounded]"
                                >
                                    CONTINUE READING
                                </NuxtLink>
                            </div>
                        </div>
                        <!-- Divider -->
                        <hr 
                            v-if="index < blogPosts.length - 1"
                            class="blog-divider border-t border-gray-300 my-8"
                        />
                    </article>
                </ClientOnly>
            </div>
            <!-- Divider after Blog Section -->
            <hr class="blog-divider border-t border-gray-300" />
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useApi } from '~/composables/useApi';

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  itemsPerPage: {
    type: Number,
    default: 5
  },
  searchQuery: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update-total']);

const loading = ref(true);
const error = ref(null);
const allBlogPosts = ref([]);

const { getBlogs } = useApi();

// Filter blogs based on search query
const filteredBlogs = computed(() => {
  if (!props.searchQuery || props.searchQuery.trim() === '') {
    return allBlogPosts.value;
  }

  const query = props.searchQuery.toLowerCase().trim();
  return allBlogPosts.value.filter(blog => {
    const titleMatch = blog.title?.toLowerCase().includes(query);
    const excerptMatch = blog.excerpt?.toLowerCase().includes(query);
    const descriptionMatch = blog.metaDescription?.toLowerCase().includes(query);
    const contentMatch = blog.content?.toLowerCase().includes(query);
    return titleMatch || excerptMatch || descriptionMatch || contentMatch;
  });
});

// Paginated posts - simple slice, no isVisible needed
const blogPosts = computed(() => {
  const startIndex = (props.currentPage - 1) * props.itemsPerPage;
  const endIndex = startIndex + props.itemsPerPage;
  return filteredBlogs.value.slice(startIndex, endIndex);
});

const loadBlogs = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await getBlogs();
    allBlogPosts.value = response.data.data || [];
    emit('update-total', filteredBlogs.value.length);
  } catch (err) {
    console.error('Failed to load blogs:', err);
    error.value = 'Failed to load blog posts';
  } finally {
    loading.value = false;
  }
};

// Watch for page changes
watch(() => props.currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Watch for search query changes
watch(() => props.searchQuery, () => {
  emit('update-total', filteredBlogs.value.length);
});

onMounted(() => {
  loadBlogs();
});
</script>

<style scoped>
.blog-post-item {
  animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .blog-post-item {
    animation: none;
  }
}
</style>