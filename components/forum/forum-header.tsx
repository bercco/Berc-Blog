"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { useAuth } from "@clerk/nextjs"

export function ForumHeader() {
  const { userId } = useAuth()

  return (
    <div className="w-full bg-dark-800 border-b border-dark-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Community Forum</h1>
            <p className="text-gray-400">Join discussions about trading, investing, and more</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search forum..."
                className="pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {userId ? (
              <Link href="/forum/new-thread">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Thread
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button variant="outline">Sign in to Post</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
