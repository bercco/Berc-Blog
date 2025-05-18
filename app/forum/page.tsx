"use client"

import { useState, useEffect } from "react"
import { ForumHeader } from "@/components/forum/forum-header"
import { ForumCategoryCard } from "@/components/forum/forum-category-card"
import { ForumThreadCard } from "@/components/forum/forum-thread-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { forumCategories, forumThreads } from "@/lib/data/forum"

export default function ForumPage() {
  const [categories, setCategories] = useState([])
  const [recentThreads, setRecentThreads] = useState([])
  const [popularThreads, setPopularThreads] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchForumData = async () => {
      try {
        setIsLoading(true)

        // Use our local data
        setCategories(forumCategories)

        // Recent threads - sort by created_at
        const recent = [...forumThreads]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)

        // Popular threads - sort by views
        const popular = [...forumThreads].sort((a, b) => b.views - a.views).slice(0, 5)

        setRecentThreads(recent)
        setPopularThreads(popular)
      } catch (error) {
        console.error("Error fetching forum data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchForumData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col pt-24">
      <ForumHeader />

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {categories.map((category) => (
            <ForumCategoryCard key={category.id} category={category} />
          ))}
        </div>

        <Tabs defaultValue="recent" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Discussions</h2>
            <TabsList>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="recent" className="bg-dark-800 rounded-lg overflow-hidden">
            <div className="divide-y divide-dark-700">
              {recentThreads.map((thread) => (
                <ForumThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="bg-dark-800 rounded-lg overflow-hidden">
            <div className="divide-y divide-dark-700">
              {popularThreads.map((thread) => (
                <ForumThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
