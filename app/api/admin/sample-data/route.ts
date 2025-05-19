import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase/admin-client"
import { products } from "@/lib/data/products"

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
      const { error: reviewError } = await supabaseAdmin.from("product_reviews").insert(review)

      if (reviewError) {
        console.error(`Error adding review for product ${review.product_id}:`, reviewError)
      }
    }

    // Update product ratings based on reviews
    for (const product of products.slice(0, 3)) {
      const { data: reviews } = await supabaseAdmin
        .from("product_reviews")
        .select("rating")
        .eq("product_id", product.id)

      if (reviews && reviews.length > 0) {
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

        const { error: updateError } = await supabaseAdmin
          .from("products")
          .update({
            rating: averageRating,
            reviews_count: reviews.length,
          })
          .eq("id", product.id)

        if (updateError) {
          console.error(`Error updating product ${product.id} rating:`, updateError)
        }
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
