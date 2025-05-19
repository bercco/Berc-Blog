// This file will store the mapping between our local products and Stripe products
import { products } from "./products"

export interface StripeProductMapping {
  localId: number
  stripeProductId: string
  stripePriceId: string
}

// This will be populated by an API call to Stripe
export let stripeProductMappings: StripeProductMapping[] = []

// Function to get Stripe product and price IDs for a local product
export function getStripeIds(productId: number): { productId: string; priceId: string } | null {
  const mapping = stripeProductMappings.find((m) => m.localId === productId)
  if (!mapping) return null

  return {
    productId: mapping.stripeProductId,
    priceId: mapping.stripePriceId,
  }
}

// Function to sync Stripe products with local products
export async function syncStripeProducts(): Promise<boolean> {
  try {
    console.log("Syncing Stripe products...")
    const response = await fetch("/api/stripe/products")

    if (!response.ok) {
      console.error("Failed to fetch Stripe products:", await response.text())
      return false
    }

    const data = await response.json()

    if (!data.mappings || !Array.isArray(data.mappings)) {
      console.error("Invalid response format from Stripe products API:", data)
      return false
    }

    // Update the mappings
    stripeProductMappings = data.mappings

    // Validate that we have mappings for all products
    const missingProducts = products.filter(
      (product) => !stripeProductMappings.some((mapping) => mapping.localId === product.id),
    )

    if (missingProducts.length > 0) {
      console.warn(
        "Some products don't have Stripe mappings:",
        missingProducts.map((p) => p.name),
      )
    }

    console.log("Stripe products synced successfully:", stripeProductMappings.length, "mappings")
    return true
  } catch (error) {
    console.error("Error syncing Stripe products:", error)
    return false
  }
}

// Function to update cart items with Stripe IDs
export function updateCartItemsWithStripeIds(cartItems: any[]) {
  return cartItems.map((item) => {
    const stripeIds = getStripeIds(item.id)
    return {
      ...item,
      stripeProductId: stripeIds?.productId || item.stripeProductId,
      stripePriceId: stripeIds?.priceId || item.stripePriceId,
    }
  })
}
