import { NextResponse } from "next/server"
import { createClientClient } from "@/lib/supabase/client"

export async function GET() {
  const supabase = createClientClient()

  try {
    // Check if categories table exists and has data
    const { data: categories, error: categoriesError } = await supabase.from("categories").select("*").limit(5)

    if (categoriesError) {
      return NextResponse.json(
        {
          success: false,
          message: "Error fetching categories",
          error: categoriesError,
        },
        { status: 500 },
      )
    }

    // Check if products table exists
    const { data: productsInfo, error: productsError } = await supabase
      .from("products")
      .select("count")
      .limit(1)
      .single()

    if (productsError && productsError.code !== "PGRST116") {
      // PGRST116 is "No rows returned" which is fine
      return NextResponse.json(
        {
          success: false,
          message: "Error checking products table",
          error: productsError,
        },
        { status: 500 },
      )
    }

    // Check database structure
    const { data: tables, error: tablesError } = await supabase.rpc("get_tables").select("*")

    // If RPC doesn't exist, try a different approach
    let tablesList = []
    if (tablesError) {
      const { data, error } = await supabase.from("pg_tables").select("tablename").eq("schemaname", "public")

      if (!error) {
        tablesList = data || []
      }
    } else {
      tablesList = tables || []
    }

    return NextResponse.json({
      success: true,
      message: "Database check completed",
      data: {
        categories: categories || [],
        productsTableExists: !productsError || productsError.code === "PGRST116",
        tables: tablesList,
      },
    })
  } catch (error) {
    console.error("Error checking database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error checking database",
        error,
      },
      { status: 500 },
    )
  }
}
