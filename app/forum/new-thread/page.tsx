"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { forumCategories } from "@/data/forum-data"
import { IoArrowBack, IoAttach, IoImage, IoLink, IoSend } from "react-icons/io5"
import { ForumHeader } from "@/components/forum/forum-header"
import { useAuth } from "@clerk/nextjs"
import { useMetamask } from "@/hooks/use-metamask"

export default function NewThreadPage() {
  const router = useRouter()
  const { userId } = useAuth()
  const { isConnected, address } = useMetamask()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId && !isConnected) {
      alert("You must be signed in to create a thread")
      router.push("/sign-in")
      return
    }

    setIsSubmitting(true)

    // In a real app, this would submit to your API
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Success - redirect to forum
      alert("Thread created successfully!")
      router.push("/forum")
    } catch (error) {
      console.error("Error creating thread:", error)
      alert("Failed to create thread. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col pt-24">
      <ForumHeader />

      <div className="container mx-auto px-4 py-12">
        <Link href="/forum" className="flex items-center text-gray-400 hover:text-white mb-6">
          <IoArrowBack className="mr-2" />
          Back to Forum
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Create New Thread</h1>

          <div className="bg-dark-800 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Thread Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title"
                  required
                  className="bg-dark-700 border-dark-600 text-white"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full bg-dark-700 border-dark-600 text-white rounded-md px-3 py-2"
                >
                  <option value="">Select a category</option>
                  {forumCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                  Content
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thread content here..."
                  required
                  className="bg-dark-700 border-dark-600 text-white min-h-[200px]"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. investing, stocks, beginner"
                  className="bg-dark-700 border-dark-600 text-white"
                />
              </div>

              <div className="flex items-center gap-4">
                <button type="button" className="p-2 rounded-md bg-dark-700 hover:bg-dark-600 text-gray-300">
                  <IoAttach className="h-5 w-5" />
                </button>
                <button type="button" className="p-2 rounded-md bg-dark-700 hover:bg-dark-600 text-gray-300">
                  <IoImage className="h-5 w-5" />
                </button>
                <button type="button" className="p-2 rounded-md bg-dark-700 hover:bg-dark-600 text-gray-300">
                  <IoLink className="h-5 w-5" />
                </button>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-dark-600">
                <div className="text-sm text-gray-400">
                  {isConnected ? (
                    <div className="flex items-center">
                      <span className="mr-2">Posting as:</span>
                      <span className="bg-dark-700 px-2 py-1 rounded text-xs">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </span>
                    </div>
                  ) : userId ? (
                    <span>Posting as a registered user</span>
                  ) : (
                    <span className="text-yellow-500">You must be signed in to post</span>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || (!userId && !isConnected)}
                  className="flex items-center"
                >
                  {isSubmitting ? "Posting..." : "Post Thread"}
                  <IoSend className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
