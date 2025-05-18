"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendBulkEmail } from "@/lib/email/resend"
import { generateNewsletterContent } from "@/lib/ai/newsletter"

export async function sendNewsletter(formData: FormData) {
  try {
    // Check authentication and authorization
    const { userId } = auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    // Get the admin client
    const supabase = createAdminClient()

    // Check if user has admin role
    const { data: userRole } = await supabase.from("user_roles").select("role").eq("user_id", userId).single()

    if (!userRole || userRole.role !== "admin") {
      return { success: false, error: "Unauthorized: Admin role required" }
    }

    // Get form data
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const useAi = formData.get("useAi") === "true"

    // Generate content with AI if requested
    let finalContent = content
    if (useAi) {
      const topics = formData.get("topics") as string
      const aiContent = await generateNewsletterContent(topics)
      finalContent = aiContent.content
    }

    // Get all active subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("is_active", true)

    if (subscribersError) {
      return { success: false, error: subscribersError.message }
    }

    if (!subscribers || subscribers.length === 0) {
      return { success: false, error: "No active subscribers found" }
    }

    // Send the newsletter
    const emails = subscribers.map((sub) => sub.email)
    const result = await sendBulkEmail({
      to: emails,
      subject: title,
      template: "newsletter",
      data: {
        title,
        content: finalContent,
        heading: title,
      },
    })

    if (!result.success) {
      return { success: false, error: "Failed to send newsletter" }
    }

    // Record the newsletter in the database
    const { error: insertError } = await supabase.from("newsletters").insert({
      title,
      content: finalContent,
      sent_by: userId,
      recipient_count: emails.length,
    })

    if (insertError) {
      return { success: false, error: insertError.message }
    }

    // Revalidate the newsletters page
    revalidatePath("/admin/newsletters")

    return { success: true }
  } catch (error) {
    console.error("Error sending newsletter:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
