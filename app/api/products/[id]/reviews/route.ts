import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase/client"
import { z } from "zod"

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

// GET handler to fetch reviews for a product
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    console.log(`Fetching reviews for product ID: ${productId}`)

    // Get reviews from Supabase
    const { data: reviews, error } = await supabase
      .from("product_reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        updated_at,
        likes,
        is_verified_purchase,
        user_id,
        user_profiles (username, avatar_url)
      `)
      .eq("product_id", productId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    console.log(`Found ${reviews?.length || 0} reviews`)

    // Get the product's overall rating and review count
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("rating, reviews_count")
      .eq("id", productId)
      .single()

    if (productError) {
      console.error("Error fetching product:", productError)
    }

    // Get the current user's likes
    const { userId } = auth()
    let userLikes = []

    if (userId && reviews?.length > 0) {
      const reviewIds = reviews.map((review) => review.id)

      const { data: likes, error: likesError } = await supabase
        .from("product_review_likes")
        .select("review_id")
        .eq("user_id", userId)
        .in("review_id", reviewIds)

      if (likesError) {
        console.error("Error fetching user likes:", likesError)
      } else {
        userLikes = likes || []
      }

      // Mark reviews that the user has liked
      reviews.forEach((review) => {
        review.isLiked = userLikes.some((like) => like.review_id === review.id)
      })
    }

    return NextResponse.json({
      reviews,
      rating: product?.rating || 0,
      reviewsCount: product?.reviews_count || 0,
    })
  } catch (error) {
    console.error("Error in GET /api/products/[id]/reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST handler to add a new review
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = Number.parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    const body = await request.json()

    // Validate request body
    const validationResult = reviewSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid review data", details: validationResult.error.format() },
        { status: 400 },
      )
    }

    const { rating, comment } = validationResult.data

    console.log(`Adding/updating review for product ID: ${productId}, user ID: ${userId}`)

    // Check if user has already reviewed this product
    const { data: existingReview } = await supabase
      .from("product_reviews")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .single()

    if (existingReview) {
      console.log(`Updating existing review ID: ${existingReview.id}`)

      // Update existing review
      const { data: updatedReview, error } = await supabase
        .from("product_reviews")
        .update({
          rating,
          comment,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingReview.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating review:", error)
        return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        review: updatedReview,
        message: "Review updated successfully",
      })
    }

    console.log("Creating new review")

    // Check if user has purchased the product (for verified purchase badge)
    // This is a simplified check - in a real app, you'd check order history
    const { data: orderItems } = await supabase
      .from("order_items")
      .select(`
        id,
        orders!inner(id, user_id, status)
      `)
      .eq("product_id", productId)
      .eq("orders.user_id", userId)
      .eq("orders.status", "completed")

    const isVerifiedPurchase = orderItems && orderItems.length > 0

    // Add the review
    const { data: newReview, error } = await supabase
      .from("product_reviews")
      .insert({
        product_id: productId,
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

    return NextResponse.json({
      success: true,
      review: newReview,
      message: "Review added successfully",
    })
  } catch (error) {
    console.error("Error in POST /api/products/[id]/reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
