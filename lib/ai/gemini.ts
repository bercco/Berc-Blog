// This file might be causing the issue if the Google Generative AI package isn't properly imported
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY!

export const geminiAI = new GoogleGenerativeAI(apiKey)

export async function generateChatResponse(message: string, history: { role: "user" | "model"; parts: string }[] = []) {
  try {
    const model = geminiAI.getGenerativeModel({ model: "gemini-pro" })

    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    })

    const result = await chat.sendMessage(message)
    const response = await result.response
    const text = response.text()

    return { text, success: true }
  } catch (error) {
    console.error("Error generating chat response:", error)
    return {
      text: "Sorry, I encountered an error while processing your request. Please try again later.",
      success: false,
    }
  }
}
