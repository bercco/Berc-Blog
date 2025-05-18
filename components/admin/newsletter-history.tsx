"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Newsletter {
  id: string
  title: string
  content: string
  created_at: string
  sent_by: string
  recipient_count: number
}

interface NewsletterHistoryProps {
  newsletters: Newsletter[]
}

export function NewsletterHistory({ newsletters }: NewsletterHistoryProps) {
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null)

  if (newsletters.length === 0) {
    return <p className="text-gray-500">No newsletters have been sent yet.</p>
  }

  return (
    <div className="space-y-4">
      {newsletters.map((newsletter) => (
        <div
          key={newsletter.id}
          className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => setSelectedNewsletter(newsletter)}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{newsletter.title}</h3>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(newsletter.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Sent to {newsletter.recipient_count} subscribers</p>
        </div>
      ))}

      <Dialog open={!!selectedNewsletter} onOpenChange={(open) => !open && setSelectedNewsletter(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedNewsletter?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedNewsletter?.content || "" }} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
