"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/nextjs"
import { useMetamask } from "@/hooks/use-metamask"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import { IoAttach, IoImage, IoLink, IoSend, IoWallet } from "react-icons/io5"

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long"),
})

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
  const [isFocused, setIsFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { userId, isSignedIn } = useAuth()
  const { isConnected } = useMetamask()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      commentSchema.parse({ content })
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
        return
      }
    }

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800 rounded-lg p-6 text-center"
      >
        <p className="text-gray-400 mb-4">You need to be signed in to comment</p>
        <div className="flex justify-center gap-4">
          <Link href="/sign-in">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline">Sign In</Button>
            </motion.div>
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => window.ethereum?.request({ method: "eth_requestAccounts" })}>Connect Wallet</Button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-dark-800 rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative transition-all duration-300 ${isFocused ? "ring-2 ring-white/20" : ""}`}>
        <motion.textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            setError(null)
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full min-h-[120px] bg-dark-700 border border-dark-600 text-white mb-2 p-4 rounded-full transition-all duration-300 focus:outline-none resize-none"
          style={{ borderRadius: "1.5rem" }}
        />
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm mb-2"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 mb-4">
        {[
          { icon: <IoAttach className="h-5 w-5" />, label: "Attach file" },
          { icon: <IoImage className="h-5 w-5" />, label: "Add image" },
          { icon: <IoLink className="h-5 w-5" />, label: "Add link" },
        ].map((item, index) => (
          <motion.button
            key={index}
            type="button"
            className="p-2 rounded-full bg-dark-700 hover:bg-dark-600 text-gray-300 transition-colors"
            disabled={isSubmitting}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={item.label}
          >
            {item.icon}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        {isConnected ? (
          <div className="flex items-center text-sm text-gray-400">
            <IoWallet className="mr-2 h-4 w-4" />
            <span>
              Posting as: {window.ethereum?.selectedAddress?.slice(0, 6)}...
              {window.ethereum?.selectedAddress?.slice(-4)}
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

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="flex items-center rounded-full px-6"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
            <IoSend className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.form>
  )
}
