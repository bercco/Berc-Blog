import { getAllTags } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tags",
  description: "Tüm etiketler",
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Tüm Etiketler</h1>

      {tags.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Henüz etiket yok.</p>
        </div>
      ) : (
        <Card className="bg-card border border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              {tags.map(({ tag, count }) => (
                <Badge
                  key={tag}
                  asChild
                  variant="secondary"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer text-base px-4 py-2"
                >
                  <Link href={`/tags/${tag}`}>
                    {tag}
                    <span className="ml-1 text-xs opacity-70">({count})</span>
                  </Link>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
