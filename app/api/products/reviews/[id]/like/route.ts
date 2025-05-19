import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase/client"

// POST handler to like/unlike a review
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reviewId = Number.parseInt(params.id)

    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 })
    }

    // Check if the review exists
    const { data: review, error: reviewError } = await supabase
      .from("product_reviews")
      .select("id")
      .eq("id", reviewId)
      .single()

    if (reviewError || !review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Check if the user has already liked this review
    const { data: existingLike } = await supabase
      .from("product_review_likes")
      .select("id")
      .eq("review_id", reviewId)
      .eq("user_id", userId)
      .single()

    if (existingLike) {
      // User has already liked this review, so unlike it
      await supabase.from("product_review_likes").delete().eq("id", existingLike.id)

      // Decrement the likes count
      await supabase.rpc("decrement_review_likes", {
        p_review_id: reviewId,
      })

      return NextResponse.json({
        success: true,
        liked: false,
        message: "Review unliked successfully",
      })
    } else {
      // User hasn't liked this review yet, so like it
      await supabase.from("product_review_likes").insert({
        review_id: reviewId,
        user_id: userId,
      })

      // Increment the likes count
      await supabase.rpc("increment_review_likes", {
        p_review_id: reviewId,
      })

      return NextResponse.json({
        success: true,
        liked: true,
        message: "Review liked successfully",
      })
    }
  } catch (error) {
    console.error("Error in POST /api/products/reviews/[id]/like:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
