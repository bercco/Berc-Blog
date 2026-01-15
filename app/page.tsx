import { getAllPosts } from "@/lib/posts"
import { BlogCard } from "@/components/blog-card"

export default function Home() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Tech, Systems, Future.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Yazılım, sistem tasarımı ve geleceğin teknolojileri hakkında derinlemesine içerikler. Production-ready
          insights.
        </p>
      </section>

      {/* Posts Grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span>Son Yazılar</span>
          <span className="text-sm font-normal text-muted-foreground">({posts.length})</span>
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Henüz yazı yok.</p>
            <p className="text-sm text-muted-foreground">content/blog klasörüne .mdx dosyaları ekleyerek başlayın.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
