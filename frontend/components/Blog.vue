<template>
    <section class="blog-section bg-[#F5F1E8] pb-16 lg:pb-20 pt-24 lg:pt-28 pl-4 sm:pl-6 lg:pl-8">
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
                    <div class="flex flex-col md:flex-row gap-6 md:gap-8 pb-24 md:pb-32">
                        <!-- Blog Image -->
                        <div class="w-full md:w-[250px] h-[250px] bg-[#D1D5DB] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                            <NuxtImg 
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
                        class="border-t border-gray-300 mt-24 md:mt-28"
                    />
                </article>
            </div>

            <!-- Pagination Controls -->
            <div v-if="!loading && blogPosts.length > 0" class="flex items-center justify-center gap-4 mt-16 pb-8">
                <button
                    @click="previousPage"
                    :disabled="currentPage === 1 || loading"
                    class="px-6 py-2 rounded-full font-['Unbounded'] font-semibold transition-all duration-200"
                    :class="currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#1A4189] text-white hover:bg-[#15306d] active:scale-95'"
                >
                    Previous
                </button>
                
                <div class="flex items-center gap-2">
                    <span class="text-gray-600 font-['Unbounded'] font-semibold">Page</span>
                    <input
                        v-model.number="currentPage"
                        type="number"
                        min="1"
                        :max="totalPages"
                        class="w-12 px-2 py-1 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1A4189]"
                    />
                    <span class="text-gray-600 font-['Unbounded'] font-semibold">of {{ totalPages }}</span>
                </div>
                
                <button
                    @click="nextPage"
                    :disabled="currentPage >= totalPages || loading"
                    class="px-6 py-2 rounded-full font-['Unbounded'] font-semibold transition-all duration-200"
                    :class="currentPage >= totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#FE601C] text-white hover:bg-[#e5540a] active:scale-95'"
                >
                    Next
                </button>
            </div>
            
            <!-- Divider after Blog Section -->
            <hr class="border-t border-gray-300 mt-24 md:mt-28" />
        </div>
    </section>
</template>

    <script setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import { useApi } from '~/composables/useApi';

    const blogPosts = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalBlogs = ref(0);

    const { getBlogs } = useApi();

    // Compute total pages
    const totalPages = computed(() => {
      return Math.ceil(totalBlogs.value / pageSize.value);
    });

    const loadBlogs = async (page = 1) => {
      try {
        loading.value = true;
        error.value = null;
        const response = await getBlogs({ page, limit: pageSize.value });
        blogPosts.value = response.data.data || [];
        totalBlogs.value = response.data.total || 0;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('Failed to load blogs:', err);
        error.value = 'Failed to load blog posts';
      } finally {
        loading.value = false;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    // Watch for page changes and load new data
    watch(currentPage, (newPage) => {
      loadBlogs(newPage);
    });

    onMounted(() => {
      loadBlogs(1);
    });
    </script>
