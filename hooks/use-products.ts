"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"

type Product = Database["public"]["Tables"]["products"]["Row"]

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)

        const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setProducts(data || [])
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    // Set up real-time subscription
    const subscription = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        (payload) => {
          console.log("Real-time update:", payload)
          fetchProducts() // Refetch products when changes occur
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { products, loading, error }
}

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)

        const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

        if (error) {
          throw error
        }

        setProduct(data)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, loading, error }
}
