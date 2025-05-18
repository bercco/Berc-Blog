"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { sendNewsletter } from "@/app/actions/send-newsletter"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

interface NewsletterFormProps {
  subscriberCount: number
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Sending..." : "Send Newsletter"}
    </Button>
  )
}

export function NewsletterForm({ subscriberCount }: NewsletterFormProps) {
  const [useAi, setUseAi] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    const result = await sendNewsletter(formData)

    if (result.success) {
      toast({
        title: "Newsletter sent",
        description: `Successfully sent to ${subscriberCount} subscribers.`,
      })

      // Reset the form
      const form = document.getElementById("newsletter-form") as HTMLFormElement
      form.reset()
    } else {
      toast({
        title: "Error sending newsletter",
        description: result.error || "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <form id="newsletter-form" action={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Newsletter Title</Label>
        <Input id="title" name="title" placeholder="Weekly Update: New Features and Community Highlights" required />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="useAi" name="useAi" checked={useAi} onCheckedChange={setUseAi} />
        <Label htmlFor="useAi">Generate content with AI</Label>
      </div>

      {useAi ? (
        <div>
          <Label htmlFor="topics">Topics (comma separated)</Label>
          <Input
            id="topics"
            name="topics"
            placeholder="NFT marketplace launch, community event, new crypto payment options"
            required
          />
        </div>
      ) : (
        <div>
          <Label htmlFor="content">Newsletter Content (HTML)</Label>
          <Textarea
            id="content"
            name="content"
            placeholder="<h2>Hello subscribers!</h2><p>Here's what's new this week...</p>"
            className="min-h-[200px]"
            required
          />
        </div>
      )}

      <div className="pt-2">
        <SubmitButton />
      </div>

      <p className="text-sm text-gray-500">This will send to {subscriberCount} active subscribers.</p>
    </form>
  )
}
