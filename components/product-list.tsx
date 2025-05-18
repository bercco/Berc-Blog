"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClientClient } from "@/lib/supabase/client"

export function ProductList({ categorySlug = null, limit = 8 }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const supabase = createClientClient()

        let query = supabase.from("products").select("*")

        if (categorySlug) {
          // First get the category ID
          const { data: category } = await supabase.from("categories").select("id").eq("slug", categorySlug).single()

          if (category) {
            query = query.eq("category_id", category.id)
          }
        }

        query = query.order("created_at", { ascending: false }).limit(limit)

        const { data, error } = await query

        if (error) {
          throw error
        }

        setProducts(data || [])
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categorySlug, limit])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-gray-600">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Error loading products: {error}</p>
        <p className="mt-2">Please try again later.</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium">No products found</p>
        <p className="mt-2 text-gray-600">Try a different category or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="h-48 relative">
            <Image
              src={product.image_url || "/placeholder.svg?height=200&width=300"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600 mt-1 line-clamp-2">{product.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
              <Link
                href={`/products/${product.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
