import { notFound } from "next/navigation"
import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { serialize } from "next-mdx-remote/serialize"
import { MDXContent } from "@/components/mdx-content"
import { Chip, Button } from "@heroui/react"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const mdxSource = await serialize(post.content)

  const formattedDate = new Date(post.date).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {/* Back Button */}
      <Button
        as={Link}
        href="/"
        variant="light"
        size="sm"
        startContent={<ArrowLeft className="w-4 h-4" />}
        className="mb-8 text-muted-foreground hover:text-foreground"
      >
        Tüm yazılar
      </Button>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readingTime}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Chip
              key={tag}
              as={Link}
              href={`/tags/${tag}`}
              size="sm"
              variant="flat"
              className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
            >
              {tag}
            </Chip>
          ))}
        </div>
      </header>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-lg text-muted-foreground mb-8 pb-8 border-b border-border italic">{post.excerpt}</p>
      )}

      {/* Content */}
      <div className="prose">
        <MDXContent source={mdxSource} />
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-border">
        <Button
          as={Link}
          href="/"
          variant="flat"
          className="bg-secondary text-secondary-foreground"
          startContent={<ArrowLeft className="w-4 h-4" />}
        >
          Diğer yazılara göz at
        </Button>
      </footer>
    </article>
  )
}
