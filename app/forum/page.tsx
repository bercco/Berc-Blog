import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { forumCategories, forumThreads } from "@/data/forum-data"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { IoSearch } from "react-icons/io5"
import { ForumHeader } from "@/components/forum/forum-header"
import { ForumCategoryCard } from "@/components/forum/forum-category-card"
import { ForumThreadCard } from "@/components/forum/forum-thread-card"

export default function ForumPage() {
  const { userId } = auth()

  // Get the most recent threads
  const recentThreads = [...forumThreads]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  return (
    <main className="flex min-h-screen flex-col pt-24">
      <ForumHeader />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-white">Data Fortress Trading Forum</h1>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search forum..."
                className="pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-md text-white w-full md:w-64"
              />
              <IoSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
        </div>

        {/* Forum Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-dark-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-white mb-2">577</h3>
            <p className="text-gray-400">Active Threads</p>
          </div>
          <div className="bg-dark-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-white mb-2">12,453</h3>
            <p className="text-gray-400">Community Members</p>
          </div>
          <div className="bg-dark-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-white mb-2">157</h3>
            <p className="text-gray-400">Online Now</p>
          </div>
        </div>

        {/* Recent Threads */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Discussions</h2>
            <Link href="/forum/recent" className="text-gray-400 hover:text-white transition-colors">
              View All →
            </Link>
          </div>
          <div className="bg-dark-800 rounded-lg overflow-hidden">
            <div className="divide-y divide-dark-700">
              {recentThreads.map((thread) => (
                <ForumThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forumCategories.map((category) => (
              <ForumCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
