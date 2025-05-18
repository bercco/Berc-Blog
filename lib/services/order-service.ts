import { createClientClient } from "../supabase/client"
import { createAdminClient } from "../supabase/admin"
import type { Database } from "../supabase/types"

type Order = Database["public"]["Tables"]["orders"]["Row"]
type NewOrder = Database["public"]["Tables"]["orders"]["Insert"]
type UpdateOrder = Database["public"]["Tables"]["orders"]["Update"]

type OrderItem = Database["public"]["Tables"]["order_items"]["Row"]
type NewOrderItem = Database["public"]["Tables"]["order_items"]["Insert"]

export async function getUserOrders(userId: string) {
  const supabase = createClientClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (
          id,
          name,
          price,
          image_url
        )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching orders for user ${userId}:`, error)
    throw error
  }

  return data
}

export async function getOrderById(id: string) {
  const supabase = createClientClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (
          id,
          name,
          price,
          image_url
        )
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching order with id ${id}:`, error)
    throw error
  }

  return data
}

export async function getAllOrders() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      profiles (
        id,
        full_name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all orders:", error)
    throw error
  }

  return data
}

export async function createOrder(order: NewOrder, orderItems: NewOrderItem[]) {
  const supabase = createClientClient()

  // Start a transaction
  const { data: newOrder, error: orderError } = await supabase.from("orders").insert(order).select().single()

  if (orderError) {
    console.error("Error creating order:", orderError)
    throw orderError
  }

  // Add the order ID to each order item
  const itemsWithOrderId = orderItems.map((item) => ({
    ...item,
    order_id: newOrder.id,
  }))

  // Insert order items
  const { error: itemsError } = await supabase.from("order_items").insert(itemsWithOrderId)

  if (itemsError) {
    console.error("Error creating order items:", itemsError)
    throw itemsError
  }

  return newOrder
}

export async function updateOrderStatus(id: string, status: "pending" | "processing" | "completed" | "cancelled") {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating status for order ${id}:`, error)
    throw error
  }

  return data
}
