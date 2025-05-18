import Link from "next/link"
import Image from "next/image"

// Use static data for the homepage to avoid database queries during build
const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Clothing", slug: "clothing" },
  { name: "Home & Kitchen", slug: "home-kitchen" },
  { name: "Books", slug: "books" },
  { name: "Toys & Games", slug: "toys-games" },
]

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      {/* Setup notice */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm">
              First time setup? Visit the{" "}
              <Link href="/setup" className="font-medium underline">
                setup page
              </Link>{" "}
              to initialize your database.
            </p>
          </div>
        </div>
      </div>

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

      {/* Featured Products Section - Static */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Static product placeholders */}
          {[
            {
              name: "Wireless Headphones",
              description: "Premium sound quality with noise cancellation technology.",
              price: 99.99,
              image: "/placeholder.svg?height=200&width=300&text=Headphones",
            },
            {
              name: "Smart Watch",
              description: "Track your fitness and stay connected with notifications.",
              price: 149.99,
              image: "/placeholder.svg?height=200&width=300&text=Watch",
            },
            {
              name: "Laptop Backpack",
              description: "Durable and water-resistant with multiple compartments.",
              price: 59.99,
              image: "/placeholder.svg?height=200&width=300&text=Backpack",
            },
            {
              name: "Coffee Maker",
              description: "Brew delicious coffee with programmable settings.",
              price: 79.99,
              image: "/placeholder.svg?height=200&width=300&text=Coffee+Maker",
            },
          ].map((product, i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 relative">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                  <Link href="/products" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories - Static */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
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
