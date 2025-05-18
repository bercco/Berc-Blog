import Link from "next/link"
import { ProductList } from "@/components/product-list"

// Static categories data to avoid database queries during build
const categories = [
  { name: "All Products", slug: null },
  { name: "Electronics", slug: "electronics" },
  { name: "Clothing", slug: "clothing" },
  { name: "Home & Kitchen", slug: "home-kitchen" },
  { name: "Books", slug: "books" },
  { name: "Toys & Games", slug: "toys-games" },
]

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const categorySlug = searchParams.category || null

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    href={category.slug ? `/products?category=${category.slug}` : "/products"}
                    className={`hover:underline ${
                      (categorySlug === category.slug) || (!categorySlug && !category.slug)
                        ? "text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-3">
          <ProductList categorySlug={categorySlug} />
        </div>
      </div>
    </div>
  )
}
