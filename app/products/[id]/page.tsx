"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClientClient } from "@/lib/supabase/client"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const supabase = createClientClient()

        const { data, error } = await supabase.from("products").select("*").eq("id", params.id).single()

        if (error) {
          throw error
        }

        if (!data) {
          router.push("/products")
          return
        }

        // Fetch category separately
        const { data: category } = await supabase.from("categories").select("*").eq("id", data.category_id).single()

        setProduct({
          ...data,
          category: category || { name: "Uncategorized" },
        })
      } catch (err) {
        console.error(`Error fetching product with id ${params.id}:`, err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-gray-600">Loading product details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center text-red-600">
        <p>Error loading product: {error}</p>
        <p className="mt-2">
          <Link href="/products" className="text-blue-600 hover:underline">
            Return to products
          </Link>
        </p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Product not found</p>
        <p className="mt-2">
          <Link href="/products" className="text-blue-600 hover:underline">
            Return to products
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Link href="/products" className="text-blue-600 hover:underline">
          ← Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="relative h-80 md:h-96">
            <Image
              src={product.image_url || "/placeholder.svg?height=400&width=600"}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600 mt-2">Category: {product.category?.name || "Uncategorized"}</p>

            <div className="mt-4">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="mt-8">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full md:w-auto">
                Add to Cart
              </button>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-600">
                {product.inventory_count > 0 ? `In Stock: ${product.inventory_count} available` : "Out of Stock"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
