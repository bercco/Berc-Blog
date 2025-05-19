import { NextResponse } from "next/server"
import Stripe from "stripe"
import { products } from "@/lib/data/products"
import { auth } from "@clerk/nextjs/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST() {
  try {
    // Check if user is admin (in a real app, you'd check for admin role)
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const results = []

    for (const product of products) {
      // Check if product already exists in Stripe
      const existingProducts = await stripe.products.search({
        query: `name:'${product.name}'`,
      })

      let stripeProduct

      if (existingProducts.data.length > 0) {
        results.push(`Product "${product.name}" already exists in Stripe.`)
        stripeProduct = existingProducts.data[0]

        // Update the product if needed
        await stripe.products.update(stripeProduct.id, {
          description: product.description || `${product.name} - ${product.category}`,
          images: [product.image1, product.image2].filter(Boolean) as string[],
          metadata: {
            category: product.category,
            type: product.type,
            local_id: product.id.toString(),
          },
        })
      } else {
        // Create new product in Stripe
        results.push(`Creating product "${product.name}" in Stripe...`)
        stripeProduct = await stripe.products.create({
          name: product.name,
          description: product.description || `${product.name} - ${product.category}`,
          images: [product.image1, product.image2].filter(Boolean) as string[],
          metadata: {
            category: product.category,
            type: product.type,
            local_id: product.id.toString(),
          },
        })
      }

      // Check if price already exists
      const existingPrices = await stripe.prices.list({
        product: stripeProduct.id,
        active: true,
      })

      if (existingPrices.data.length > 0) {
        results.push(`Price for "${product.name}" already exists in Stripe.`)
      } else {
        // Create price for the product
        results.push(`Creating price for "${product.name}" in Stripe...`)
        await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.round(product.price * 100), // Convert to cents
          currency: "usd",
        })
      }

      results.push(`Product "${product.name}" setup complete.`)
    }

    return NextResponse.json({
      success: true,
      message: "All products have been set up in Stripe!",
      details: results,
    })
  } catch (error) {
    console.error("Error setting up Stripe products:", error)
    return NextResponse.json(
      {
        error: "Failed to set up Stripe products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
