import { NextResponse } from "next/server"
import { checkClientConnection, checkAdminConnection } from "@/lib/supabase/check-connection"

export async function GET() {
  const clientResult = await checkClientConnection()
  const adminResult = await checkAdminConnection()

  return NextResponse.json({
    client: clientResult,
    admin: adminResult,
    environment: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set",
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Not set",
    },
  })
}
