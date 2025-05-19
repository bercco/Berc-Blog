"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { ShoppingBag, RefreshCw } from "lucide-react"

interface CheckoutButtonProps {
  className?: string
}

export function CheckoutButton({ className }: CheckoutButtonProps) {
  const { cartItems, totalPrice, clearCart, isStripeReady, refreshStripeIds } = useCart()
  const { userId, isSignedIn } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Check if all items have Stripe price IDs
  const missingStripeIds = cartItems.some((item) => !item.stripePriceId)

  // Refresh Stripe IDs when component mounts or when cart items change
  useEffect(() => {
    if (cartItems.length > 0 && missingStripeIds) {
      refreshStripeIds()
    }
  }, [cartItems, missingStripeIds, refreshStripeIds])

  const handleRefreshStripeIds = async () => {
    setIsRefreshing(true)
    await refreshStripeIds()
    setIsRefreshing(false)
  }

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

    if (!isStripeReady) {
      toast({
        title: "Payment system initializing",
        description: "Please wait a moment while we prepare the checkout.",
        variant: "default",
      })
      await refreshStripeIds()
      return
    }

    // Check if all items have Stripe price IDs
    if (missingStripeIds) {
      toast({
        title: "Checkout error",
        description: "Some products are not properly configured for checkout. Refreshing product data...",
        variant: "destructive",
      })
      await refreshStripeIds()
      return
    }

    try {
      setIsLoading(true)

      // Log the cart items being sent to the API
      console.log("Sending cart items to checkout API:", cartItems)

      // Create checkout session with line items using Stripe price IDs
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

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }

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
    <div className="flex flex-col gap-2">
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

      {missingStripeIds && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshStripeIds}
          disabled={isRefreshing}
          className="flex items-center justify-center"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Product Data"}
        </Button>
      )}
    </div>
  )
}
