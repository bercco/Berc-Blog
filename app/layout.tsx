import type React from "react"
import "./globals.css"
import Link from "next/link"
import { createClientClient } from "@/lib/supabase/client"

export const metadata = {
  title: "E-Commerce Store",
  description: "A simple e-commerce store built with Next.js and Supabase",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClientClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body>
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                E-Commerce Store
              </Link>

              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <Link href="/" className="hover:text-blue-600">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="hover:text-blue-600">
                      Products
                    </Link>
                  </li>
                  {user ? (
                    <>
                      <li>
                        <Link href="/account" className="hover:text-blue-600">
                          My Account
                        </Link>
                      </li>
                      <li>
                        <Link href="/logout" className="hover:text-blue-600">
                          Logout
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link href="/login" className="hover:text-blue-600">
                        Login
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link href="/cart" className="hover:text-blue-600">
                      Cart (0)
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <main className="min-h-screen bg-gray-50">{children}</main>

        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About Us</h3>
                <p className="text-gray-300">
                  We are a leading e-commerce store providing high-quality products at competitive prices.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/products" className="text-gray-300 hover:text-white">
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-300 hover:text-white">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-300 hover:text-white">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <address className="text-gray-300 not-italic">
                  123 E-Commerce St.
                  <br />
                  City, State 12345
                  <br />
                  Email: info@example.com
                  <br />
                  Phone: (123) 456-7890
                </address>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
              <p>&copy; {new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
