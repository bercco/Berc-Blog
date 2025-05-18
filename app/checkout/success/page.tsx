"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function CheckoutSuccessPage() {
  const { isSignedIn, user } = useAuth()
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState<string>("")

  useEffect(() => {
    // Generate a random order number
    const randomOrderNumber = Math.floor(100000 + Math.random() * 900000).toString()
    setOrderNumber(randomOrderNumber)

    // If this was a real app, we would verify the payment status here
    // by checking the session ID from the URL or from the database
  }, [])

  return (
    <main className="flex min-h-screen flex-col pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-dark-800 rounded-lg p-8 text-center">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h1>
            <p className="text-gray-300 text-lg mb-2">Thank you for your purchase.</p>
            <p className="text-gray-400 mb-8">
              We've sent a confirmation email to{" "}
              {isSignedIn ? user?.primaryEmailAddress?.emailAddress : "your email address"}.
            </p>

            <div className="bg-dark-700 rounded-lg p-6 mb-8 inline-block">
              <p className="text-gray-400 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-white">{orderNumber}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/shop">
                <Button variant="outline" className="flex items-center">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/profile/orders">
                <Button className="flex items-center">
                  View Order Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="text-gray-400 text-sm">
              <p>Having trouble with your order?</p>
              <Link href="/contact" className="text-white hover:underline">
                Contact our support team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
