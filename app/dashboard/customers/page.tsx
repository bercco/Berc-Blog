"use client"

import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function CustomersPage() {
  const { user, loading } = useSupabaseAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-2 text-white">Loading...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold text-white">Access Denied</h1>
        <p className="mb-6 text-gray-400">Please sign in to access the dashboard</p>
        <Link href="/auth/signin">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Customers</h1>
        <p className="text-gray-400">Manage your store customers</p>
      </div>

      <div className="rounded-lg bg-dark-800 p-8 text-center">
        <h2 className="mb-4 text-xl font-bold text-white">Coming Soon</h2>
        <p className="text-gray-400">The customer management feature is under development.</p>
      </div>
    </div>
  )
}
