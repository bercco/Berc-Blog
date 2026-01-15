import { notFound } from "next/navigation"
import { getAllTags, getPostsByTag } from "@/lib/posts"
import { BlogCard } from "@/components/blog-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map(({ tag }) => ({ tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)

  return {
    title: `#${decodedTag}`,
    description: `"${decodedTag}" etiketli tüm yazılar`,
  }
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = getPostsByTag(decodedTag)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Button asChild variant="ghost" size="sm" className="mb-8">
        <Link href="/tags">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tüm etiketler
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">#{decodedTag}</h1>
      <p className="text-muted-foreground mb-8">{posts.length} yazı</p>

      <div className="space-y-4">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
