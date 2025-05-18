"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Mail, CheckCircle2 } from "lucide-react"

interface NewsletterSignupProps {
  variant?: "default" | "inline" | "card"
  title?: string
  description?: string
}

export function NewsletterSignup({
  variant = "default",
  title = "Subscribe to our Newsletter",
  description = "Get the latest investment tips, market insights, and exclusive content delivered to your inbox every week.",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setEmail("")
        toast({
          title: "Subscription successful",
          description: data.message || "You've been subscribed to our newsletter!",
        })
      } else {
        toast({
          title: "Subscription failed",
          description: data.error || "Failed to subscribe. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      toast({
        title: "Subscription failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting || isSuccess}
            className="pr-10"
          />
          {isSuccess && <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />}
        </div>
        <Button type="submit" disabled={isSubmitting || isSuccess}>
          {isSubmitting ? "Subscribing..." : isSuccess ? "Subscribed" : "Subscribe"}
        </Button>
      </form>
    )
  }

  if (variant === "card") {
    return (
      <div className="bg-dark-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-dark-600 p-2 rounded-full">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>

        <p className="text-gray-300 mb-6">{description}</p>

        {isSuccess ? (
          <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-900 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
            <p className="text-green-300">Thank you for subscribing! Check your inbox for a confirmation email.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 mb-6 max-w-md mx-auto">{description}</p>

      {isSuccess ? (
        <div className="flex items-center justify-center gap-2 text-green-500">
          <CheckCircle2 className="h-5 w-5" />
          <span>Thank you for subscribing!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="flex-grow"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      )}
    </div>
  )
}
