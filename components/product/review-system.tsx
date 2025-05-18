"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Star, User, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "@/lib/utils"
import { useReviewStore } from "@/lib/data/products"

interface ReviewSystemProps {
  productId: string | number
}

export function ReviewSystem({ productId }: ReviewSystemProps) {
  const { userId, isSignedIn } = useAuth()
  const { toast } = useToast()
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get reviews from store
  const reviews = useReviewStore((state) => state.getProductReviews(Number(productId)))
  const addReview = useReviewStore((state) => state.addReview)
  const likeReview = useReviewStore((state) => state.likeReview)

  // Check if user has already reviewed
  const hasReviewed = userId ? reviews.some((review) => review.user_id === userId) : false

  const handleRatingClick = (rating: number) => {
    setUserRating(rating)
  }

  const handleSubmitReview = async () => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to leave a review.",
        variant: "destructive",
      })
      return
    }

    if (userRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Add review to store
      addReview({
        product_id: Number(productId),
        user_id: userId!,
        rating: userRating,
        comment: userComment.trim() || null,
        is_verified_purchase: Math.random() > 0.5, // Simulate verified purchase
        user: {
          username: "Current User", // In a real app, we'd get this from the user profile
          avatar_url: null,
        },
      })

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      })

      // Reset form
      setUserRating(0)
      setUserComment("")
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeReview = (reviewId: number) => {
    likeReview(reviewId)
    toast({
      title: "Review Liked",
      description: "You found this review helpful.",
    })
  }

  // Render stars for rating selection
  const renderRatingSelector = () => {
    return (
      <div className="flex items-center mb-4">
        <p className="mr-2 text-gray-300">Your Rating:</p>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingClick(rating)}
              className="focus:outline-none"
              disabled={isSubmitting}
            >
              <Star
                className={`h-6 w-6 ${rating <= userRating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
              />
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Render stars for displaying ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
          />
        ))}
      </div>
    )
  }

  // Calculate rating statistics
  const calculateRatingStats = () => {
    if (!reviews.length) return null

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    let total = 0

    reviews.forEach((review) => {
      counts[review.rating as keyof typeof counts]++
      total++
    })

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / total

    return {
      average: averageRating.toFixed(1),
      total,
      percentages: {
        5: total ? Math.round((counts[5] / total) * 100) : 0,
        4: total ? Math.round((counts[4] / total) * 100) : 0,
        3: total ? Math.round((counts[3] / total) * 100) : 0,
        2: total ? Math.round((counts[2] / total) * 100) : 0,
        1: total ? Math.round((counts[1] / total) * 100) : 0,
      },
    }
  }

  const stats = calculateRatingStats()

  return (
    <div className="bg-dark-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>

      {/* Rating summary */}
      {stats ? (
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="text-5xl font-bold text-white mb-2">{stats.average}</div>
            <div className="flex mb-1">{renderStars(Number.parseFloat(stats.average))}</div>
            <div className="text-sm text-gray-400">Based on {stats.total} reviews</div>
          </div>

          <div className="flex-grow">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center mb-2">
                <div className="flex items-center w-20">
                  <span className="text-sm text-gray-400 mr-1">{star}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="w-full bg-dark-600 rounded-full h-2.5 mx-2">
                  <div
                    className="bg-yellow-400 h-2.5 rounded-full"
                    style={{ width: `${stats.percentages[star as keyof typeof stats.percentages]}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400 w-14">
                  {stats.percentages[star as keyof typeof stats.percentages]}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 mb-6">
          <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
        </div>
      )}

      {/* Write review section */}
      {!hasReviewed ? (
        <div className="bg-dark-700 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>

          {isSignedIn ? (
            <div>
              {renderRatingSelector()}

              <div className="mb-4">
                <label htmlFor="review-comment" className="block text-sm font-medium text-gray-300 mb-1">
                  Your Review (optional)
                </label>
                <Textarea
                  id="review-comment"
                  placeholder="Share your experience with this product..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="bg-dark-600 border-dark-500 text-white"
                  disabled={isSubmitting}
                />
              </div>

              <Button onClick={handleSubmitReview} disabled={isSubmitting || userRating === 0}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-4">Please sign in to leave a review.</p>
              <Link href="/sign-in">
                <Button>Sign In</Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-dark-700 rounded-lg p-6 mb-8">
          <p className="text-gray-300">You've already reviewed this product. Thank you for your feedback!</p>
        </div>
      )}

      {/* Reviews list */}
      <h3 className="text-xl font-bold text-white mb-4">
        {reviews.length > 0 ? "Customer Reviews" : "No Reviews Yet"}
      </h3>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-dark-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                {review.user.avatar_url ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={review.user.avatar_url || "/placeholder.svg"}
                      alt={review.user.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-dark-500 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{review.user.username}</p>
                  <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(review.created_at))} ago</p>
                </div>
              </div>
              <div className="flex items-center">
                {renderStars(review.rating)}
                {review.is_verified_purchase && (
                  <span className="ml-2 text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>
            </div>

            {review.comment && <p className="text-gray-300 mb-3">{review.comment}</p>}

            <div className="flex items-center justify-between">
              <button
                onClick={() => handleLikeReview(review.id)}
                className="flex items-center text-sm text-gray-400 hover:text-white"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Helpful ({review.likes})
              </button>
              <span className="text-xs text-gray-500">Report</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
