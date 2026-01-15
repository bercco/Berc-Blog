import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"

const BLOG_PATH = path.join(process.cwd(), "content/blog")

export interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  readingTime: string
  content: string
  coverImage?: string
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_PATH)) {
    return []
  }

  const files = fs.readdirSync(BLOG_PATH).filter((file) => file.endsWith(".mdx"))

  const posts = files.map((file) => {
    const slug = file.replace(".mdx", "")
    const raw = fs.readFileSync(path.join(BLOG_PATH, file), "utf-8")
    const { data, content } = matter(raw)

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString(),
      tags: data.tags || [],
      excerpt: data.excerpt || "",
      coverImage: data.coverImage,
      readingTime: readingTime(content).text,
      content,
    }
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts()
  return posts.find((post) => post.slug === slug)
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts()
  const tagCount: Record<string, number> = {}

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })

  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getPostsByTag(tag: string): Post[] {
  const posts = getAllPosts()
  return posts.filter((post) => post.tags.includes(tag))
}
