"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/context/cart-context"
import { Star } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface ProductCardProps extends Product {
  trustpilotRating?: number
  trustpilotReviews?: number
}

export function ProductCard({
  id,
  name,
  price,
  image1,
  image2,
  category,
  type,
  description,
  rating = 4.5,
  reviews = 24,
  trustpilotRating = 4.2,
  trustpilotReviews = 18,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({ id, name, price, image1, image2, category, type, description, rating, reviews })
  }

  const renderStars = () => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-400">({reviews})</span>
      </div>
    )
  }

  const renderTypeLabel = () => {
    const typeColors: Record<string, string> = {
      Software: "bg-blue-600",
      Course: "bg-green-600",
      Book: "bg-purple-600",
      Electronics: "bg-red-600",
      Clothing: "bg-yellow-600",
      Investment: "bg-indigo-600",
      Other: "bg-gray-600",
    }

    return (
      <span className={`text-xs px-2 py-1 ${typeColors[type] || "bg-dark-600"} rounded-full text-white`}>{type}</span>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-dark-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <Link href={`/product/${id}`}>
        <div
          className="relative aspect-square"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={isHovered ? image2 : image1}
            alt={name}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {type === "Course" && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-900 to-transparent p-4">
              <p className="text-white text-sm font-medium">Learn investment strategies</p>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-semibold text-gray-100 line-clamp-1">{name}</h3>
          {renderTypeLabel()}
        </div>
        <div className="mb-2 flex items-center justify-between">
          {renderStars()}
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 mr-1 rounded-full"></div>
            <span className="text-xs text-gray-400">{trustpilotReviews}</span>
          </div>
        </div>
        {description && <p className="text-gray-400 text-sm mb-3 line-clamp-2">{description}</p>}
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-bold text-white">${price.toFixed(2)}</p>
          <span className="text-xs text-gray-400">{category}</span>
        </div>
        <Button className="w-full" variant="outline" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </div>
    </motion.div>
  )
}
