"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Plus, Edit, Trash2, Eye } from "lucide-react"
import Image from "next/image"

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: "Stock Market Fundamentals Course",
    price: 49.99,
    category: "Course",
    inventory: 999,
    sales: 156,
    image: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
  },
  {
    id: 2,
    name: "Investment Portfolio Tracker Pro",
    price: 29.99,
    category: "Software",
    inventory: 999,
    sales: 89,
    image: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
  },
  {
    id: 3,
    name: "Cryptocurrency Trading Guide",
    price: 19.99,
    category: "Book",
    inventory: 500,
    sales: 67,
    image: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
  },
  {
    id: 4,
    name: "Advanced Trading Algorithms",
    price: 199.99,
    category: "Software",
    inventory: 999,
    sales: 42,
    image: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
  },
  {
    id: 5,
    name: "E-Commerce Business Blueprint",
    price: 79.99,
    category: "Course",
    inventory: 999,
    sales: 113,
    image: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
  },
]

export function AdminProductsList() {
  const [products, setProducts] = useState(sampleProducts)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Course":
        return "bg-green-900 text-green-300"
      case "Software":
        return "bg-blue-900 text-blue-300"
      case "Book":
        return "bg-purple-900 text-purple-300"
      case "Clothing":
        return "bg-yellow-900 text-yellow-300"
      default:
        return "bg-gray-700 text-gray-300"
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-dark-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Inventory
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sales</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-600">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-dark-700">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="relative h-10 w-10 rounded overflow-hidden mr-3">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-sm font-medium text-white">{product.name}</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(product.category)}`}>
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-white">${product.price.toFixed(2)}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{product.inventory}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{product.sales}</td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No products found matching your search criteria.</p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing <span className="font-medium text-white">{filteredProducts.length}</span> of{" "}
          <span className="font-medium text-white">{products.length}</span> products
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
