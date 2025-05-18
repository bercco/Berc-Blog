import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { SplashScreen } from "@/components/splash-screen"
import { CustomCursor } from "@/components/custom-cursor"
import { Navbar } from "@/components/navbar"
import { CartProvider } from "@/context/cart-context"
import { CartDrawer } from "@/components/cart-drawer"
import { ClerkProvider } from "@clerk/nextjs"
import { MetamaskProvider } from "@/hooks/use-metamask"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Data Fortress Ltd. - Investment Resources & E-Commerce",
  description: "Premium investment resources, software, and e-commerce marketplace",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-dark-900 text-gray-100`}>
        <ClerkProvider>
          <MetamaskProvider>
            <CartProvider>
              <Suspense fallback={<SplashScreen />}>
                <Navbar />
                {children}
                <footer className="w-full py-6 px-4 bg-dark-600 text-gray-400">
                  <div className="container mx-auto text-center">
                    <p>&copy; {new Date().getFullYear()} Data Fortress Ltd. All rights reserved.</p>
                  </div>
                </footer>
                <CartDrawer />
                <CustomCursor />
                <Toaster />
              </Suspense>
            </CartProvider>
          </MetamaskProvider>
        </ClerkProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
