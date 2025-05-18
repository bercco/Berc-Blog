import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NewsletterForm } from "@/components/admin/newsletter-form"
import { NewsletterHistory } from "@/components/admin/newsletter-history"

export const dynamic = "force-dynamic"

async function getNewsletterHistory() {
  const { userId } = auth()
  if (!userId) return { newsletters: [] }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("newsletters")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching newsletters:", error)
    return { newsletters: [] }
  }

  return { newsletters: data || [] }
}

async function getSubscriberCount() {
  const supabase = createAdminClient()

  const { count, error } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  if (error) {
    console.error("Error fetching subscriber count:", error)
    return { count: 0 }
  }

  return { count: count || 0 }
}

export default async function NewslettersPage() {
  const { newsletters } = await getNewsletterHistory()
  const { count: subscriberCount } = await getSubscriberCount()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Newsletter Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Active Subscribers</h2>
          <p className="text-3xl font-bold">{subscriberCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Newsletters Sent</h2>
          <p className="text-3xl font-bold">{newsletters.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Average Open Rate</h2>
          <p className="text-3xl font-bold">42%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Send Newsletter</h2>
          <NewsletterForm subscriberCount={subscriberCount} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Newsletters</h2>
          <Suspense fallback={<div>Loading history...</div>}>
            <NewsletterHistory newsletters={newsletters} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
