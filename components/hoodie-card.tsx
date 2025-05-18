"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/context/cart-context"

interface HoodieCardProps extends Product {}

export function HoodieCard({ id, name, price, image1, image2, category }: HoodieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({ id, name, price, image1, image2, category })
  }

  return (
    <div className="bg-dark-800 rounded-lg overflow-hidden">
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
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-100">{name}</h3>
          <span className="text-xs px-2 py-1 bg-dark-600 rounded-full text-gray-300">{category}</span>
        </div>
        <p className="text-gray-400 mb-4">${price.toFixed(2)}</p>
        <Button className="w-full" variant="outline" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
