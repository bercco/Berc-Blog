"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

// This is a simplified example of how you might sync products from Shopify
// In a real application, you would use the Shopify API to fetch products
export async function syncProductsWithShopify() {
  try {
    // In a real implementation, you would fetch products from Shopify API
    // For this example, we'll just create some sample products

    const sampleProducts = [
      {
        name: "Classic Black Hoodie",
        description: "A comfortable black hoodie made from premium materials.",
        price: 59.99,
        image_url: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
        category: "Apparel",
        inventory_count: 25,
        is_featured: true,
      },
      {
        name: "Gray Zip-Up Hoodie",
        description: "A stylish gray zip-up hoodie perfect for any occasion.",
        price: 64.99,
        image_url: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
        category: "Apparel",
        inventory_count: 18,
        is_featured: false,
      },
      {
        name: "Navy Blue Pullover Hoodie",
        description: "A classic navy blue pullover hoodie with front pocket.",
        price: 54.99,
        image_url: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
        category: "Apparel",
        inventory_count: 30,
        is_featured: true,
      },
    ]

    // Insert sample products into Supabase
    const { error } = await supabaseAdmin.from("products").upsert(sampleProducts, {
      onConflict: "name",
      ignoreDuplicates: false,
    })

    if (error) throw error

    // Revalidate the dashboard page to show the new products
    revalidatePath("/dashboard")

    return { success: true, message: "Products synced successfully" }
  } catch (error) {
    console.error("Error syncing products:", error)
    return { success: false, message: "Failed to sync products", error }
  }
}
