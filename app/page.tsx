import Link from "next/link"
import Image from "next/image"
import { getProducts } from "@/lib/services/product-service"
import { getCategories } from "@/lib/services/category-service"

export default async function HomePage() {
  // Get featured products (we'll just use the first 4 products for this example)
  const products = await getProducts({ limit: 4 })
  const categories = await getCategories()

  return (
    <div className="container mx-auto py-8">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white rounded-lg p-8 mb-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Store</h1>
          <p className="text-xl mb-6">Discover amazing products at great prices. Shop now and enjoy fast shipping!</p>
          <Link
            href="/products"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600">Browse our {category.name.toLowerCase()} collection</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
