import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

// Sample products data
const sampleProducts = [
  {
    name: "Wireless Headphones",
    description: "Premium sound quality with noise cancellation technology and long battery life.",
    price: 99.99,
    image_url: "/placeholder.svg?height=400&width=600&text=Headphones",
    category_slug: "electronics",
    inventory_count: 50,
  },
  {
    name: "Smart Watch",
    description: "Track your fitness and stay connected with notifications and apps.",
    price: 149.99,
    image_url: "/placeholder.svg?height=400&width=600&text=Watch",
    category_slug: "electronics",
    inventory_count: 30,
  },
  {
    name: "Men's T-Shirt",
    description: "Comfortable cotton t-shirt with modern fit and stylish design.",
    price: 24.99,
    image_url: "/placeholder.svg?height=400&width=600&text=T-Shirt",
    category_slug: "clothing",
    inventory_count: 100,
  },
  {
    name: "Women's Jeans",
    description: "High-quality denim jeans with perfect fit and durability.",
    price: 59.99,
    image_url: "/placeholder.svg?height=400&width=600&text=Jeans",
    category_slug: "clothing",
    inventory_count: 75,
  },
  {
    name: "Coffee Maker",
    description: "Brew delicious coffee with programmable settings and thermal carafe.",
    price: 79.99,
    image_url: "/placeholder.svg?height=400&width=600&text=Coffee+Maker",
    category_slug: "home-kitchen",
    inventory_count: 25,
  },
  {
    name: "Blender",
    description: "Powerful blender for smoothies, soups, and more with multiple speed settings.",
    price: 49.99,
    image_url: "/placeholder.svg?height=400&width=600&text=Blender",
    category_slug: "home-kitchen",
    inventory_count: 40,
  },
  {
    name: "Science Fiction Novel",
    description: "Bestselling sci-fi novel that takes you on an adventure through space and time.",
    price: 14.99,
    image_url: "/placeholder.svg?height=400&width=600&text=Book",
    category_slug: "books",
    inventory_count: 200,
  },
  {
    name: "Board Game",
    description: "Fun strategy board game for the whole family with replayable scenarios.",
    price: 34.99,
    image_url: "/placeholder.svg?height=400&width=600&text=Board+Game",
    category_slug: "toys-games",
    inventory_count: 60,
  },
]

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Check if categories exist
    const { data: categories, error: categoriesError } = await supabase.from("categories").select("*")

    if (categoriesError) {
      return NextResponse.json(
        {
          success: false,
          message: "Error fetching categories. Make sure to run the SQL migration first.",
          error: categoriesError,
        },
        { status: 500 },
      )
    }

    if (!categories || categories.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No categories found. Make sure to run the SQL migration first.",
        },
        { status: 400 },
      )
    }

    // Create a map of category slugs to IDs
    const categoryMap = new Map(categories.map((category) => [category.slug, category.id]))

    // Prepare products with category IDs
    const productsToInsert = sampleProducts.map((product) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      category_id: categoryMap.get(product.category_slug),
      inventory_count: product.inventory_count,
    }))

    // Insert products
    const { data: insertedProducts, error: insertError } = await supabase
      .from("products")
      .insert(productsToInsert)
      .select()

    if (insertError) {
      return NextResponse.json(
        {
          success: false,
          message: "Error inserting sample products",
          error: insertError,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully inserted ${insertedProducts.length} sample products`,
      data: insertedProducts,
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error seeding database",
        error,
      },
      { status: 500 },
    )
  }
}
