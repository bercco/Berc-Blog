import Stripe from "stripe"
import { products } from "@/lib/data/products"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

async function setupStripeProducts() {
  console.log("Setting up Stripe products...")

  for (const product of products) {
    // Check if product already exists in Stripe
    const existingProducts = await stripe.products.search({
      query: `name:'${product.name}'`,
    })

    let stripeProduct

    if (existingProducts.data.length > 0) {
      console.log(`Product "${product.name}" already exists in Stripe.`)
      stripeProduct = existingProducts.data[0]

      // Update the product if needed
      await stripe.products.update(stripeProduct.id, {
        description: product.description,
        images: [product.image1, product.image2].filter(Boolean) as string[],
        metadata: {
          category: product.category,
          type: product.type,
          inventory_quantity: product.inventory_quantity.toString(),
          is_featured: product.is_featured.toString(),
        },
      })
    } else {
      // Create new product in Stripe
      console.log(`Creating product "${product.name}" in Stripe...`)
      stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        images: [product.image1, product.image2].filter(Boolean) as string[],
        metadata: {
          category: product.category,
          type: product.type,
          inventory_quantity: product.inventory_quantity.toString(),
          is_featured: product.is_featured.toString(),
        },
      })
    }

    // Check if price already exists
    const existingPrices = await stripe.prices.list({
      product: stripeProduct.id,
      active: true,
    })

    if (existingPrices.data.length > 0) {
      console.log(`Price for "${product.name}" already exists in Stripe.`)
    } else {
      // Create price for the product
      console.log(`Creating price for "${product.name}" in Stripe...`)
      await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(product.price * 100), // Convert to cents
        currency: "usd",
      })
    }

    console.log(`Product "${product.name}" setup complete.`)
  }

  console.log("All products have been set up in Stripe!")
}

// Run the setup function
setupStripeProducts()
  .then(() => console.log("Stripe product setup completed successfully!"))
  .catch((error) => console.error("Error setting up Stripe products:", error))
