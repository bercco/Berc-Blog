import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Check if user is admin or manager
    const { data: user } = await supabase.from("users").select("role").eq("id", userId).single()

    if (!user || !["admin", "manager"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const productData = await request.json()

    const { data, error } = await supabase.from("products").insert(productData).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)

    let query = supabase.from("products").select("*")

    // Apply category filter
    const category = searchParams.get("category")
    if (category) {
      query = query.eq("category_id", category)
    }

    // Apply price filter
    const minPrice = searchParams.get("min_price")
    const maxPrice = searchParams.get("max_price")

    if (minPrice) {
      query = query.gte("price", Number.parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte("price", Number.parseFloat(maxPrice))
    }

    // Apply sorting
    const sort = searchParams.get("sort")
    if (sort) {
      switch (sort) {
        case "newest":
          query = query.order("created_at", { ascending: false })
          break
        case "price-asc":
          query = query.order("price", { ascending: true })
          break
        case "price-desc":
          query = query.order("price", { ascending: false })
          break
        case "popular":
          query = query.order("sales_count", { ascending: false })
          break
        default:
          query = query.order("created_at", { ascending: false })
      }
    } else {
      query = query.order("created_at", { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
