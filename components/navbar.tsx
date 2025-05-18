"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, TrendingUp, ShoppingCart, BookOpen, Code, User } from "lucide-react"
import { CartIcon } from "./cart-icon"
import { useAuth } from "@clerk/nextjs"
import { UserButton } from "@/components/auth/user-button"
import { Button } from "@/components/ui/button"
import { useMetamask } from "@/hooks/use-metamask"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
  const { isSignedIn, user } = useAuth()
  const { connect, isConnected, address } = useMetamask()

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-dark-900/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 mr-2">
              <Image
                src="https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" // Replace with your actual Cloudinary URL
                alt="SDFM 2520"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-white font-bold text-xl hidden sm:inline-block">InvestMart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              HOME
            </Link>
            <div className="relative group">
              <button
                className="text-gray-300 hover:text-white transition-colors flex items-center"
                onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
              >
                SHOP
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-dark-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                <div className="py-1">
                  <Link
                    href="/shop?type=Course"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white flex items-center"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Courses
                  </Link>
                  <Link
                    href="/shop?type=Software"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white flex items-center"
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Software
                  </Link>
                  <Link
                    href="/shop?type=Investment"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white flex items-center"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Investment
                  </Link>
                  <Link
                    href="/shop?type=Clothing"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white flex items-center"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Merchandise
                  </Link>
                  <div className="border-t border-dark-600 my-1"></div>
                  <Link
                    href="/shop"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/forum" className="text-gray-300 hover:text-white transition-colors">
              FORUM
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              ABOUT
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
              CONTACT
            </Link>
          </div>

          {/* Auth and Cart */}
          <div className="flex items-center space-x-4">
            <UserButton />

            {!isConnected && (
              <Button variant="outline" size="sm" onClick={connect} className="hidden md:flex">
                Connect Wallet
              </Button>
            )}

            {isConnected && (
              <div className="hidden md:block text-xs text-gray-300 bg-dark-700 px-2 py-1 rounded-md">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
            )}

            <CartIcon />
            <button
              className="md:hidden p-2 rounded-full bg-dark-400 hover:bg-dark-300 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-100" /> : <Menu className="w-6 h-6 text-gray-100" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-600">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                HOME
              </Link>
              <div>
                <button
                  className="text-gray-300 hover:text-white transition-colors py-2 flex items-center justify-between w-full"
                  onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
                >
                  SHOP
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${isSubmenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isSubmenuOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    <Link
                      href="/shop?type=Course"
                      className="block py-2 text-gray-400 hover:text-white flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Courses
                    </Link>
                    <Link
                      href="/shop?type=Software"
                      className="block py-2 text-gray-400 hover:text-white flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Code className="mr-2 h-4 w-4" />
                      Software
                    </Link>
                    <Link
                      href="/shop?type=Investment"
                      className="block py-2 text-gray-400 hover:text-white flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Investment
                    </Link>
                    <Link
                      href="/shop?type=Clothing"
                      className="block py-2 text-gray-400 hover:text-white flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Merchandise
                    </Link>
                    <Link
                      href="/shop"
                      className="block py-2 text-gray-400 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      View All Products
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href="/forum"
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                FORUM
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                ABOUT
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACT
              </Link>

              {!isConnected && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    connect()
                    setIsMenuOpen(false)
                  }}
                  className="mt-2"
                >
                  Connect Wallet
                </Button>
              )}

              {!isSignedIn && (
                <Link
                  href="/sign-in"
                  className="text-gray-300 hover:text-white transition-colors py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
