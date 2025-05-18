"use client"

import { ProductForm } from "@/components/product-form"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewProductPage() {
  const { user, loading } = useSupabaseAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-2 text-white">Loading...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold text-white">Access Denied</h1>
        <p className="mb-6 text-gray-400">Please sign in to access this page</p>
        <Link href="/auth/signin">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Add New Product</h1>
        <p className="text-gray-400">Create a new product for your store</p>
      </div>

      <div className="max-w-2xl">
        <ProductForm />
      </div>
    </div>
  )
}
