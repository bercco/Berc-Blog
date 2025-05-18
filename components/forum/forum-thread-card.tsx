import Link from "next/link"
import { formatDistanceToNow } from "@/lib/utils"
import { PinIcon, LockIcon, MessageCircle, Eye, ThumbsUp } from "lucide-react"
import type { ForumThread } from "@/types/forum"

interface ForumThreadCardProps {
  thread: ForumThread
}

export function ForumThreadCard({ thread }: ForumThreadCardProps) {
  return (
    <Link href={`/forum/thread/${thread.id}`}>
      <div className="p-4 hover:bg-dark-700 transition-colors">
        <div className="flex items-start">
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              {thread.isPinned && <PinIcon className="h-4 w-4 text-yellow-500" />}
              {thread.isLocked && <LockIcon className="h-4 w-4 text-red-500" />}
              <h3 className="font-medium text-white">{thread.title}</h3>
            </div>
            <p className="text-gray-400 text-sm line-clamp-1">{thread.content}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>Posted {formatDistanceToNow(new Date(thread.createdAt))} ago</span>
              <span className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" /> {thread.commentCount}
              </span>
              <span className="flex items-center">
                <Eye className="h-3 w-3 mr-1" /> {thread.views}
              </span>
              <span className="flex items-center">
                <ThumbsUp className="h-3 w-3 mr-1" /> {thread.likes}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
