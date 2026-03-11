import { neon } from "@neondatabase/serverless"
import readingTime from "reading-time"

const sql = neon(process.env.DATABASE_URL!)

export interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  readingTime: string
  content: string
  description?: string
}

interface DBPost {
  id: number
  slug: string
  title: string
  description: string | null
  content: string
  date: string
  tags: string[] | null
  created_at: string
  updated_at: string
}

function mapDBPostToPost(dbPost: DBPost): Post {
  return {
    slug: dbPost.slug,
    title: dbPost.title,
    date: dbPost.date,
    tags: dbPost.tags || [],
    excerpt: dbPost.description || "",
    description: dbPost.description || "",
    readingTime: readingTime(dbPost.content).text,
    content: dbPost.content,
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const posts = await sql`
      SELECT id, slug, title, description, content, date, tags, created_at, updated_at
      FROM posts
      ORDER BY date DESC
    ` as DBPost[]

    return posts.map(mapDBPostToPost)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const posts = await sql`
      SELECT id, slug, title, description, content, date, tags, created_at, updated_at
      FROM posts
      WHERE slug = ${slug}
      LIMIT 1
    ` as DBPost[]

    if (posts.length === 0) return undefined
    return mapDBPostToPost(posts[0])
  } catch (error) {
    console.error("Error fetching post:", error)
    return undefined
  }
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  try {
    const posts = await getAllPosts()
    const tagCount: Record<string, number> = {}

    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    })

    return Object.entries(tagCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error("Error fetching tags:", error)
    return []
  }
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  try {
    const posts = await sql`
      SELECT id, slug, title, description, content, date, tags, created_at, updated_at
      FROM posts
      WHERE ${tag} = ANY(tags)
      ORDER BY date DESC
    ` as DBPost[]

    return posts.map(mapDBPostToPost)
  } catch (error) {
    console.error("Error fetching posts by tag:", error)
    return []
  }
}
