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
      expand: ["data.default_price"],
    })

    // Create mappings between local products and Stripe products
    const mappings = []

    for (const localProduct of products) {
      // Find matching Stripe product by name
      const stripeProduct = stripeProducts.data.find((p) => p.name === localProduct.name)

      if (stripeProduct && stripeProduct.default_price) {
        // Get the default price object
        const priceId =
          typeof stripeProduct.default_price === "string" ? stripeProduct.default_price : stripeProduct.default_price.id

        mappings.push({
          localId: localProduct.id,
          stripeProductId: stripeProduct.id,
          stripePriceId: priceId,
        })
      }
    }

    return NextResponse.json({
      success: true,
      mappings,
    })
  } catch (error) {
    console.error("Error fetching Stripe products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch Stripe products" }, { status: 500 })
  }
}
