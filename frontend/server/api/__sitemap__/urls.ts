import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const apiBase = config.public.apiBase

  try {
    const response = await $fetch<{ data: Array<{ slug: string }> }>(`${apiBase}/blogs`)
    const blogs = response?.data || []

    return blogs
      .filter((b) => b.slug)
      .map((b) => ({
        loc: `/blogs/${b.slug}`,
        changefreq: 'weekly',
        priority: 0.7
      }))
  } catch {
    return []
  }
})
