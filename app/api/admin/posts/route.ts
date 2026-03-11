import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const posts = await sql`
      SELECT id, slug, title, description, content, date, tags, created_at, updated_at
      FROM posts
      ORDER BY date DESC
    `

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Posts fetch error:", error)
    return NextResponse.json({ error: "Yazilar yuklenemedi" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { slug, title, date, tags, description, content } = await request.json()

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

    // Mevcut post var mi kontrol et
    const existing = await sql`SELECT id FROM posts WHERE slug = ${cleanSlug}`

    if (existing.length > 0) {
      // Guncelle
      await sql`
        UPDATE posts 
        SET title = ${title}, 
            description = ${description || null}, 
            content = ${content}, 
            date = ${date || new Date().toISOString().split("T")[0]}, 
            tags = ${tags || []},
            updated_at = NOW()
        WHERE slug = ${cleanSlug}
      `
    } else {
      // Yeni kayit ekle
      await sql`
        INSERT INTO posts (slug, title, description, content, date, tags)
        VALUES (${cleanSlug}, ${title}, ${description || null}, ${content}, ${date || new Date().toISOString().split("T")[0]}, ${tags || []})
      `
    }

    return NextResponse.json({ success: true, slug: cleanSlug })
  } catch (error) {
    console.error("Post save error:", error)
    return NextResponse.json({ error: "Yazi kaydedilemedi" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { slug } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: "Slug zorunludur" }, { status: 400 })
    }

    const result = await sql`DELETE FROM posts WHERE slug = ${slug} RETURNING id`

    if (result.length === 0) {
      return NextResponse.json({ error: "Yazi bulunamadi" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Post delete error:", error)
    return NextResponse.json({ error: "Yazi silinemedi" }, { status: 500 })
  }
}
