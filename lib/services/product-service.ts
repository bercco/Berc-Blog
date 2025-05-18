import { createClientClient } from "../supabase/client"
import { createAdminClient } from "../supabase/admin"
import type { Database } from "../supabase/types"

type Product = Database["public"]["Tables"]["products"]["Row"]
type NewProduct = Database["public"]["Tables"]["products"]["Insert"]
type UpdateProduct = Database["public"]["Tables"]["products"]["Update"]

export async function getProducts(options?: {
  categoryId?: string
  limit?: number
  offset?: number
  sortBy?: "name" | "price" | "created_at"
  sortOrder?: "asc" | "desc"
}) {
  const supabase = createClientClient()

  let query = supabase.from("products").select(`
    *,
    categories (
      id,
      name,
      slug
    )
  `)

  if (options?.categoryId) {
    query = query.eq("category_id", options.categoryId)
  }

  if (options?.sortBy) {
    query = query.order(options.sortBy, { ascending: options.sortOrder === "asc" })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching products:", error)
    throw error
  }

  return data
}

export async function getProductById(id: string) {
  const supabase = createClientClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching product with id ${id}:`, error)
    throw error
  }

  return data
}

export async function createProduct(product: NewProduct) {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from("products").insert(product).select().single()

  if (error) {
    console.error("Error creating product:", error)
    throw error
  }

  return data
}

export async function updateProduct(id: string, updates: UpdateProduct) {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating product with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting product with id ${id}:`, error)
    throw error
  }

  return true
}
