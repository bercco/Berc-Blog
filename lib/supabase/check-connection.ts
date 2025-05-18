import { createClientClient } from "./client"
import { createAdminClient } from "./admin"

export async function checkClientConnection() {
  try {
    const supabase = createClientClient()
    const { data, error } = await supabase.from("categories").select("count").single()

    if (error) {
      console.error("Error connecting to Supabase (client):", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error checking Supabase connection (client):", error)
    return { success: false, error: "Unexpected error" }
  }
}

export async function checkAdminConnection() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from("categories").select("count").single()

    if (error) {
      console.error("Error connecting to Supabase (admin):", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error checking Supabase connection (admin):", error)
    return { success: false, error: "Unexpected error" }
  }
}
