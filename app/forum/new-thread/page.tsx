"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@clerk/nextjs"
import { forumCategories } from "@/lib/data/forum"

export default function NewThreadPage() {
  const router = useRouter()
  const { userId, isSignedIn } = useAuth()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not signed in
  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
        <p className="text-gray-400 mb-8">You need to be signed in to create a new thread.</p>
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !categoryId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Thread created",
        description: "Your thread has been posted successfully.",
      })

      // Redirect to forum
      router.push("/forum")
    } catch (error) {
      console.error("Error creating thread:", error)
      toast({
        title: "Error",
        description: "Failed to create thread. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-400 mb-8">
          <Link href="/forum" className="hover:text-white">
            Forum
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-white">New Thread</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">Create New Thread</h1>

        <div className="bg-dark-800 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title"
                className="bg-dark-700 border-dark-600 text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-dark-700 border-dark-600 text-white">
                  {forumCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thread content here..."
                className="min-h-[200px] bg-dark-700 border-dark-600 text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                Tags <span className="text-gray-500">(optional, comma separated)</span>
              </label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. technical analysis, beginner, strategy"
                className="bg-dark-700 border-dark-600 text-white"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/forum">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Thread"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
