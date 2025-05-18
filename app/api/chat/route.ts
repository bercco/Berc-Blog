import { type NextRequest, NextResponse } from "next/server"
import { generateChatResponse } from "@/lib/ai/gemini"
import { createAdminClient } from "@/lib/supabase/admin"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate response using Gemini
    const response = await generateChatResponse(message, history)

    // If user is authenticated, store the chat history
    if (userId) {
      const supabase = createAdminClient()

      await supabase.from("chat_history").insert({
        user_id: userId,
        message,
        response: response.text,
        metadata: { history },
      })
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
