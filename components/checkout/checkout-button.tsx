"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"

interface CheckoutButtonProps {
  className?: string
}

export function CheckoutButton({ className }: CheckoutButtonProps) {
  const { cartItems, totalPrice, clearCart } = useCart()
  const { userId, isSignedIn } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to proceed with checkout",
        variant: "destructive",
      })
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add items before checking out.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Create checkout session
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          shippingDetails: {
            // For demo purposes, we're not collecting shipping details
            // In a real application, you would have a shipping form
            name: "Customer",
            address: {
              line1: "123 Main St",
              city: "City",
              state: "State",
              postal_code: "12345",
              country: "US",
            },
          },
        }),
      })

      const { url, sessionId, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading || cartItems.length === 0} className={className} size="lg">
      {isLoading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : (
        <span className="flex items-center">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Checkout (${totalPrice.toFixed(2)})
        </span>
      )}
    </Button>
  )
}
