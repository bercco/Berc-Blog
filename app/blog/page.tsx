import { getAllPosts } from "@/lib/posts"
import { BlogCard } from "@/components/blog-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tüm Yazılar | Berkay Blog",
  description: "Yazılım, sistem tasarımı ve geleceğin teknolojileri hakkında tüm blog yazıları.",
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <section className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Tüm Yazılar</h1>
        <p className="text-muted-foreground">
          Toplam {posts.length} yazı bulunuyor.
        </p>
      </section>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Henüz yazı yok.</p>
          <p className="text-sm text-muted-foreground">
            content/blog klasörüne .mdx dosyaları ekleyerek başlayın.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
