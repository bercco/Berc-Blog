import shopifyClient from "./client"
import { supabase } from "@/lib/supabase/client"
import { setCache, cacheKeys } from "@/lib/redis/cache"
import type { Database } from "@/lib/supabase/types"

type Product = Database["public"]["Tables"]["products"]["Row"]

// Sync products from Shopify to our database
export async function syncShopifyProducts() {
  try {
    // Fetch products from Shopify
    const shopifyProducts = await shopifyClient.product.fetchAll()

    // Process each product
    for (const shopifyProduct of shopifyProducts) {
      const variant = shopifyProduct.variants[0]

      // Check if product exists in our database
      const { data: existingProduct } = await supabase
        .from("products")
        .select("*")
        .eq("shopify_id", shopifyProduct.id)
        .single()

      // Product data to insert/update
      const productData = {
        name: shopifyProduct.title,
        price: Number.parseFloat(variant.price),
        description: shopifyProduct.description,
        image1: shopifyProduct.images[0]?.src || "",
        image2: shopifyProduct.images[1]?.src || null,
        category: shopifyProduct.productType || "Uncategorized",
        type: mapShopifyProductType(shopifyProduct.productType),
        shopify_id: shopifyProduct.id,
        inventory_quantity: variant.quantityAvailable || 0,
      }

      if (existingProduct) {
        // Update existing product
        await supabase.from("products").update(productData).eq("id", existingProduct.id)
      } else {
        // Insert new product
        await supabase.from("products").insert(productData)
      }
    }

    // Invalidate cache
    await setCache(cacheKeys.featuredProducts, null, 0)

    return { success: true }
  } catch (error) {
    console.error("Error syncing Shopify products:", error)
    return { success: false, error }
  }
}

// Map Shopify product type to our product types
function mapShopifyProductType(productType: string): string {
  const lowerType = productType.toLowerCase()

  if (lowerType.includes("course")) return "Course"
  if (lowerType.includes("software")) return "Software"
  if (lowerType.includes("book")) return "Book"
  if (lowerType.includes("clothing") || lowerType.includes("apparel")) return "Clothing"
  if (lowerType.includes("investment")) return "Investment"
  if (lowerType.includes("electronics")) return "Electronics"

  return "Other"
}

// Fetch product from Shopify by ID
export async function getShopifyProduct(shopifyId: string) {
  try {
    return await shopifyClient.product.fetch(shopifyId)
  } catch (error) {
    console.error("Error fetching Shopify product:", error)
    throw error
  }
}
