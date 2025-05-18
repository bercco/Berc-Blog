import { createClientClient } from "../supabase/client"
import { createAdminClient } from "../supabase/admin"
import type { Database } from "../supabase/types"

type Category = Database["public"]["Tables"]["categories"]["Row"]
type NewCategory = Database["public"]["Tables"]["categories"]["Insert"]
type UpdateCategory = Database["public"]["Tables"]["categories"]["Update"]

export async function getCategories() {
  const supabase = createClientClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    throw error
  }

  return data
}

export async function getCategoryBySlug(slug: string) {
  const supabase = createClientClient()

  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching category with slug ${slug}:`, error)
    throw error
  }

  return data
}

export async function createCategory(category: NewCategory) {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from("categories").insert(category).select().single()

  if (error) {
    console.error("Error creating category:", error)
    throw error
  }

  return data
}

export async function updateCategory(id: string, updates: UpdateCategory) {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating category with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting category with id ${id}:`, error)
    throw error
  }

  return true
}
