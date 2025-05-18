"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@clerk/nextjs"
import { useMetamask } from "@/hooks/use-metamask"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface CommentBoxProps {
  threadId: string
  onCommentSubmitted: () => void
  placeholder?: string
  parentId?: number | null
}

export function CommentBox({
  threadId,
  onCommentSubmitted,
  placeholder = "Write your comment...",
  parentId = null,
}: CommentBoxProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { userId, isSignedIn } = useAuth()
  const { isConnected } = useMetamask()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    if (!isSignedIn && !isConnected) {
      toast({
        title: "Authentication required",
        description: "Please sign in or connect your wallet to comment.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Comment submitted",
        description: "Your comment has been posted successfully.",
      })

      setContent("")
      onCommentSubmitted()
    } catch (error) {
      console.error("Error submitting comment:", error)
      toast({
        title: "Error",
        description: "Failed to submit your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isSignedIn && !isConnected) {
    return (
      <div className="bg-dark-800 rounded-lg p-6 text-center">
        <p className="text-gray-400 mb-4">You need to be signed in to comment</p>
        <div className="flex justify-center gap-4">
          <Link href="/sign-in">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Button onClick={() => window.ethereum?.request({ method: "eth_requestAccounts" })}>Connect Wallet</Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-dark-800 rounded-lg p-6">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] bg-dark-700 border-dark-600 text-white mb-4"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          {isSubmitting ? "Submitting..." : parentId ? "Reply" : "Comment"}
        </Button>
      </div>
    </form>
  )
}
