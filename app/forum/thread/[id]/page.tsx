"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  MessageCircle,
  Eye,
  ThumbsUp,
  Share2,
  Flag,
  Reply,
  Facebook,
  Twitter,
  LinkedinIcon as LinkedIn,
  LinkIcon,
} from "lucide-react"
import { ForumHeader } from "@/components/forum/forum-header"
import { useAuth } from "@clerk/nextjs"
import { useMetamask } from "@/hooks/use-metamask"
import { useToast } from "@/components/ui/use-toast"
import { CommentBox } from "@/components/forum/comment-box"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { forumThreads, initialComments, organizeComments } from "@/lib/data/forum"

export default function ThreadPage() {
  const params = useParams()
  const router = useRouter()
  const threadId = params.id as string
  const { userId } = useAuth()
  const { isConnected } = useMetamask()
  const { toast } = useToast()

  const [thread, setThread] = useState(null)
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [replyingTo, setReplyingTo] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href)
    }

    fetchThread()
  }, [threadId])

  const fetchThread = async () => {
    if (!threadId) return

    try {
      setIsLoading(true)

      // Find thread in our local data
      const foundThread = forumThreads.find((t) => t.id.toString() === threadId)

      if (foundThread) {
        setThread(foundThread)
        fetchComments()
      } else {
        toast({
          title: "Error",
          description: "Thread not found",
          variant: "destructive",
        })
        router.push("/forum")
      }
    } catch (error) {
      console.error("Error fetching thread:", error)
      toast({
        title: "Error",
        description: "Failed to load thread. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchComments = async () => {
    if (!threadId) return

    try {
      setIsLoadingComments(true)

      // Filter comments for this thread from our local data
      const threadComments = initialComments.filter((c) => c.thread_id.toString() === threadId)

      // Organize comments into threads (parent/child structure)
      const organizedComments = organizeComments(threadComments)

      setComments(organizedComments)
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setIsLoadingComments(false)
    }
  }

  const handleLikeThread = async () => {
    if (!threadId || (!userId && !isConnected)) {
      toast({
        title: "Authentication required",
        description: "Please sign in or connect your wallet to like this thread.",
        variant: "destructive",
      })
      return
    }

    try {
      // Toggle like state
      setIsLiked(!isLiked)

      // Update thread likes count
      if (thread) {
        setThread({
          ...thread,
          likes: isLiked ? thread.likes - 1 : thread.likes + 1,
        })
      }

      toast({
        title: isLiked ? "Unliked" : "Liked",
        description: isLiked ? "You have unliked this thread" : "You have liked this thread",
      })
    } catch (error) {
      console.error("Error toggling like:", error)
      toast({
        title: "Error",
        description: "Failed to like thread. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link copied",
        description: "Thread link copied to clipboard",
      })
    } catch (error) {
      console.error("Error copying link:", error)
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCommentSubmitted = () => {
    fetchComments()
    setReplyingTo(null)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Thread not found</h1>
        <p className="text-gray-400 mb-8">The thread you're looking for doesn't exist or has been removed.</p>
        <Link href="/forum">
          <Button>Back to Forum</Button>
        </Link>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col pt-24">
      <ForumHeader />

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-400 mb-8">
          <Link href="/forum" className="hover:text-white">
            Forum
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/forum/category/${thread.category?.slug || thread.category_id}`} className="hover:text-white">
            {thread.category?.name || "Category"}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-white">{thread.title}</span>
        </div>

        {/* Thread Header */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-white mb-4">{thread.title}</h1>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={thread.user?.avatar_url || "/placeholder.svg?height=100&width=100"}
                  alt={thread.user?.username || "User"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-white">{thread.user?.username || "Unknown User"}</p>
                <p className="text-xs text-gray-400">Posted {formatDistanceToNow(new Date(thread.created_at))} ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" /> {thread.views}
              </span>
              <span className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" /> {thread.comment_count}
              </span>
              <span className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1" /> {thread.likes}
              </span>
            </div>
          </div>

          {/* Tags */}
          {thread.tags && thread.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {thread.tags.map((tag, index) => (
                <span key={index} className="inline-block px-3 py-1 bg-dark-700 text-gray-300 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-invert max-w-none mb-6">
            <p className="text-gray-300 whitespace-pre-line">{thread.content}</p>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center ${isLiked ? "bg-dark-600 text-white" : ""}`}
              onClick={handleLikeThread}
            >
              <ThumbsUp className="h-4 w-4 mr-2" /> {isLiked ? "Liked" : "Like"}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share this thread</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-4 justify-center">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(thread.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                    >
                      <LinkedIn className="h-5 w-5" />
                    </a>
                    <button
                      onClick={handleShareLink}
                      className="p-3 bg-dark-600 text-white rounded-full hover:bg-dark-500 transition-colors"
                    >
                      <LinkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <input
                      className="flex-1 px-3 py-2 bg-dark-700 border border-dark-600 rounded-l-md text-white"
                      value={shareUrl}
                      readOnly
                    />
                    <Button onClick={handleShareLink} className="rounded-l-none">
                      Copy
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" className="flex items-center">
              <Flag className="h-4 w-4 mr-2" /> Report
            </Button>
          </div>
        </div>

        {/* Comments */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Comments ({thread.comment_count})</h2>

          {isLoadingComments ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-dark-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                          <Image
                            src={comment.user?.avatar_url || "/placeholder.svg?height=100&width=100"}
                            alt={comment.user?.username || "User"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white">{comment.user?.username || "Unknown User"}</p>
                          <p className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(comment.created_at))} ago
                            {comment.is_edited && <span className="ml-2">(edited)</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1" /> {comment.likes}
                        </span>
                      </div>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 whitespace-pre-line">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <button className="text-sm text-gray-400 hover:text-white flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1" /> Like
                      </button>
                      <button
                        className="text-sm text-gray-400 hover:text-white flex items-center"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      >
                        <Reply className="h-3 w-3 mr-1" /> Reply
                      </button>
                    </div>

                    {/* Reply form */}
                    {replyingTo === comment.id && (
                      <div className="mt-4 ml-8">
                        <CommentBox
                          threadId={threadId}
                          onCommentSubmitted={handleCommentSubmitted}
                          placeholder={`Reply to ${comment.user?.username || "Unknown User"}...`}
                          parentId={comment.id}
                        />
                      </div>
                    )}

                    {/* Nested replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-8 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="bg-dark-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
                                  <Image
                                    src={reply.user?.avatar_url || "/placeholder.svg?height=100&width=100"}
                                    alt={reply.user?.username || "User"}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-white text-sm">
                                    {reply.user?.username || "Unknown User"}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {formatDistanceToNow(new Date(reply.created_at))} ago
                                    {reply.is_edited && <span className="ml-2">(edited)</span>}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="prose prose-invert max-w-none">
                              <p className="text-gray-300 text-sm whitespace-pre-line">{reply.content}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <button className="text-xs text-gray-400 hover:text-white flex items-center">
                                <ThumbsUp className="h-2 w-2 mr-1" /> Like
                              </button>
                              <button
                                className="text-xs text-gray-400 hover:text-white flex items-center"
                                onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
                              >
                                <Reply className="h-2 w-2 mr-1" /> Reply
                              </button>
                            </div>

                            {/* Nested reply form */}
                            {replyingTo === reply.id && (
                              <div className="mt-3">
                                <CommentBox
                                  threadId={threadId}
                                  onCommentSubmitted={handleCommentSubmitted}
                                  placeholder={`Reply to ${reply.user?.username || "Unknown User"}...`}
                                  parentId={comment.id}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-dark-800 rounded-lg p-8 text-center">
                  <p className="text-gray-400 mb-2">No comments yet</p>
                  <p className="text-gray-500">Be the first to comment on this thread</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reply Form */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Leave a Comment</h3>
          <CommentBox threadId={threadId} onCommentSubmitted={handleCommentSubmitted} />
        </div>
      </div>
    </main>
  )
}
