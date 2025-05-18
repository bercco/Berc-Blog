import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ProductType = "Software" | "Course" | "Book" | "Electronics" | "Clothing" | "Investment" | "Other"

export interface Product {
  id: number
  name: string
  price: number
  description: string
  image1: string
  image2: string | null
  category: string
  type: ProductType
  rating: number | null
  reviews_count: number
  inventory_quantity: number
  is_featured: boolean
}

export interface ProductReview {
  id: number
  created_at: string
  product_id: number
  user_id: string
  rating: number
  comment: string | null
  likes: number
  is_verified_purchase: boolean
  user: {
    username: string
    avatar_url: string | null
  }
}

// Mock product data
export const products: Product[] = [
  {
    id: 1,
    name: "Stock Market Fundamentals Course",
    price: 49.99,
    description:
      "Learn the basics of stock market investing with this comprehensive course for beginners. This course covers everything from understanding market fundamentals to building your first investment portfolio. Perfect for young investors looking to get started in the world of finance.",
    image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
    image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
    category: "Beginner",
    type: "Course",
    rating: 4.8,
    reviews_count: 156,
    inventory_quantity: 999,
    is_featured: true,
  },
  {
    id: 2,
    name: "Investment Portfolio Tracker Pro",
    price: 29.99,
    description:
      "Track and analyze your investments with this powerful portfolio management software. Monitor your stocks, ETFs, and cryptocurrencies all in one place. Get detailed analytics and performance metrics to optimize your investment strategy.",
    image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
    image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
    category: "Finance",
    type: "Software",
    rating: 4.6,
    reviews_count: 89,
    inventory_quantity: 999,
    is_featured: true,
  },
  {
    id: 3,
    name: "Cryptocurrency Trading Guide",
    price: 19.99,
    description:
      "Master cryptocurrency trading with this comprehensive guide for beginners and experts alike. Learn about blockchain technology, different cryptocurrencies, trading strategies, and risk management.",
    image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
    image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
    category: "Crypto",
    type: "Book",
    rating: 4.3,
    reviews_count: 67,
    inventory_quantity: 500,
    is_featured: false,
  },
  {
    id: 4,
    name: "Advanced Trading Algorithms",
    price: 199.99,
    description:
      "Implement professional-grade trading algorithms with this powerful software package. Includes pre-built algorithms for various trading strategies and a framework for developing your own custom algorithms.",
    image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
    image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
    category: "Advanced",
    type: "Software",
    rating: 4.9,
    reviews_count: 42,
    inventory_quantity: 999,
    is_featured: false,
  },
  {
    id: 5,
    name: "E-Commerce Business Blueprint",
    price: 79.99,
    description:
      "Start and scale your own e-commerce business with this step-by-step blueprint. Learn how to find profitable products, set up your online store, market your business, and scale to six figures and beyond.",
    image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
    image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
    category: "Business",
    type: "Course",
    rating: 4.7,
    reviews_count: 113,
    inventory_quantity: 999,
    is_featured: true,
  },
  {
    id: 6,
    name: "Tech Entrepreneur Hoodie",
    price: 59.99,
    description:
      "Comfortable hoodie designed for the modern tech entrepreneur. Perfect for coding sessions, business meetings, or casual wear. Made from premium materials for maximum comfort and durability.",
    image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
    image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
    category: "Apparel",
    type: "Clothing",
    rating: 4.5,
    reviews_count: 78,
    inventory_quantity: 150,
    is_featured: true,
  },
]

// Mock reviews data
export const initialReviews: ProductReview[] = [
  {
    id: 1,
    created_at: "2023-11-15T10:30:00Z",
    product_id: 1,
    user_id: "user1",
    rating: 5,
    comment:
      "This course completely changed how I approach investing. The concepts are explained clearly and the practical examples are incredibly helpful.",
    likes: 12,
    is_verified_purchase: true,
    user: {
      username: "InvestorPro",
      avatar_url: null,
    },
  },
  {
    id: 2,
    created_at: "2023-11-10T14:20:00Z",
    product_id: 1,
    user_id: "user2",
    rating: 4,
    comment:
      "Great course for beginners. I would have liked more advanced content, but it's perfect for those just starting out.",
    likes: 5,
    is_verified_purchase: true,
    user: {
      username: "StockTrader22",
      avatar_url: null,
    },
  },
  {
    id: 3,
    created_at: "2023-11-05T09:15:00Z",
    product_id: 2,
    user_id: "user3",
    rating: 5,
    comment:
      "This software has made tracking my investments so much easier. The interface is intuitive and the analytics are powerful.",
    likes: 8,
    is_verified_purchase: true,
    user: {
      username: "FinanceGuru",
      avatar_url: null,
    },
  },
]

// Create a store for reviews
interface ReviewState {
  reviews: ProductReview[]
  addReview: (review: Omit<ProductReview, "id" | "created_at">) => void
  likeReview: (reviewId: number) => void
  getProductReviews: (productId: number) => ProductReview[]
  getProductRating: (productId: number) => { average: number; count: number }
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: initialReviews,
      addReview: (review) => {
        const newReview = {
          ...review,
          id: get().reviews.length + 1,
          created_at: new Date().toISOString(),
          likes: 0,
        }

        set((state) => ({
          reviews: [...state.reviews, newReview],
        }))

        // Update product rating in products array
        const productReviews = [...get().reviews, newReview].filter((r) => r.product_id === review.product_id)
        const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0)
        const averageRating = totalRating / productReviews.length

        // This doesn't actually update the products array since it's imported, but in a real app it would
        // For now we'll just calculate this on the fly when needed
      },
      likeReview: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId ? { ...review, likes: review.likes + 1 } : review,
          ),
        }))
      },
      getProductReviews: (productId) => {
        return get().reviews.filter((review) => review.product_id === productId)
      },
      getProductRating: (productId) => {
        const productReviews = get().reviews.filter((review) => review.product_id === productId)
        if (productReviews.length === 0) {
          return { average: 0, count: 0 }
        }

        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
        return {
          average: totalRating / productReviews.length,
          count: productReviews.length,
        }
      },
    }),
    {
      name: "product-reviews-storage",
    },
  ),
)

// Function to get a product by ID
export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id)
}

// Function to get related products
export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products.filter((p) => p.type === product.type && p.id !== product.id).slice(0, limit)
}

// Function to get featured products
export function getFeaturedProducts(limit = 4): Product[] {
  return products.filter((p) => p.is_featured).slice(0, limit)
}
