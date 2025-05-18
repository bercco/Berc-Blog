"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string

  const response = await fetch("/api/newsletter/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })

  const data = await response.json()
  return data
}

function SubscribeButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Subscribing..." : "Subscribe"}
    </Button>
  )
}

export function NewsletterSubscription() {
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    const result = await subscribeToNewsletter(formData)

    if (result.success) {
      toast({
        title: "Subscription successful",
        description: "Thank you for subscribing to our newsletter!",
      })
      setEmail("")
    } else {
      toast({
        title: "Subscription failed",
        description: result.error || "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-2">Subscribe to our Newsletter</h3>
      <p className="text-gray-600 mb-4">Stay updated with the latest news, product launches, and community events.</p>

      <form action={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <SubscribeButton />
      </form>
    </div>
  )
}
