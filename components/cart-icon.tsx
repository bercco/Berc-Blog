"use client"

import { ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/context/cart-context"

export function CartIcon() {
  const [isClicked, setIsClicked] = useState(false)
  const { setIsCartOpen, totalItems } = useCart()

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300) // Reset after animation
    setIsCartOpen(true)
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full bg-dark-400 hover:bg-dark-300 transition-colors duration-200 relative ${
        isClicked ? "animate-click" : ""
      }`}
    >
      <ShoppingCart className="w-6 h-6 text-gray-100" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-white text-dark-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  )
}
