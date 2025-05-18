"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useMetamask } from "@/hooks/use-metamask"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IoWallet, IoSettings, IoLogOut, IoDocument, IoHeart, IoNotifications } from "react-icons/io5"

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const { isConnected, address, disconnect } = useMetamask()
  const [activeTab, setActiveTab] = useState("posts")

  if (!isLoaded) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading profile...</div>
      </div>
    )
  }

  if (!user && !isConnected) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-white mb-4">Sign In Required</h1>
        <p className="text-gray-400 mb-8 text-center">
          You need to sign in or connect your wallet to view your profile.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-dark-800 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                {user ? (
                  <Image
                    src={user.imageUrl || "/placeholder.svg"}
                    alt={user.username || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-dark-600 flex items-center justify-center">
                    <IoWallet className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-grow text-center md:text-left">
                <h1 className="text-2xl font-bold text-white mb-1">
                  {user ? user.username || "User" : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                </h1>

                {user && <p className="text-gray-400 mb-2">{user.emailAddresses[0]?.emailAddress}</p>}

                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {isConnected && (
                    <div className="bg-dark-700 px-3 py-1 rounded-full text-sm text-gray-300 flex items-center">
                      <IoWallet className="mr-1 h-4 w-4" />
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </div>
                  )}

                  <div className="bg-dark-700 px-3 py-1 rounded-full text-sm text-gray-300">Joined May 2025</div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">24</div>
                    <div className="text-xs text-gray-400">Posts</div>
                  </div>

                  <div className="text-center">
                    <div className="text-xl font-bold text-white">156</div>
                    <div className="text-xs text-gray-400">Comments</div>
                  </div>

                  <div className="text-center">
                    <div className="text-xl font-bold text-white">1.2k</div>
                    <div className="text-xs text-gray-400">Reputation</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link href="/profile/edit">
                  <Button variant="outline" size="sm" className="w-full">
                    <IoSettings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>

                {isConnected && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={disconnect}
                    className="w-full text-red-400 hover:text-red-300"
                  >
                    <IoLogOut className="mr-2 h-4 w-4" />
                    Disconnect Wallet
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="bg-dark-800 w-full justify-start rounded-t-lg border-b border-dark-600 p-0">
              <TabsTrigger
                value="posts"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-white"
              >
                <IoDocument className="mr-2 h-4 w-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-white"
              >
                <IoHeart className="mr-2 h-4 w-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-white"
              >
                <IoNotifications className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="bg-dark-800 rounded-b-lg p-6">
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">You haven't created any posts yet.</p>
                <Link href="/forum/new-thread">
                  <Button>Create Your First Post</Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="bg-dark-800 rounded-b-lg p-6">
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">You haven't favorited any posts yet.</p>
                <Link href="/forum">
                  <Button variant="outline">Browse Forum</Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="bg-dark-800 rounded-b-lg p-6">
              <div className="space-y-4">
                <div className="bg-dark-700 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 rounded-full p-2">
                      <IoNotifications className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white">Your post received 5 new likes</p>
                      <p className="text-sm text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-700 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 rounded-full p-2">
                      <IoDocument className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white">Someone replied to your thread "Investment Strategies"</p>
                      <p className="text-sm text-gray-400">Yesterday</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-700 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500 rounded-full p-2">
                      <IoWallet className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white">You successfully connected your wallet</p>
                      <p className="text-sm text-gray-400">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
