import Link from "next/link"
import Image from "next/image"
import { getProducts } from "@/lib/services/product-service"
import { getCategories } from "@/lib/services/category-service"

export const dynamic = "force-dynamic"

export default async function ProductsPage() {
  const products = await getProducts()
  const categories = await getCategories()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-blue-600 hover:underline">
                  All Products
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/products?category=${category.slug}`} className="text-blue-600 hover:underline">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {products.length === 0 && (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-semibold">No products found</h3>
                <p className="text-gray-600 mt-2">Try a different category or check back later.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
