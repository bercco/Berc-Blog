"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function SetupStripeProductsButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSetupProducts = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/stripe/setup-products", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to set up Stripe products")
      }

      toast({
        title: "Success",
        description: data.message,
        variant: "default",
      })

      // Refresh the page to update product mappings
      window.location.reload()
    } catch (error) {
      console.error("Error setting up Stripe products:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSetupProducts} disabled={isLoading}>
      {isLoading ? "Setting up products..." : "Setup Stripe Products"}
    </Button>
  )
}
