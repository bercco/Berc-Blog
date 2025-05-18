import type React from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { LayoutDashboard, ShoppingBag, Users, BarChart, Settings, LogOut } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const supabase = createAdminClient()

  // Check if user is admin
  const { data: user } = await supabase.from("users").select("role").eq("id", userId).single()

  if (!user || user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            <li>
              <Link
                href="/admin/dashboard"
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md"
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products"
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md"
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md"
              >
                <Users className="mr-3 h-5 w-5" />
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/admin/analytics"
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md"
              >
                <BarChart className="mr-3 h-5 w-5" />
                Analytics
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md"
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <Link href="/sign-out" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md">
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Link>
        </div>
      </aside>
      <main className="flex-1 bg-gray-100">{children}</main>
    </div>
  )
}
