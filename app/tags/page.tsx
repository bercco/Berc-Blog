import { getAllTags } from "@/lib/posts"
import { Chip, Card, CardBody } from "@heroui/react"
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
          <CardBody className="p-6">
            <div className="flex flex-wrap gap-3">
              {tags.map(({ tag, count }) => (
                <Chip
                  key={tag}
                  as={Link}
                  href={`/tags/${tag}`}
                  size="lg"
                  variant="flat"
                  className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {tag}
                  <span className="ml-1 text-xs opacity-70">({count})</span>
                </Chip>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
