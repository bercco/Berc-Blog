import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase/client"
import { deleteCache, cacheKeys } from "@/lib/redis/cache"
import { z } from "zod"

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

// GET handler to fetch reviews for a product
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

    // Get reviews from database
    const { data: reviews, error } = await supabase
      .from("product_reviews")
      .select(`
        id,
        created_at,
        rating,
        comment,
        likes,
        is_verified_purchase,
        user_id,
        user_profiles(username, avatar_url)
      `)
      .eq("product_id", productId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

// POST handler to add a new review
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = params.id
    const body = await req.json()

    // Validate request body
    const validatedData = reviewSchema.safeParse(body)
    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid review data", details: validatedData.error.format() }, { status: 400 })
    }

    const { rating, comment } = validatedData.data

    // Check if user has already reviewed this product
    const { data: existingReview } = await supabase
      .from("product_reviews")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .single()

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 })
    }

    // Check if user has purchased the product (for verified purchase badge)
    const { data: orderItems } = await supabase
      .from("order_items")
      .select(`
        id,
        orders!inner(id, user_id, status)
      `)
      .eq("product_id", productId)
      .eq("orders.user_id", userId)
      .eq("orders.status", "paid")

    const isVerifiedPurchase = orderItems && orderItems.length > 0

    // Add the review
    const { data: review, error } = await supabase
      .from("product_reviews")
      .insert({
        product_id: Number.parseInt(productId),
        user_id: userId,
        rating,
        comment,
        is_verified_purchase: isVerifiedPurchase,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding review:", error)
      return NextResponse.json({ error: "Failed to add review" }, { status: 500 })
    }

    // Update product rating and review count
    await updateProductRating(Number.parseInt(productId))

    // Invalidate cache
    await deleteCache(cacheKeys.productReviews(productId))
    await deleteCache(cacheKeys.productDetails(productId))

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error("Error adding review:", error)
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 })
  }
}

// Helper function to update product rating
async function updateProductRating(productId: number) {
  try {
    // Calculate average rating
    const { data, error } = await supabase.rpc("calculate_average_rating", { p_product_id: productId })

    if (error) {
      console.error("Error calculating average rating:", error)
      return
    }

    const { average_rating, review_count } = data[0]

    // Update product with new rating and review count
    await supabase
      .from("products")
      .update({
        rating: average_rating,
        reviews_count: review_count,
      })
      .eq("id", productId)
  } catch (error) {
    console.error("Error updating product rating:", error)
  }
}
