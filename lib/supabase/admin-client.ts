import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

// Create a Supabase client with the service role key for admin operations
// This should only be used in server-side code (API routes, Server Actions)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables for admin client. Check your .env file.")
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
