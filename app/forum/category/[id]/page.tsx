"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { forumCategories, forumThreads } from "@/data/forum-data"
import { formatDistanceToNow } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronRight, PinIcon, LockIcon, MessageCircle, Eye } from "lucide-react"

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.id as string

  // Find the category
  const category = forumCategories.find((c) => c.id === categoryId)
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Category not found</h1>
        <p className="text-gray-400 mb-8">The category you're looking for doesn't exist or has been removed.</p>
        <Link href="/forum">
          <Button>Back to Forum</Button>
        </Link>
      </div>
    )
  }

  // Get threads for this category
  const categoryThreads = forumThreads.filter((thread) => thread.category === categoryId)

  return (
    <main className="flex min-h-screen flex-col pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-400 mb-8">
          <Link href="/forum" className="hover:text-white">
            Forum
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-white">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{category.name}</h1>
            <p className="text-gray-400">{category.description}</p>
          </div>
          <Button>Create New Thread</Button>
        </div>

        {/* Threads List */}
        <div className="bg-dark-800 rounded-lg overflow-hidden mb-8">
          <div className="bg-dark-700 p-4 flex items-center text-sm font-medium text-gray-300">
            <div className="flex-grow">Thread</div>
            <div className="w-24 text-center hidden md:block">Replies</div>
            <div className="w-24 text-center hidden md:block">Views</div>
            <div className="w-32 text-center hidden md:block">Last Activity</div>
          </div>
          <div className="divide-y divide-dark-700">
            {categoryThreads.length > 0 ? (
              categoryThreads.map((thread) => (
                <Link href={`/forum/thread/${thread.id}`} key={thread.id}>
                  <div className="p-4 hover:bg-dark-700 transition-colors">
                    <div className="flex items-start">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          {thread.isPinned && <PinIcon className="h-4 w-4 text-yellow-500" />}
                          {thread.isLocked && <LockIcon className="h-4 w-4 text-red-500" />}
                          <h3 className="font-medium text-white">{thread.title}</h3>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-1">{thread.content}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 md:hidden">
                          <span className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" /> {thread.commentCount}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" /> {thread.views}
                          </span>
                          <span>Updated {formatDistanceToNow(new Date(thread.updatedAt))} ago</span>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center">
                        <div className="w-24 text-center text-gray-400">{thread.commentCount}</div>
                        <div className="w-24 text-center text-gray-400">{thread.views}</div>
                        <div className="w-32 text-center text-gray-400">
                          {formatDistanceToNow(new Date(thread.updatedAt))} ago
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                <p>No threads in this category yet.</p>
                <Button className="mt-4">Create the First Thread</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
