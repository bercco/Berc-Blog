"use client"

import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { CheckoutButton } from "@/components/checkout/checkout-button"

export function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart()

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70">
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-dark-900 shadow-xl transform transition-transform duration-300"
        style={{ transform: isCartOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-600">
            <h2 className="text-xl font-bold text-white flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Your Cart ({totalItems})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-dark-700 transition-colors"
            >
              <X className="h-5 w-5 text-gray-300" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow overflow-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingBag className="h-16 w-16 mb-4" />
                <p className="text-lg">Your cart is empty</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsCartOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="bg-dark-800 rounded-lg overflow-hidden">
                    <div className="flex">
                      <div className="relative w-24 h-24">
                        <Image src={item.image1 || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-grow p-3">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-white">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-white">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-gray-400">${item.price.toFixed(2)}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-full bg-dark-600 hover:bg-dark-500"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-3 text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full bg-dark-600 hover:bg-dark-500"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-dark-600 bg-dark-900">
              <div className="flex justify-between mb-4">
                <span className="text-gray-300">Subtotal</span>
                <span className="font-medium text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <CheckoutButton className="w-full" />
              <button
                className="w-full text-center mt-2 text-gray-400 hover:text-white"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
