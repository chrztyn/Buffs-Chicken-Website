<template>
    <section class="blog-section bg-[#F5F1E8] pb-16 lg:pb-20 pt-24 lg:pt-28 pl-4 sm:pl-6 lg:pl-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10">

            <!-- Blog Posts List -->
            <div class="space-y-0">
                <article 
                    v-for="(post, index) in blogPosts" 
                    :key="post.id"
                    class="blog-post-item"
                >
                    <div class="flex flex-col md:flex-row gap-6 md:gap-8 pb-24 md:pb-32">
                        <!-- Image Placeholder -->
                        <div class="w-full md:w-[250px] h-[250px] bg-[#D1D5DB] rounded-lg flex-shrink-0"></div>
                        
                        <!-- Content -->
                        <div class="blog-content flex-1">
                            <p class="text-sm text-gray-600 mb-2 font-[Unbounded]">
                                {{ post.date }}
                            </p>
                            <h3 class="text-xl md:text-2xl lg:text-2xl font-bold text-gray-900 mb-3 font-[Unbounded]">
                                {{ post.title }}
                            </h3>
                            <p class="text-gray-700 mb-4 leading-relaxed font-[Unbounded]">
                                {{ post.excerpt }}
                            </p>
                            <a 
                                href="#"
                                class="inline-block text-[#2B5B9E] font-bold text-sm uppercase tracking-wide hover:underline font-[Unbounded]"
                            >
                                CONTINUE READING
                            </a>
                        </div>
                    </div>
                    <!-- Divider -->
                    <hr 
                        v-if="index < blogPosts.length - 1"
                        class="border-t border-gray-300 mt-24 md:mt-28"
                    />
                </article>
            </div>
            
            <!-- Divider after Blog Section -->
            <hr class="border-t border-gray-300 mt-24 md:mt-28" />
        </div>
    </section>
</template>

    <script>
    export default {
    name: 'Blog',
    data() {
        return {
        blogPosts: [
            {
            id: 1,
            slug: 'blog-post-1',
            date: 'December 07, 2025',
            title: 'This is a blog title',
            excerpt: 'A strong sample headline starts here—designed to grab attention and draw readers in.',
            image: '/images/blog/placeholder-1.jpg'
            },
            {
            id: 2,
            slug: 'blog-post-2',
            date: 'December 07, 2025',
            title: 'This is a blog title',
            excerpt: 'A strong sample headline starts here—designed to grab attention and draw readers in.',
            image: '/images/blog/placeholder-2.jpg'
            },
            {
            id: 3,
            slug: 'blog-post-3',
            date: 'December 07, 2025',
            title: 'This is a blog title',
            excerpt: 'A strong sample headline starts here—designed to grab attention and draw readers in.',
            image: '/images/blog/placeholder-3.jpg'
            }
        ]
        }
    }
    }
    </script>
