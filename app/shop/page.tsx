"use client"

import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Search, Filter } from "lucide-react"
import { useProducts } from "@/hooks/use-products"

export default function ShopPage() {
  const { products, isLoading, error } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique categories and types
  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))]
  const types = ["All", ...Array.from(new Set(products.map((product) => product.type)))]

  // Filter products based on selected category, type, and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesType = selectedType === "All" || product.type === selectedType
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesType && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Error Loading Products</h1>
        <p className="text-gray-400 mb-8">There was an error loading the products. Please try again later.</p>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col pt-24">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Marketplace</h1>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 bg-dark-800 border border-dark-600 rounded-md text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              className="md:hidden px-4 py-2 bg-dark-700 rounded-md text-white flex items-center justify-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          <div className={`${showFilters ? "block" : "hidden md:block"}`}>
            <div className="mb-4">
              <h3 className="text-white font-medium mb-2">Product Type</h3>
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedType === type ? "bg-dark-600 text-white" : "bg-dark-800 text-gray-300"
                    } hover:bg-dark-500 transition-colors`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedCategory === category ? "bg-dark-600 text-white" : "bg-dark-800 text-gray-300"
                    } hover:bg-dark-500 transition-colors`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-400 mb-6">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"}
        </p>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No products found matching your criteria</p>
            <button
              className="text-white underline"
              onClick={() => {
                setSelectedCategory("All")
                setSelectedType("All")
                setSearchQuery("")
              }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
