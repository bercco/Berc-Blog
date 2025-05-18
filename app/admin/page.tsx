import Link from "next/link"
import { redirect } from "next/navigation"
import { createClientClient } from "@/lib/supabase/client"
import { getAllProfiles } from "@/lib/services/profile-service"
import { getProducts } from "@/lib/services/product-service"
import { getAllOrders } from "@/lib/services/order-service"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  // Check if user is authenticated and is an admin
  const supabase = createClientClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get the user's profile to check if they're an admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/")
  }

  // Fetch dashboard data
  const profiles = await getAllProfiles()
  const products = await getProducts()
  const orders = await getAllOrders()

  // Calculate some stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = orders.filter((order) => order.status === "pending").length

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold">{profiles.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Products</h2>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Order ID</th>
                  <th className="py-2 text-left">Customer</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-2">
                      <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                        {order.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="py-2">{order.profiles?.full_name || "Unknown"}</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2">${order.total.toFixed(2)}</td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Products</h2>
            <Link href="/admin/products" className="text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Product</th>
                  <th className="py-2 text-left">Price</th>
                  <th className="py-2 text-left">Inventory</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-2">
                      <Link href={`/admin/products/${product.id}`} className="text-blue-600 hover:underline">
                        {product.name}
                      </Link>
                    </td>
                    <td className="py-2">${product.price.toFixed(2)}</td>
                    <td className="py-2">{product.inventory_count}</td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700"
        >
          Add New Product
        </Link>

        <Link
          href="/admin/categories/new"
          className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700"
        >
          Add New Category
        </Link>

        <Link
          href="/admin/orders?status=pending"
          className="bg-yellow-600 text-white p-4 rounded-lg text-center hover:bg-yellow-700"
        >
          View Pending Orders ({pendingOrders})
        </Link>
      </div>
    </div>
  )
}
