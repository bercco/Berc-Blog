import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

// Use environment variables for the Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a Supabase client for use on the client side
export const createClientClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}
