import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "@/lib/utils"
import { MessageCircle, Eye, PinIcon, LockIcon } from "lucide-react"

export function ForumThreadCard({ thread }) {
  return (
    <Link href={`/forum/thread/${thread.id}`}>
      <div className="p-4 hover:bg-dark-700 transition-colors">
        <div className="flex items-start">
          <div className="hidden md:block mr-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={thread.user?.avatar_url || "/placeholder.svg?height=100&width=100"}
                alt={thread.user?.username || "User"}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              {thread.is_pinned && <PinIcon className="h-4 w-4 text-yellow-500" />}
              {thread.is_locked && <LockIcon className="h-4 w-4 text-red-500" />}
              <h3 className="font-medium text-white">{thread.title}</h3>
            </div>

            <p className="text-gray-400 text-sm line-clamp-1">{thread.content}</p>

            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="text-gray-400">{thread.user?.username || "Unknown User"}</span>
              <span>Posted {formatDistanceToNow(new Date(thread.created_at))} ago</span>
              <span className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" /> {thread.comment_count}
              </span>
              <span className="flex items-center">
                <Eye className="h-3 w-3 mr-1" /> {thread.views}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
