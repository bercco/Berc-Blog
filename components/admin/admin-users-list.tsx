"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, UserPlus, Mail, Shield, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

// Sample user data
const sampleUsers = [
  {
    id: "user1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active",
    joinDate: "2023-01-15",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    status: "Active",
    joinDate: "2023-02-22",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "user3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "Creator",
    status: "Inactive",
    joinDate: "2023-03-10",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "user4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Team",
    status: "Active",
    joinDate: "2023-04-05",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "user5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "User",
    status: "Pending",
    joinDate: "2023-05-18",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export function AdminUsersList() {
  const [users, setUsers] = useState(sampleUsers)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-900 text-green-300"
      case "Inactive":
        return "bg-red-900 text-red-300"
      case "Pending":
        return "bg-yellow-900 text-yellow-300"
      default:
        return "bg-gray-700 text-gray-300"
    }
  }

  // Get role badge color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-900 text-purple-300"
      case "Creator":
        return "bg-blue-900 text-blue-300"
      case "Team":
        return "bg-indigo-900 text-indigo-300"
      default:
        return "bg-gray-700 text-gray-300"
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-dark-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-600">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-dark-700">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                      <Image src={user.avatar || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>{user.role}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>{user.status}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(user.joinDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No users found matching your search criteria.</p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing <span className="font-medium text-white">{filteredUsers.length}</span> of{" "}
          <span className="font-medium text-white">{users.length}</span> users
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
