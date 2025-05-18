import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email/resend"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id, is_active")
      .eq("email", email)
      .single()

    if (existingSubscriber) {
      // If already subscribed and active, return success
      if (existingSubscriber.is_active) {
        return NextResponse.json({
          success: true,
          message: "Already subscribed",
        })
      }

      // If inactive, reactivate the subscription
      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq("id", existingSubscriber.id)

      if (updateError) {
        console.error("Error reactivating subscription:", updateError)
        return NextResponse.json({ success: false, error: "Failed to reactivate subscription" }, { status: 500 })
      }
    } else {
      // Create new subscription
      const { error: insertError } = await supabase.from("newsletter_subscribers").insert({ email, is_active: true })

      if (insertError) {
        console.error("Error creating subscription:", insertError)
        return NextResponse.json({ success: false, error: "Failed to create subscription" }, { status: 500 })
      }
    }

    // Send welcome email
    await sendEmail({
      to: email,
      subject: "Welcome to the Aionyx Newsletter",
      template: "welcome",
      data: {
        name: email.split("@")[0], // Simple personalization
        heading: "Welcome to the Aionyx Newsletter",
        ctaText: "Explore Aionyx",
        ctaUrl: "https://aionyx.com",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to the newsletter",
    })
  } catch (error) {
    console.error("Error in newsletter subscription:", error)
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 })
  }
}
