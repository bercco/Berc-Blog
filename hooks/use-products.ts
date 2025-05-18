"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/data/products"

export function useProduct(id: number | string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/shopify/products?id=${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch product")
        }

        setProduct(data.product)
        setRelatedProducts(data.related)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, relatedProducts, isLoading, error }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/shopify/products")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch products")
        }

        setProducts(data.products)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, isLoading, error }
}
