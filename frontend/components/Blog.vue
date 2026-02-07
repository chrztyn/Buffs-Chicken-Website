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
                <article 
                    v-for="(post, index) in blogPosts" 
                    :key="post._id || post.id"
                    class="blog-post-item"
                >
                    <div class="flex flex-col md:flex-row gap-6 md:gap-8">
                        <!-- Blog Image -->
                        <div class="w-full md:w-[300px] h-[200px] md:h-[280px] bg-[#D1D5DB] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                            <img 
                                v-if="post.image"
                                :src="post.image"
                                :alt="post.title"
                                class="w-full h-auto object-cover"
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
                        class="blog-divider border-t border-gray-300"
                    />
                </article>
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
      }
    });

    const emit = defineEmits(['update-total']);

    const blogPosts = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const allBlogPosts = ref([]);

    const { getBlogs } = useApi();

    // Calculate paginated posts based on currentPage and itemsPerPage
    const paginatedPosts = computed(() => {
      const startIndex = (props.currentPage - 1) * props.itemsPerPage;
      const endIndex = startIndex + props.itemsPerPage;
      return allBlogPosts.value.slice(startIndex, endIndex);
    });

    const loadBlogs = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await getBlogs();
        allBlogPosts.value = response.data.data || [];
        blogPosts.value = paginatedPosts.value;
        // Emit total blogs count to parent
        emit('update-total', allBlogPosts.value.length);
      } catch (err) {
        console.error('Failed to load blogs:', err);
        error.value = 'Failed to load blog posts';
      } finally {
        loading.value = false;
      }
    };

    // Watch for page changes and update displayed posts
    watch(() => props.currentPage, () => {
      blogPosts.value = paginatedPosts.value;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    onMounted(() => {
      loadBlogs();
    });
    </script>
