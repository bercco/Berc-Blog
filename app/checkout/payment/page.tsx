"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { CryptoPayment } from "@/components/payment/crypto-payment"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CreditCard, Wallet, CheckCircle2 } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const { cartItems, totalPrice, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  // Handle traditional payment
  const handleTraditionalPayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(false)
    setPaymentComplete(true)

    // Redirect to success page after a delay
    setTimeout(() => {
      clearCart()
      router.push("/checkout/success")
    }, 1500)
  }

  // Handle crypto payment success
  const handleCryptoSuccess = () => {
    router.push("/checkout/success")
  }

  // If cart is empty, redirect to shop
  if (cartItems.length === 0 && !paymentComplete) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">Add some products to your cart before proceeding to checkout.</p>
        <Link href="/shop">
          <Button>Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link href="/checkout" className="flex items-center text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checkout
          </Link>

          <h1 className="text-3xl font-bold text-white mb-8">Payment Method</h1>

          {paymentComplete ? (
            <div className="bg-dark-800 rounded-lg p-8 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-gray-300 mb-6">Your order has been placed successfully.</p>
              <p className="text-gray-400 mb-8">You will be redirected to the confirmation page shortly...</p>
              <div className="animate-pulse bg-dark-700 h-2 w-full max-w-md mx-auto rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-2/3 rounded-full"></div>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="traditional" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="traditional" className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Credit Card
                </TabsTrigger>
                <TabsTrigger value="crypto" className="flex items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  Cryptocurrency
                </TabsTrigger>
              </TabsList>

              <TabsContent value="traditional">
                <div className="bg-dark-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Pay with Credit Card</h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="card-number" className="block text-sm font-medium text-gray-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiry"
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-300 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          id="cvc"
                          placeholder="123"
                          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="John Doe"
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white"
                      />
                    </div>
                  </div>

                  <div className="border-t border-dark-600 pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">$0.00</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-300">Total</span>
                      <span className="text-white">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button onClick={handleTraditionalPayment} disabled={isProcessing} className="w-full">
                    {isProcessing ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                        Processing...
                      </span>
                    ) : (
                      <span>Pay ${totalPrice.toFixed(2)}</span>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="crypto">
                <CryptoPayment
                  amount={totalPrice}
                  onSuccess={handleCryptoSuccess}
                  onCancel={() => router.push("/checkout")}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </main>
  )
}
