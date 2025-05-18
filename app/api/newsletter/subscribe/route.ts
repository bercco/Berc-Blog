import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single()

    if (existingSubscriber) {
      return NextResponse.json({ message: "You're already subscribed!" }, { status: 200 })
    }

    // Add new subscriber
    const { error } = await supabase.from("newsletter_subscribers").insert([{ email, status: "active" }])

    if (error) {
      console.error("Error adding subscriber:", error)
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to the newsletter!",
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
