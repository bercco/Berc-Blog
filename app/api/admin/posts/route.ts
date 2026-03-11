import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const BLOG_PATH = path.join(process.cwd(), "content/blog")

export async function GET() {
  try {
    if (!fs.existsSync(BLOG_PATH)) {
      return NextResponse.json([])
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
        content,
      }
    })

    return NextResponse.json(
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    )
  } catch {
    return NextResponse.json({ error: "Yazilar yuklenemedi" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { slug, title, date, tags, excerpt, coverImage, content } = await request.json()

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: "Slug, baslik ve icerik zorunludur" },
        { status: 400 }
      )
    }

    // Slug'i temizle
    const cleanSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    const filePath = path.join(BLOG_PATH, `${cleanSlug}.mdx`)

    // Frontmatter olustur
    const frontmatter = {
      title,
      date: date || new Date().toISOString().split("T")[0],
      tags: tags || [],
      excerpt: excerpt || "",
      ...(coverImage && { coverImage }),
    }

    const fileContent = matter.stringify(content, frontmatter)

    // Klasor yoksa olustur
    if (!fs.existsSync(BLOG_PATH)) {
      fs.mkdirSync(BLOG_PATH, { recursive: true })
    }

    fs.writeFileSync(filePath, fileContent)

    return NextResponse.json({ success: true, slug: cleanSlug })
  } catch {
    return NextResponse.json({ error: "Yazi kaydedilemedi" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { slug } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: "Slug zorunludur" }, { status: 400 })
    }

    const filePath = path.join(BLOG_PATH, `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Yazi bulunamadi" }, { status: 404 })
    }

    fs.unlinkSync(filePath)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Yazi silinemedi" }, { status: 500 })
  }
}
