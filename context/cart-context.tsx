"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { syncStripeProducts, getStripeIds } from "@/lib/data/stripe-products"

export type ProductType = "Software" | "Course" | "Book" | "Electronics" | "Clothing" | "Investment" | "Other"

export interface Product {
  id: number
  name: string
  price: number
  image1: string
  image2: string
  category: string
  type: ProductType
  description?: string
  rating?: number
  reviews?: number
}

export interface CartItem extends Product {
  quantity: number
  stripePriceId?: string
  stripeProductId?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
  totalItems: number
  totalPrice: number
  isStripeReady: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isStripeReady, setIsStripeReady] = useState(false)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }

    // Sync Stripe products
    syncStripeProducts()
      .then(() => setIsStripeReady(true))
      .catch((error) => console.error("Failed to sync Stripe products:", error))
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))

    // Calculate totals
    const items = cartItems.reduce((total, item) => total + item.quantity, 0)
    const price = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

    setTotalItems(items)
    setTotalPrice(price)
  }, [cartItems])

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      // Get Stripe IDs for the product
      const stripeIds = getStripeIds(product.id)

      if (existingItem) {
        // Increment quantity if item already exists
        return prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                stripeProductId: stripeIds?.productId || item.stripeProductId,
                stripePriceId: stripeIds?.priceId || item.stripePriceId,
              }
            : item,
        )
      } else {
        // Add new item with quantity 1
        return [
          ...prevItems,
          {
            ...product,
            quantity: 1,
            stripeProductId: stripeIds?.productId,
            stripePriceId: stripeIds?.priceId,
          },
        ]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        totalPrice,
        isStripeReady,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
