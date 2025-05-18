"use client"
import { useParams } from "next/navigation"
import { ProductForm } from "@/components/product-form"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { useProduct } from "@/hooks/use-products"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EditProductPage() {
  const params = useParams()
  const productId = typeof params.id === "string" ? Number.parseInt(params.id) : 0
  const { user, loading: authLoading } = useSupabaseAuth()
  const { product, loading: productLoading, error } = useProduct(productId)

  if (authLoading || productLoading) {
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

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-900/20 p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">Product Not Found</h1>
          <p className="mb-6 text-gray-400">
            The product you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Product</h1>
        <p className="text-gray-400">Update product information</p>
      </div>

      <div className="max-w-2xl">
        <ProductForm product={product} isEditing={true} />
      </div>
    </div>
  )
}
