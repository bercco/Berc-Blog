import { NextResponse } from "next/server"
import Stripe from "stripe"
import { products } from "@/lib/data/products"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function GET() {
  try {
    // Fetch all products from Stripe
    const stripeProducts = await stripe.products.list({
      active: true,
      limit: 100,
    })

    // Create a map of product names to Stripe product IDs
    const productMap = new Map()

    for (const product of stripeProducts.data) {
      productMap.set(product.name.toLowerCase(), product.id)
    }

    // Fetch all prices from Stripe
    const stripePrices = await stripe.prices.list({
      active: true,
      limit: 100,
    })

    // Create a map of product IDs to price IDs (using the first active price for each product)
    const priceMap = new Map()

    for (const price of stripePrices.data) {
      if (price.product && !priceMap.has(price.product)) {
        priceMap.set(price.product, price.id)
      }
    }

    // Create mappings between local products and Stripe products/prices
    const mappings = []

    for (const product of products) {
      const stripeProductId = productMap.get(product.name.toLowerCase())

      if (stripeProductId) {
        const stripePriceId = priceMap.get(stripeProductId)

        if (stripePriceId) {
          mappings.push({
            localId: product.id,
            stripeProductId,
            stripePriceId,
          })
        } else {
          console.warn(`No price found for Stripe product: ${product.name}`)
        }
      } else {
        console.warn(`No Stripe product found for: ${product.name}`)
      }
    }

    console.log(`Found ${mappings.length} product mappings out of ${products.length} local products`)

    return NextResponse.json({ mappings })
  } catch (error) {
    console.error("Error fetching Stripe products:", error)
    return NextResponse.json({ error: "Failed to fetch Stripe products" }, { status: 500 })
  }
}
