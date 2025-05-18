import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { supabase } from "@/lib/supabase/client"
import { Resend } from "resend"

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Resend API key not configured" }, { status: 500 })
    }

    const { topic, sendEmail = false } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Generate newsletter content with Gemini
    const prompt = `
      Generate a weekly investment newsletter about ${topic}. 
      The newsletter should include:
      
      1. A catchy title
      2. A brief introduction
      3. 3-4 key insights or news items related to ${topic}
      4. Market trends and analysis
      5. One actionable tip for investors
      6. A brief conclusion
      
      Format the content in HTML with appropriate headings, paragraphs, and styling.
      Keep the tone professional but engaging, and ensure all information is factual and balanced.
      The newsletter should be suitable for both beginner and experienced investors.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // If sendEmail is true, send the newsletter to subscribers
    let subscribers
    if (sendEmail) {
      // Get all active subscribers
      const { data: subs, error: fetchError } = await supabase
        .from("newsletter_subscribers")
        .select("email")
        .eq("status", "active")

      if (fetchError) {
        console.error("Error fetching subscribers:", fetchError)
        return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
      }

      subscribers = subs
      if (subscribers && subscribers.length > 0) {
        // Extract title from the generated content
        const titleMatch = text.match(/<h1[^>]*>(.*?)<\/h1>/i) || text.match(/<h2[^>]*>(.*?)<\/h2>/i)
        const title = titleMatch ? titleMatch[1] : "Weekly Investment Newsletter"

        // Send email to each subscriber
        // In a production environment, you would use a batch sending approach
        for (const subscriber of subscribers) {
          try {
            await resend.emails.send({
              from: "newsletter@yourdomain.com",
              to: subscriber.email,
              subject: title,
              html: text,
            })
          } catch (emailError) {
            console.error(`Error sending email to ${subscriber.email}:`, emailError)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      content: text,
      recipientCount: sendEmail ? subscribers?.length || 0 : 0,
    })
  } catch (error) {
    console.error("Newsletter generation error:", error)
    return NextResponse.json({ error: "Failed to generate newsletter" }, { status: 500 })
  }
}
