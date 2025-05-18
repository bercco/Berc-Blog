import { createClientClient } from "@/lib/supabase/client"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { AIChatWidget } from "@/components/ai-chat-widget"

interface ShopPageProps {
  searchParams: {
    category?: string
    min_price?: string
    max_price?: string
    sort?: string
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const supabase = createClientClient()

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Fetch price range
  const { data: priceData } = await supabase.from("products").select("price").order("price", { ascending: true })

  const minPrice = priceData && priceData.length > 0 ? Math.floor(priceData[0].price) : 0
  const maxPrice = priceData && priceData.length > 0 ? Math.ceil(priceData[priceData.length - 1].price) : 1000

  // Build query for products
  let query = supabase.from("products").select("*")

  // Apply category filter
  if (searchParams.category) {
    query = query.eq("category_id", searchParams.category)
  }

  // Apply price filter
  const minPriceParam = searchParams.min_price ? Number.parseInt(searchParams.min_price) : minPrice
  const maxPriceParam = searchParams.max_price ? Number.parseInt(searchParams.max_price) : maxPrice

  query = query.gte("price", minPriceParam).lte("price", maxPriceParam)

  // Apply sorting
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      case "price-asc":
        query = query.order("price", { ascending: true })
        break
      case "price-desc":
        query = query.order("price", { ascending: false })
        break
      case "popular":
        query = query.order("sales_count", { ascending: false })
        break
      default:
        query = query.order("created_at", { ascending: false })
    }
  } else {
    query = query.order("created_at", { ascending: false })
  }

  // Fetch products
  const { data: products } = await query

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Shop Our Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <ProductFilters categories={categories || []} minPrice={minPrice} maxPrice={maxPrice} />
        </div>

        <div className="md:col-span-3">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>

      <AIChatWidget />
    </div>
  )
}
