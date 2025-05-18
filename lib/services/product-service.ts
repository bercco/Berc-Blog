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

  // Use separate queries instead of relying on the foreign key relationship
  let query = supabase.from("products").select("*")

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

  const { data: products, error } = await query

  if (error) {
    console.error("Error fetching products:", error)
    throw error
  }

  // If we have products, fetch the categories separately
  if (products && products.length > 0) {
    const categoryIds = [...new Set(products.map((product) => product.category_id))]

    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .in("id", categoryIds)

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError)
    } else if (categories) {
      // Manually join the categories to products
      const categoriesMap = new Map(categories.map((category) => [category.id, category]))

      return products.map((product) => ({
        ...product,
        categories: categoriesMap.get(product.category_id) || null,
      }))
    }
  }

  return products || []
}

export async function getProductById(id: string) {
  const supabase = createClientClient()

  // Fetch the product first
  const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching product with id ${id}:`, error)
    throw error
  }

  // Then fetch the category separately
  if (product) {
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("*")
      .eq("id", product.category_id)
      .single()

    if (categoryError) {
      console.error(`Error fetching category for product ${id}:`, categoryError)
    } else if (category) {
      return {
        ...product,
        categories: category,
      }
    }
  }

  return product
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
