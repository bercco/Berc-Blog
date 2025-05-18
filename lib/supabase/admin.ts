import { createClient } from "@supabase/supabase-js"

// Create a supabase client with the service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables for admin client")
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
