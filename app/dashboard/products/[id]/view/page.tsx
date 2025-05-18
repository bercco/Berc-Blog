"use client"

import { useParams, useRouter } from "next/navigation"
import { useProduct } from "@/hooks/use-products"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Edit, Trash2, ArrowLeft, Tag, Package, DollarSign } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ViewProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const productId = typeof params.id === "string" ? Number.parseInt(params.id) : 0
  const { user, loading: authLoading } = useSupabaseAuth()
  const { product, loading: productLoading, error } = useProduct(productId)

  const handleDeleteProduct = async () => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", productId)

      if (error) throw error

      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "There was an error deleting the product. Please try again.",
        variant: "destructive",
      })
    }
  }

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
      <div className="mb-8 flex items-center">
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          <p className="text-gray-400">Product details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <Card className="bg-dark-800">
            <div className="relative aspect-square">
              <Image
                src={product.image_url || "/placeholder.svg?height=500&width=500"}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-dark-800">
            <CardHeader>
              <CardTitle className="text-white">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-400">Name</h3>
                <p className="text-white">{product.name}</p>
              </div>

              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-400">Description</h3>
                <p className="text-white">{product.description || "No description provided"}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-dark-700 p-4">
                  <div className="mb-2 flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-green-400" />
                    <h3 className="text-sm font-medium text-gray-400">Price</h3>
                  </div>
                  <p className="text-xl font-bold text-white">${product.price.toFixed(2)}</p>
                </div>

                <div className="rounded-lg bg-dark-700 p-4">
                  <div className="mb-2 flex items-center">
                    <Tag className="mr-2 h-5 w-5 text-blue-400" />
                    <h3 className="text-sm font-medium text-gray-400">Category</h3>
                  </div>
                  <p className="text-xl font-bold text-white">{product.category}</p>
                </div>

                <div className="rounded-lg bg-dark-700 p-4">
                  <div className="mb-2 flex items-center">
                    <Package className="mr-2 h-5 w-5 text-purple-400" />
                    <h3 className="text-sm font-medium text-gray-400">Inventory</h3>
                  </div>
                  <p
                    className={`text-xl font-bold ${product.inventory_count < 10 ? "text-red-400" : "text-green-400"}`}
                  >
                    {product.inventory_count}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-400">Status</h3>
                <div className="flex items-center">
                  <span
                    className={`mr-2 h-3 w-3 rounded-full ${product.is_featured ? "bg-yellow-400" : "bg-gray-400"}`}
                  ></span>
                  <p className="text-white">{product.is_featured ? "Featured Product" : "Regular Product"}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/dashboard/products/${product.id}`}>
                <Button variant="outline" className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-dark-800 text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      This action cannot be undone. This will permanently delete the product from your store.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-dark-700 text-white hover:bg-dark-600">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={handleDeleteProduct}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
