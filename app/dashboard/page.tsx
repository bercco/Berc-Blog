"use client"

import { useState } from "react"
import { useProducts } from "@/hooks/use-products"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, RefreshCw, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SyncProductsButton } from "@/components/sync-products-button"

export default function DashboardPage() {
  const { products, loading, error } = useProducts()
  const { user, loading: authLoading } = useSupabaseAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  if (authLoading) {
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
        <p className="mb-6 text-gray-400">Please sign in to access the dashboard</p>
        <Link href="/auth/signin">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Product Dashboard</h1>
          <p className="text-gray-400">Manage your store products</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/products/new">
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
          <SyncProductsButton />
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-900/20 p-4 text-center text-red-400">
              Error loading products. Please try again.
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-lg bg-dark-800 p-8 text-center">
              <p className="text-gray-400">No products found</p>
              {searchQuery && (
                <Button variant="link" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts
              .filter((product) => product.is_featured)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="low-stock">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts
              .filter((product) => product.inventory_count < 10)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ProductCardProps {
  product: {
    id: number
    name: string
    description: string | null
    price: number
    image_url: string | null
    category: string
    inventory_count: number
    is_featured: boolean
  }
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden bg-dark-800">
      <div className="relative aspect-square">
        <Image
          src={product.image_url || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          fill
          className="object-cover"
        />
        {product.is_featured && (
          <div className="absolute right-2 top-2 rounded-full bg-yellow-600 px-2 py-1 text-xs font-medium text-white">
            Featured
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-white">{product.name}</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span className="text-gray-400">{product.category}</span>
          <span className="font-medium text-white">${product.price.toFixed(2)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-2 text-sm text-gray-300">{product.description}</p>
        <div className="mt-2 text-sm">
          <span className={`${product.inventory_count < 10 ? "text-red-400" : "text-green-400"}`}>
            {product.inventory_count} in stock
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/dashboard/products/${product.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Edit
          </Button>
        </Link>
        <Link href={`/dashboard/products/${product.id}/view`} className="flex-1">
          <Button className="w-full">View</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
