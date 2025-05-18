import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateNewsletterContent(topics: string) {
  try {
    const prompt = `
      Generate a newsletter for a Web3 and e-commerce platform called Aionyx.
      The newsletter should cover the following topics: ${topics}.
      
      Format the content in HTML with proper headings, paragraphs, and styling.
      Include sections for:
      1. Introduction
      2. Main topics (${topics})
      3. Community highlights
      4. Upcoming features or events
      5. Closing thoughts
      
      Keep the tone professional but friendly, and make it engaging for readers interested in Web3, NFTs, and e-commerce.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    return { success: true, content: text }
  } catch (error) {
    console.error("Error generating newsletter content:", error)
    return {
      success: false,
      content: "<p>Failed to generate content. Please try again later.</p>",
      error,
    }
  }
}
