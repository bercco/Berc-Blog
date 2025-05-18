"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { ChevronRight, ShoppingCart, Heart, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ProductZoom } from "@/components/product/product-zoom"
import { ReviewSystem } from "@/components/product/review-system"
import { products, getRelatedProducts } from "@/lib/data/products"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const productId = Number(params.id)

        // Find the product in our local data
        const foundProduct = products.find((p) => p.id === productId)

        if (foundProduct) {
          setProduct(foundProduct)
          // Get related products
          const related = getRelatedProducts(foundProduct, 3)
          setRelatedProducts(related)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return

    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }

    toast({
      title: "Added to cart",
      description: `${product.name} (x${quantity}) has been added to your cart.`,
    })
  }

  // If product not found or still loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
        <p className="text-gray-400 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    )
  }

  // Prepare images for zoom component
  const productImages = [product.image1]
  if (product.image2) productImages.push(product.image2)

  return (
    <main className="flex min-h-screen flex-col pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/shop" className="hover:text-white">
            Shop
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/shop?type=${product.type}`} className="hover:text-white">
            {product.type}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-white">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product Image with Zoom */}
          <div>
            <ProductZoom images={productImages} productName={product.name} />
          </div>

          {/* Product Info */}
          <div>
            <span className="inline-block px-3 py-1 bg-dark-700 text-white text-sm rounded-full mb-4">
              {product.type}
            </span>
            <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>

            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-300">{product.rating.toFixed(1)}</span>
                <span className="ml-1 text-gray-400">
                  ({product.reviews_count || 0} {product.reviews_count === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            <p className="text-3xl font-bold text-white mb-6">${product.price.toFixed(2)}</p>
            <p className="text-gray-300 mb-8">{product.description}</p>

            {/* Availability */}
            <div className="mb-6">
              {product.inventory_quantity !== null && (
                <div className="flex items-center mb-2">
                  <span className="text-gray-400 mr-2">Availability:</span>
                  {product.inventory_quantity > 0 ? (
                    <span className="text-green-500">In Stock ({product.inventory_quantity} available)</span>
                  ) : (
                    <span className="text-red-500">Out of Stock</span>
                  )}
                </div>
              )}
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">Category:</span>
                <span className="text-white">{product.category}</span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-dark-600 rounded-md">
                  <button
                    className="px-3 py-2 text-gray-300 hover:text-white"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-white">{quantity}</span>
                  <button
                    className="px-3 py-2 text-gray-300 hover:text-white"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <Button
                  className="flex-grow"
                  onClick={handleAddToCart}
                  disabled={product.inventory_quantity !== null && product.inventory_quantity <= 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1">
                  <Heart className="mr-2 h-4 w-4" /> Wishlist
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-dark-600">
              <div className="flex items-center text-gray-400 text-sm">
                <span className="mr-4">Category: {product.category}</span>
                <span>SKU: PROD-{product.id.toString().padStart(4, "0")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <ReviewSystem productId={params.id.toString()} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link href={`/product/${relatedProduct.id}`} key={relatedProduct.id}>
                  <div className="bg-dark-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video">
                      <img
                        src={relatedProduct.image1 || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{relatedProduct.name}</h3>
                      <p className="text-gray-400 mb-2">${relatedProduct.price.toFixed(2)}</p>
                      {relatedProduct.rating && (
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(relatedProduct.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-400"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-xs text-gray-400">({relatedProduct.reviews_count || 0})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
