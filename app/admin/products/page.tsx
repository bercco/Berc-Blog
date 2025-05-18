import Link from "next/link"
import { redirect } from "next/navigation"
import { createClientClient } from "@/lib/supabase/client"
import { getProducts } from "@/lib/services/product-service"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  // Check if user is authenticated and is an admin
  const supabase = createClientClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get the user's profile to check if they're an admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/")
  }

  // Fetch products
  const products = await getProducts()

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Inventory</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex-shrink-0 mr-3">
                      <img
                        src={product.image_url || "/placeholder.svg?height=40&width=40"}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">{product.categories?.name || "Uncategorized"}</td>
                <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                <td className="py-3 px-4">{product.inventory_count}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <Link href={`/admin/products/${product.id}/delete`} className="text-red-600 hover:underline">
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No products found. Add your first product to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
