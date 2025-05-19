import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase/admin-client"
import { products } from "@/lib/data/products"
import { hashMessage } from "@/lib/utils/hash"

export async function POST() {
  try {
    // Check if user is an admin
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you would check if the user is an admin
    // For now, we'll allow any authenticated user to add sample data

    console.log("Adding sample data to Supabase...")

    // Add sample products if they don't exist
    for (const product of products) {
      // Check if product already exists
      const { data: existingProduct } = await supabaseAdmin.from("products").select("id").eq("id", product.id).single()

      if (!existingProduct) {
        // Insert product
        const { error: productError } = await supabaseAdmin.from("products").insert({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description || "",
          image1: product.image1,
          image2: product.image2 || null,
          category: product.category,
          type: product.type,
          rating: 0,
          reviews_count: 0,
          inventory_quantity: Math.floor(Math.random() * 100) + 1,
          is_featured: Math.random() > 0.7,
        })

        if (productError) {
          console.error(`Error adding product ${product.id}:`, productError)
        }
      }
    }

    // Add sample reviews
    const sampleReviews = [
      {
        product_id: 1,
        user_id: userId,
        rating: 5,
        comment: "This is an excellent product! I highly recommend it.",
        is_verified_purchase: true,
      },
      {
        product_id: 2,
        user_id: userId,
        rating: 4,
        comment: "Good product, but could be better in some aspects.",
        is_verified_purchase: false,
      },
      {
        product_id: 3,
        user_id: userId,
        rating: 5,
        comment: "Absolutely love it! Will buy again.",
        is_verified_purchase: true,
      },
    ]

    for (const review of sampleReviews) {
      // Check if review already exists
      const { data: existingReview } = await supabaseAdmin
        .from("product_reviews")
        .select("id")
        .eq("product_id", review.product_id)
        .eq("user_id", review.user_id)
        .single()

      if (!existingReview) {
        const { error: reviewError } = await supabaseAdmin.from("product_reviews").insert(review)

        if (reviewError) {
          console.error(`Error adding review for product ${review.product_id}:`, reviewError)
        }
      }
    }

    // Add sample support messages
    const sampleMessages = [
      {
        user_id: userId,
        subject: "Question about shipping",
        content: "When will my order be shipped? I placed it 3 days ago.",
        status: "open",
        priority: "normal",
        category: "shipping",
      },
      {
        user_id: userId,
        subject: "Product defect",
        content: "I received a damaged product. What should I do?",
        status: "open",
        priority: "high",
        category: "returns",
      },
      {
        user_id: userId,
        subject: "Payment issue",
        content: "I was charged twice for my order. Please help!",
        status: "open",
        priority: "urgent",
        category: "billing",
      },
    ]

    for (const message of sampleMessages) {
      // Hash the message content
      const contentHash = await hashMessage(message.content)

      // Create a preview of the content
      const contentPreview = message.content.length > 50 ? `${message.content.substring(0, 50)}...` : message.content

      // Insert the message
      const { error: messageError } = await supabaseAdmin.from("support_messages").insert({
        user_id: message.user_id,
        subject: message.subject,
        content_hash: contentHash,
        content_preview: contentPreview,
        status: message.status,
        priority: message.priority,
        category: message.category,
      })

      if (messageError) {
        console.error(`Error adding support message:`, messageError)
      }
    }

    return NextResponse.json({ success: true, message: "Sample data added successfully" })
  } catch (error) {
    console.error("Error adding sample data:", error)
    return NextResponse.json(
      { error: "Failed to add sample data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
