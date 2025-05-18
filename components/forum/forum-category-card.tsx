import Link from "next/link"
import { formatDistanceToNow } from "@/lib/utils"

export function ForumCategoryCard({ category }) {
  return (
    <Link href={`/forum/category/${category.slug}`}>
      <div className="bg-dark-800 rounded-lg p-6 hover:bg-dark-700 transition-colors">
        <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
        <p className="text-gray-400 mb-4">{category.description}</p>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">{category.thread_count} threads</span>
          <span className="text-gray-500">
            Last activity {formatDistanceToNow(new Date(category.last_activity))} ago
          </span>
        </div>
      </div>
    </Link>
  )
}
