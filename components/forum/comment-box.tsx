"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useAuth } from "@clerk/nextjs"
import { useMetamask } from "@/hooks/use-metamask"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { IoAttach, IoImage, IoLink, IoSend, IoWallet } from "react-icons/io5"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface CommentBoxProps {
  threadId: string | number
  onCommentSubmitted?: () => void
  placeholder?: string
  parentId?: number
}

export function CommentBox({
  threadId,
  onCommentSubmitted,
  placeholder = "Write your reply here...",
  parentId,
}: CommentBoxProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { userId, isSignedIn } = useAuth()
  const { isConnected, address } = useMetamask()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before submitting.",
        variant: "destructive",
      })
      return
    }

    if (!userId && !isConnected) {
      toast({
        title: "Authentication required",
        description: "Please sign in or connect your wallet to comment.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/forum/threads/${threadId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          parent_id: parentId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setContent("")
        toast({
          title: "Comment submitted",
          description: "Your comment has been posted successfully.",
        })

        if (onCommentSubmitted) {
          onCommentSubmitted()
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit comment. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload in a real implementation
    const files = e.target.files
    if (files && files.length > 0) {
      toast({
        title: "File selected",
        description: "File upload is not implemented in this demo.",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-dark-800 rounded-lg p-6">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isSignedIn || isConnected ? placeholder : "Sign in to comment"}
        className="bg-dark-700 border-dark-600 text-white mb-4 min-h-[120px]"
        disabled={(!isSignedIn && !isConnected) || isSubmitting}
      />

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple />

      <div className="flex items-center gap-4 mb-4">
        <button
          type="button"
          className="p-2 rounded-md bg-dark-700 hover:bg-dark-600 text-gray-300 transition-colors"
          disabled={(!isSignedIn && !isConnected) || isSubmitting}
          onClick={handleFileClick}
        >
          <IoAttach className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="p-2 rounded-md bg-dark-700 hover:bg-dark-600 text-gray-300 transition-colors"
          disabled={(!isSignedIn && !isConnected) || isSubmitting}
          onClick={handleFileClick}
        >
          <IoImage className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="p-2 rounded-md bg-dark-700 hover:bg-dark-600 text-gray-300 transition-colors"
          disabled={(!isSignedIn && !isConnected) || isSubmitting}
        >
          <IoLink className="h-5 w-5" />
        </button>
      </div>

      <div className="flex justify-between items-center">
        {isConnected ? (
          <div className="flex items-center text-sm text-gray-400">
            <IoWallet className="mr-2 h-4 w-4" />
            <span>
              Posting as: {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
        ) : isSignedIn ? (
          <div className="text-sm text-gray-400">Posting as a registered user</div>
        ) : (
          <div className="text-sm text-yellow-500">
            <Link href="/sign-in" className="underline">
              Sign in
            </Link>{" "}
            to comment
          </div>
        )}

        <Button
          type="submit"
          disabled={!content.trim() || (!isSignedIn && !isConnected) || isSubmitting}
          className="flex items-center"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
          <IoSend className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
