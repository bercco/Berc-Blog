import redis from "./client"

const CACHE_TTL = 60 * 60 // 1 hour in seconds

export const cacheKeys = {
  forumCategories: "forum:categories",
  forumThreads: (categoryId: string) => `forum:threads:${categoryId}`,
  forumThread: (threadId: string) => `forum:thread:${threadId}`,
  forumComments: (threadId: string) => `forum:comments:${threadId}`,
  productDetails: (productId: string) => `product:${productId}`,
  featuredProducts: "products:featured",
  productReviews: (productId: string) => `product:reviews:${productId}`,
}

export async function setCache<T>(key: string, data: T, ttl = CACHE_TTL): Promise<void> {
  await redis.set(key, JSON.stringify(data), "EX", ttl)
}

export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get(key)
  if (!data) return null
  try {
    return JSON.parse(data) as T
  } catch (error) {
    console.error("Error parsing cached data:", error)
    return null
  }
}

export async function deleteCache(key: string): Promise<void> {
  await redis.del(key)
}

export async function invalidateByPrefix(prefix: string): Promise<void> {
  const keys = await redis.keys(`${prefix}*`)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}
