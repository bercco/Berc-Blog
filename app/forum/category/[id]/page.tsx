"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, ChevronRight } from "lucide-react"
import { ForumHeader } from "@/components/forum/forum-header"
import { ForumThreadCard } from "@/components/forum/forum-thread-card"
import { useAuth } from "@clerk/nextjs"
import { forumCategories, forumThreads } from "@/lib/data/forum"

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const { userId } = useAuth()
  const [category, setCategory] = useState(null)
  const [threads, setThreads] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true)
        const categoryId = params.id

        // Find category by ID or slug
        const foundCategory = forumCategories.find((c) => c.id.toString() === categoryId || c.slug === categoryId)

        if (foundCategory) {
          setCategory(foundCategory)

          // Get threads for this category
          const categoryThreads = forumThreads.filter((thread) => thread.category_id === foundCategory.id)

          setThreads(categoryThreads)
        } else {
          router.push("/forum")
        }
      } catch (error) {
        console.error("Error fetching category:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategory()
  }, [params.id, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

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
          <span className="text-white">{category.name}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{category.name}</h1>
            <p className="text-gray-400">{category.description}</p>
          </div>

          {userId ? (
            <Link href="/forum/new-thread">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Thread
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button variant="outline">Sign in to Post</Button>
            </Link>
          )}
        </div>

        {/* Threads */}
        <div className="bg-dark-800 rounded-lg overflow-hidden">
          {threads.length > 0 ? (
            <div className="divide-y divide-dark-700">
              {threads.map((thread) => (
                <ForumThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-400 mb-4">No threads in this category yet.</p>
              {userId ? (
                <Link href="/forum/new-thread">
                  <Button>Start a New Thread</Button>
                </Link>
              ) : (
                <Link href="/sign-in">
                  <Button variant="outline">Sign in to Post</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
