import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductById } from "@/lib/services/product-service"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const product = await getProductById(params.id)

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
              <p className="text-gray-600 mt-2">Category: {product.categories?.name || "Uncategorized"}</p>

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
  } catch (error) {
    console.error(`Error fetching product with id ${params.id}:`, error)
    notFound()
  }
}
