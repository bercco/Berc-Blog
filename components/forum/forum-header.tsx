"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IoHome, IoNewspaper, IoTrendingUp, IoStar, IoNotifications } from "react-icons/io5"

export function ForumHeader() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="w-full bg-dark-800 border-b border-dark-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center overflow-x-auto hide-scrollbar">
          <Link
            href="/forum"
            className={`flex items-center px-4 py-3 border-b-2 whitespace-nowrap ${
              isActive("/forum") ? "border-white text-white" : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <IoHome className="mr-2" />
            Home
          </Link>

          <Link
            href="/forum/latest"
            className={`flex items-center px-4 py-3 border-b-2 whitespace-nowrap ${
              isActive("/forum/latest")
                ? "border-white text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <IoNewspaper className="mr-2" />
            Latest
          </Link>

          <Link
            href="/forum/trending"
            className={`flex items-center px-4 py-3 border-b-2 whitespace-nowrap ${
              isActive("/forum/trending")
                ? "border-white text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <IoTrendingUp className="mr-2" />
            Trending
          </Link>

          <Link
            href="/forum/favorites"
            className={`flex items-center px-4 py-3 border-b-2 whitespace-nowrap ${
              isActive("/forum/favorites")
                ? "border-white text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <IoStar className="mr-2" />
            Favorites
          </Link>

          <Link
            href="/forum/notifications"
            className={`flex items-center px-4 py-3 border-b-2 whitespace-nowrap ${
              isActive("/forum/notifications")
                ? "border-white text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <IoNotifications className="mr-2" />
            Notifications
            <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">3</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
