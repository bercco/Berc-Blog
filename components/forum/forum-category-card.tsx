import Link from "next/link"
import { formatDistanceToNow } from "@/lib/utils"
import type { ForumCategory } from "@/types/forum"

interface ForumCategoryCardProps {
  category: ForumCategory
}

export function ForumCategoryCard({ category }: ForumCategoryCardProps) {
  return (
    <Link href={`/forum/category/${category.id}`}>
      <div className="bg-dark-800 p-6 rounded-lg hover:bg-dark-700 transition-colors">
        <h3 className="font-bold text-white text-lg mb-2">{category.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{category.description}</p>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{category.threadCount} threads</span>
          <span>Last activity {formatDistanceToNow(new Date(category.lastActivity))} ago</span>
        </div>
      </div>
    </Link>
  )
}
