"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  UserPlus,
} from "lucide-react"
import { AdminSalesChart } from "@/components/admin/admin-sales-chart"
import { AdminUsersList } from "@/components/admin/admin-users-list"
import { AdminProductsList } from "@/components/admin/admin-products-list"
import { AdminForumStats } from "@/components/admin/admin-forum-stats"

export default function AdminDashboardPage() {
  const { isLoaded, userId, isSignedIn } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded) {
      // In a real app, you would check if the user has admin permissions
      // by querying your database or Clerk's metadata
      const checkAdminStatus = async () => {
        try {
          // Simulate API call to check admin status
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // For demo purposes, we'll just set isAdmin to true
          // In a real app, this would be based on the user's role
          setIsAdmin(true)
          setIsLoading(false)
        } catch (error) {
          console.error("Error checking admin status:", error)
          setIsAdmin(false)
          setIsLoading(false)
        }
      }

      if (isSignedIn) {
        checkAdminStatus()
      } else {
        setIsLoading(false)
      }
    }
  }, [isLoaded, isSignedIn, userId])

  // Redirect if not signed in or not an admin
  useEffect(() => {
    if (isLoaded && !isLoading) {
      if (!isSignedIn) {
        router.push("/sign-in?redirect=/admin")
      } else if (!isAdmin) {
        router.push("/")
      }
    }
  }, [isLoaded, isLoading, isSignedIn, isAdmin, router])

  if (isLoading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-dark-800 rounded-lg p-4">
            <h2 className="text-xl font-bold text-white mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#dashboard">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#users">
                  <Users className="mr-2 h-5 w-5" />
                  Users
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#products">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Products
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#analytics">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Analytics
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#forum">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Forum
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#settings">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </a>
              </Button>
            </nav>

            <div className="mt-8 pt-4 border-t border-dark-600">
              <Button variant="outline" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Team Member
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-dark-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Sales</p>
                <p className="text-2xl font-bold text-white">$12,426.50</p>
                <div className="flex items-center text-green-500 text-sm mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12.5% from last month</span>
                </div>
              </div>

              <div className="bg-dark-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">1,245</p>
                <div className="flex items-center text-green-500 text-sm mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+8.2% from last month</span>
                </div>
              </div>

              <div className="bg-dark-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Forum Posts</p>
                <p className="text-2xl font-bold text-white">342</p>
                <div className="flex items-center text-green-500 text-sm mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+15.7% from last month</span>
                </div>
              </div>

              <div className="bg-dark-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">3.2%</p>
                <div className="flex items-center text-red-500 text-sm mt-2">
                  <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                  <span>-0.5% from last month</span>
                </div>
              </div>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="sales" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="sales">Sales Overview</TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="forum">Forum Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="sales">
                <div className="bg-dark-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Sales Overview</h3>
                  <AdminSalesChart />
                </div>
              </TabsContent>

              <TabsContent value="users">
                <div className="bg-dark-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">User Management</h3>
                  <AdminUsersList />
                </div>
              </TabsContent>

              <TabsContent value="products">
                <div className="bg-dark-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Products</h3>
                  <AdminProductsList />
                </div>
              </TabsContent>

              <TabsContent value="forum">
                <div className="bg-dark-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Forum Activity</h3>
                  <AdminForumStats />
                </div>
              </TabsContent>
            </Tabs>

            {/* Recent Activity */}
            <div className="mt-8 bg-dark-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-dark-600">
                  <div className="bg-dark-700 p-2 rounded-full">
                    <ShoppingBag className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-white">New order #12345 has been placed</p>
                    <p className="text-sm text-gray-400">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-dark-600">
                  <div className="bg-dark-700 p-2 rounded-full">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-white">New user John Doe has registered</p>
                    <p className="text-sm text-gray-400">5 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-dark-600">
                  <div className="bg-dark-700 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-white">New forum thread "Investment Strategies" has been created</p>
                    <p className="text-sm text-gray-400">Yesterday</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-dark-700 p-2 rounded-full">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-white">System update scheduled for next week</p>
                    <p className="text-sm text-gray-400">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
