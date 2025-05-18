"use client"

import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { UserProfile } from "@/components/user-profile"

export default function SettingsPage() {
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
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your account and store settings</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <UserProfile />
        </div>

        <div className="space-y-8">
          <div className="rounded-lg bg-dark-800 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Store Settings</h2>
            <p className="text-gray-400">Coming soon</p>
          </div>

          <div className="rounded-lg bg-dark-800 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">API Keys</h2>
            <p className="text-gray-400">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
