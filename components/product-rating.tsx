"use client"

import { useState } from "react"
import { Star, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface ProductRatingProps {
  trustpilotRating?: number
  trustpilotReviews?: number
  localRating?: number
  localReviews?: number
}

export function ProductRating({
  trustpilotRating = 0,
  trustpilotReviews = 0,
  localRating = 0,
  localReviews = 0,
}: ProductRatingProps) {
  const [activeTab, setActiveTab] = useState<"trustpilot" | "local">("trustpilot")

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
          />
        ))}
        <span className="ml-2 text-gray-300">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="bg-dark-800 rounded-lg p-4">
      <div className="flex border-b border-dark-700 mb-4">
        <button
          className={`flex-1 pb-2 text-center text-sm font-medium ${
            activeTab === "trustpilot" ? "text-white border-b-2 border-green-500" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("trustpilot")}
        >
          Trustpilot
        </button>
        <button
          className={`flex-1 pb-2 text-center text-sm font-medium ${
            activeTab === "local" ? "text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("local")}
        >
          Site Reviews
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        key={activeTab}
      >
        {activeTab === "trustpilot" ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 mr-2"></div>
                <span className="font-medium text-white">Trustpilot</span>
              </div>
              <a
                href="https://www.trustpilot.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-white flex items-center"
              >
                View on Trustpilot <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
            {renderStars(trustpilotRating)}
            <p className="text-xs text-gray-400 mt-1">Based on {trustpilotReviews} reviews</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-blue-500 mr-2"></div>
                <span className="font-medium text-white">Site Reviews</span>
              </div>
            </div>
            {renderStars(localRating)}
            <p className="text-xs text-gray-400 mt-1">Based on {localReviews} reviews</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
