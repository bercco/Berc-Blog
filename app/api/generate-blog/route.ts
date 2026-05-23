import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { imageUrls } = await request.json()

    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 })
    }

    // Build multimodal content with images
    const imageContent = imageUrls.map((url: string) => ({
      type: "image" as const,
      image: url,
    }))

    const result = await generateText({
      model: "google/gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: [
            ...imageContent,
            {
              type: "text",
              text: `Bu fotoğrafları analiz et ve Türkçe bir blog yazısı oluştur.

Lütfen aşağıdaki formatta JSON döndür:
{
  "title": "Blog yazısının çekici ve ilgi çekici başlığı",
  "content": "Blog yazısının tam içeriği. Markdown formatında olabilir. Paragraflar, alt başlıklar kullanabilirsin. En az 3-4 paragraf olsun. Fotoğraflardaki atmosferi, duyguları, detayları yansıt.",
  "tags": ["etiket1", "etiket2", "etiket3"]
}

Kurallar:
- Başlık yaratıcı ve dikkat çekici olsun
- İçerik samimi, kişisel bir blog tarzında olsun
- Fotoğraflardaki anı, yeri veya durumu betimle
- 3-5 arası ilgili etiket öner
- Sadece JSON formatında yanıt ver, başka bir şey ekleme`,
            },
          ],
        },
      ],
    })

    // Parse the JSON response
    let blogData
    try {
      // Extract JSON from the response (handle markdown code blocks)
      let jsonText = result.text
      const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        jsonText = jsonMatch[1]
      }
      blogData = JSON.parse(jsonText.trim())
    } catch {
      // If parsing fails, create a structured response from the text
      blogData = {
        title: "Anılardan Bir Sayfa",
        content: result.text,
        tags: ["blog", "anı", "fotoğraf"],
      }
    }

    return NextResponse.json(blogData)
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    )
  }
}
