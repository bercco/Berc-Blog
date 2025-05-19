"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { syncStripeProducts, updateCartItemsWithStripeIds } from "@/lib/data/stripe-products"

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
  inventory_quantity?: number
  is_featured?: boolean
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
  refreshStripeIds: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isStripeReady, setIsStripeReady] = useState(false)

  // Function to refresh Stripe IDs for all cart items
  const refreshStripeIds = useCallback(async () => {
    const success = await syncStripeProducts()
    if (success) {
      setCartItems((prevItems) => {
        const updatedItems = updateCartItemsWithStripeIds(prevItems)
        return updatedItems
      })
      setIsStripeReady(true)
    }
  }, [])

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
    refreshStripeIds()
  }, [refreshStripeIds])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))

    // Calculate totals
    const items = cartItems.reduce((total, item) => total + item.quantity, 0)
    const price = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

    setTotalItems(items)
    setTotalPrice(price)

    // Log cart items with Stripe IDs for debugging
    console.log("Cart items with Stripe IDs:", cartItems)
  }, [cartItems])

  const addToCart = useCallback((product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      let updatedItems
      if (existingItem) {
        // Increment quantity if item already exists
        updatedItems = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        // Add new item with quantity 1
        updatedItems = [...prevItems, { ...product, quantity: 1 }]
      }

      // Update with Stripe IDs
      return updateCartItemsWithStripeIds(updatedItems)
    })
  }, [])

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }, [])

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId)
        return
      }

      setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    },
    [removeFromCart],
  )

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

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
        refreshStripeIds,
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
