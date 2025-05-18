import { createClientClient } from "../supabase/client"
import { createAdminClient } from "../supabase/admin"
import type { Database } from "../supabase/types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type UpdateProfile = Database["public"]["Tables"]["profiles"]["Update"]

export async function getCurrentProfile() {
  const supabase = createClientClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching current profile:", error)
    throw error
  }

  return data
}

export async function getProfileById(id: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching profile with id ${id}:`, error)
    throw error
  }

  return data
}

export async function getAllProfiles() {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all profiles:", error)
    throw error
  }

  return data
}

export async function updateProfile(id: string, updates: UpdateProfile) {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from("profiles").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating profile with id ${id}:`, error)
    throw error
  }

  return data
}

export async function updateCurrentProfile(updates: UpdateProfile) {
  const supabase = createClientClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("No authenticated user")
  }

  const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select().single()

  if (error) {
    console.error(`Error updating current profile:`, error)
    throw error
  }

  return data
}
