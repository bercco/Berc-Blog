import { NextResponse } from "next/server"
import { products, getProductById, getRelatedProducts } from "@/lib/data/products"

// This is a server-side API route that provides product data
// We're using mock data for now, but in a real app this would fetch from Shopify
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  try {
    // If ID is provided, return a specific product
    if (id) {
      const product = getProductById(Number(id))

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      // Get related products
      const related = getRelatedProducts(product)

      return NextResponse.json({ product, related })
    }

    // Otherwise return all products
    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
