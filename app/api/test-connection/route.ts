import { NextResponse } from "next/server"
import { createClientClient } from "@/lib/supabase/client"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    // Test client connection
    const clientSupabase = createClientClient()
    const { data: categories, error: categoriesError } = await clientSupabase.from("categories").select("*").limit(5)

    if (categoriesError) {
      return NextResponse.json(
        {
          success: false,
          error: categoriesError.message,
          message: "Failed to connect to Supabase with client credentials",
        },
        { status: 500 },
      )
    }

    // Test admin connection
    const adminSupabase = createAdminClient()
    const { data: profiles, error: profilesError } = await adminSupabase.from("profiles").select("count").single()

    if (profilesError) {
      return NextResponse.json(
        {
          success: false,
          error: profilesError.message,
          message: "Failed to connect to Supabase with admin credentials",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Supabase",
      data: {
        categories: categories.length,
        profiles: profiles.count,
      },
    })
  } catch (error) {
    console.error("Error testing Supabase connection:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
        message: "Failed to test Supabase connection",
      },
      { status: 500 },
    )
  }
}
