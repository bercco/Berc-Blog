import { NextResponse } from "next/server"
import Stripe from "stripe"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase/client"
import type { CartItem } from "@/context/cart-context"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cartItems, shippingDetails } = await req.json()

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Invalid cart items" }, { status: 400 })
    }

    // Log the received cart items
    console.log("Received cart items:", JSON.stringify(cartItems, null, 2))

    // Check if all items have Stripe price IDs
    const itemsMissingStripeIds = cartItems.filter((item) => !item.stripePriceId)
    if (itemsMissingStripeIds.length > 0) {
      console.error(
        "Items missing Stripe price IDs:",
        itemsMissingStripeIds.map((item) => item.name),
      )
      return NextResponse.json(
        {
          error: "Some products are not properly configured for checkout",
          details: `Missing Stripe IDs for: ${itemsMissingStripeIds.map((item) => item.name).join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Calculate total
    const total = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)

    // Create an order in the database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        status: "pending",
        total,
        shipping_address: shippingDetails,
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Add order items
    const orderItems = cartItems.map((item: CartItem & { stripePriceId?: string }) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      stripe_price_id: item.stripePriceId,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    // Create Stripe checkout session using price IDs
    const lineItems = cartItems.map((item: CartItem & { stripePriceId?: string }) => {
      if (!item.stripePriceId) {
        throw new Error(`Missing Stripe price ID for product: ${item.name}`)
      }

      return {
        price: item.stripePriceId,
        quantity: item.quantity,
      }
    })

    console.log("Creating Stripe checkout session with line items:", lineItems)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      metadata: {
        orderId: order.id.toString(),
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
