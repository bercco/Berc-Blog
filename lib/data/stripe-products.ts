// This file will store the mapping between our local products and Stripe products
export interface StripeProductMapping {
  localId: number
  stripeProductId: string
  stripePriceId: string
}

// This will be populated by an API call to Stripe
export const stripeProductMappings: StripeProductMapping[] = []

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
export async function syncStripeProducts(): Promise<void> {
  try {
    const response = await fetch("/api/stripe/products")
    if (!response.ok) throw new Error("Failed to fetch Stripe products")

    const data = await response.json()

    // Update the mappings
    stripeProductMappings.length = 0 // Clear the array
    stripeProductMappings.push(...data.mappings)

    console.log("Stripe products synced successfully")
  } catch (error) {
    console.error("Error syncing Stripe products:", error)
  }
}
