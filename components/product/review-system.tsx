"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { Star, User, ThumbsUp, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().optional(),
})

interface ReviewSystemProps {
  productId: string
}

interface Review {
  id: number
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
  likes: number
  is_verified_purchase: boolean
  user_id: string
  user_profiles: {
    username: string
    avatar_url: string | null
  }
  isLiked?: boolean
}

export function ReviewSystem({ productId }: ReviewSystemProps) {
  const { userId, isSignedIn } = useAuth()
  const { toast } = useToast()

  const [reviews, setReviews] = useState<Review[]>([])
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [overallRating, setOverallRating] = useState(0)
  const [reviewsCount, setReviewsCount] = useState(0)
  const [userHasReviewed, setUserHasReviewed] = useState(false)
  const [userReview, setUserReview] = useState<Review | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/products/${productId}/reviews`)

      if (!response.ok) {
        throw new Error("Failed to fetch reviews")
      }

      const data = await response.json()

      setReviews(data.reviews || [])
      setOverallRating(data.rating || 0)
      setReviewsCount(data.reviewsCount || 0)

      // Check if the current user has already reviewed this product
      if (userId) {
        const userReview = data.reviews.find((review: Review) => review.user_id === userId)

        if (userReview) {
          setUserHasReviewed(true)
          setUserReview(userReview)
          setUserRating(userReview.rating)
          setUserComment(userReview.comment || "")
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
      setError("Failed to load reviews. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRatingClick = (rating: number) => {
    setUserRating(rating)
    setError(null)
  }

  const handleSubmitReview = async () => {
    try {
      setError(null)

      // Validate the review data
      reviewSchema.parse({ rating: userRating, comment: userComment })

      setIsSubmitting(true)

      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: userRating,
          comment: userComment.trim() || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit review")
      }

      const data = await response.json()

      toast({
        title: userHasReviewed ? "Review Updated" : "Review Submitted",
        description: data.message,
      })

      // Refresh the reviews
      fetchReviews()

      if (!userHasReviewed) {
        setUserHasReviewed(true)
      }
    } catch (error) {
      console.error("Error submitting review:", error)

      if (error instanceof z.ZodError) {
        setError(error.errors[0].message)
      } else if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Failed to submit review. Please try again.")
      }

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit review",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeReview = async (reviewId: number) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like reviews",
        variant: "destructive",
      })
      return
    }

    try {
      // Optimistically update the UI
      setReviews(
        reviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                likes: review.isLiked ? review.likes - 1 : review.likes + 1,
                isLiked: !review.isLiked,
              }
            : review,
        ),
      )

      const response = await fetch(`/api/products/reviews/${reviewId}/like`, {
        method: "POST",
      })

      if (!response.ok) {
        // Revert the optimistic update if the request fails
        setReviews(reviews)
        throw new Error("Failed to like review")
      }

      const data = await response.json()

      toast({
        title: data.liked ? "Review Liked" : "Review Unliked",
        description: data.message,
      })
    } catch (error) {
      console.error("Error liking review:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to like review",
        variant: "destructive",
      })
    }
  }

  // Render stars for rating selection
  const renderRatingSelector = () => {
    return (
      <div className="flex items-center mb-4">
        <p className="mr-2 text-gray-300">Your Rating:</p>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((rating) => (
            <motion.button
              key={rating}
              type="button"
              onClick={() => handleRatingClick(rating)}
              className="focus:outline-none"
              disabled={isSubmitting}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Star
                className={`h-6 w-6 ${rating <= userRating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
              />
            </motion.button>
          ))}
        </div>
        {error && <p className="ml-2 text-red-500 text-sm">{error}</p>}
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

    reviews.forEach((review) => {
      counts[review.rating as keyof typeof counts]++
    })

    return {
      average: overallRating.toFixed(1),
      total: reviewsCount,
      percentages: {
        5: reviewsCount ? Math.round((counts[5] / reviewsCount) * 100) : 0,
        4: reviewsCount ? Math.round((counts[4] / reviewsCount) * 100) : 0,
        3: reviewsCount ? Math.round((counts[3] / reviewsCount) * 100) : 0,
        2: reviewsCount ? Math.round((counts[2] / reviewsCount) * 100) : 0,
        1: reviewsCount ? Math.round((counts[1] / reviewsCount) * 100) : 0,
      },
    }
  }

  const stats = calculateRatingStats()

  if (isLoading) {
    return (
      <div className="bg-dark-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>

      {/* Rating summary */}
      {stats ? (
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="text-5xl font-bold text-white mb-2">{stats.average}</div>
            <div className="flex mb-1">{renderStars(Number(stats.average))}</div>
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
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.percentages[star as keyof typeof stats.percentages]}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-yellow-400 h-2.5 rounded-full"
                  ></motion.div>
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
      <div className="bg-dark-700 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-white mb-4">
          {userHasReviewed ? "Update Your Review" : "Write a Review"}
        </h3>

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
                className="bg-dark-600 border-dark-500 text-white rounded-lg"
                disabled={isSubmitting}
              />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting || userRating === 0}
                className="w-full md:w-auto"
              >
                {isSubmitting ? "Submitting..." : userHasReviewed ? "Update Review" : "Submit Review"}
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400 mb-4">Please sign in to leave a review.</p>
            <Link href="/sign-in">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button>Sign In</Button>
              </motion.div>
            </Link>
          </div>
        )}
      </div>

      {/* Reviews list */}
      <h3 className="text-xl font-bold text-white mb-4">
        {reviews.length > 0 ? "Customer Reviews" : "No Reviews Yet"}
      </h3>

      <AnimatePresence>
        <div className="space-y-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-dark-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  {review.user_profiles.avatar_url ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={review.user_profiles.avatar_url || "/placeholder.svg"}
                        alt={review.user_profiles.username}
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
                    <p className="font-medium text-white">{review.user_profiles.username}</p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(review.created_at))} ago
                      {review.created_at !== review.updated_at && <span className="ml-2">(edited)</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {renderStars(review.rating)}
                  {review.is_verified_purchase && (
                    <span className="ml-2 text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded flex items-center">
                      <Check className="h-3 w-3 mr-1" /> Verified
                    </span>
                  )}
                </div>
              </div>

              {review.comment && <p className="text-gray-300 mb-3">{review.comment}</p>}

              <div className="flex items-center justify-between">
                <motion.button
                  onClick={() => handleLikeReview(review.id)}
                  className={`flex items-center text-sm ${
                    review.isLiked ? "text-blue-400" : "text-gray-400 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!isSignedIn}
                >
                  <ThumbsUp className={`h-4 w-4 mr-1 ${review.isLiked ? "fill-blue-400" : ""}`} />
                  Helpful ({review.likes})
                </motion.button>
                {userId === review.user_id && (
                  <span className="text-xs text-blue-400 cursor-pointer hover:underline">Edit Your Review</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}
