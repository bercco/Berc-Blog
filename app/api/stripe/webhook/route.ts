import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { supabase } from "@/lib/supabase/client"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`)
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  // Handle specific Stripe events
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Update order status in database
        if (session.metadata?.orderId) {
          const { error } = await supabase
            .from("orders")
            .update({
              status: "paid",
              stripe_session_id: session.id,
            })
            .eq("id", session.metadata.orderId)

          if (error) {
            console.error("Error updating order:", error)
            throw error
          }
        }
        break
      }

      case "payment_intent.succeeded": {
        // Handle successful payment if needed
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
  }
}
