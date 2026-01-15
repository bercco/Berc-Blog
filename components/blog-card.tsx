import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import type { Post } from "@/lib/posts"

interface BlogCardProps {
  post: Post
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card className="bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-2">
          <h2 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors text-balance">
            {post.title}
          </h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
