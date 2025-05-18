import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CheckoutCancelPage() {
  return (
    <div className="container max-w-md py-24 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-red-500">Checkout Canceled</CardTitle>
          <CardDescription className="text-center">Your payment was not processed</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-red-100 rounded-full">
            <ShoppingCart className="w-12 h-12 text-red-500" />
          </div>
          <p className="text-center text-gray-600">
            Your checkout process was canceled. Your cart items are still saved, and you can try again when you're
            ready.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/shop">
            <Button className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Shop
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
