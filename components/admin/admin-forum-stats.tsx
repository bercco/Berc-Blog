"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  MessageSquare,
  Users,
  Calendar,
  Download,
  Pin,
  Lock,
  Flag,
  CheckCircle2,
  XCircle,
} from "lucide-react"

export function AdminForumStats() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-lg font-medium text-white">Forum Activity</h4>
          <p className="text-gray-400">Monitor forum engagement and moderation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threads">Threads</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-white font-medium">Activity by Category</h5>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">Stock Market Strategies</span>
                    <span className="text-gray-300">156 threads</span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">Technical Analysis</span>
                    <span className="text-gray-300">98 threads</span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">Fundamental Analysis</span>
                    <span className="text-gray-300">87 threads</span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">Cryptocurrency Trading</span>
                    <span className="text-gray-300">124 threads</span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">Market News & Events</span>
                    <span className="text-gray-300">112 threads</span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "55%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-dark-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-white font-medium">User Engagement</h5>
                <Users className="h-5 w-5 text-gray-400" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-dark-600 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-white">1,245</p>
                  <p className="text-gray-400 text-sm">Active Users</p>
                </div>
                <div className="bg-dark-600 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-white">342</p>
                  <p className="text-gray-400 text-sm">Forum Posts</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">Posts per User</span>
                    <span className="text-gray-300">3.2 avg</span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">Comments per Thread</span>
                    <span className="text-gray-300">8.7 avg</span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">User Retention</span>
                    <span className="text-gray-300">78%</span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-dark-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-white font-medium">Recent Activity</h5>
              <MessageSquare className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-dark-600">
                <div className="bg-dark-600 p-2 rounded-full">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-white">
                    New thread "The Ultimate Guide to Moving Average Crossover Strategy" created
                  </p>
                  <p className="text-sm text-gray-400">2 hours ago by TradingMaster</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-4 border-b border-dark-600">
                <div className="bg-dark-600 p-2 rounded-full">
                  <Users className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-white">New user InvestorPro joined the forum</p>
                  <p className="text-sm text-gray-400">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-4 border-b border-dark-600">
                <div className="bg-dark-600 p-2 rounded-full">
                  <Pin className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-white">Thread "Fed Meeting Impact: Preparing Your Portfolio" pinned</p>
                  <p className="text-sm text-gray-400">Yesterday by Admin</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-dark-600 p-2 rounded-full">
                  <Flag className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-white">Comment reported for review</p>
                  <p className="text-sm text-gray-400">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="threads">
          <div className="bg-dark-700 rounded-lg p-6">
            <h5 className="text-white font-medium mb-4">Popular Threads</h5>

            <div className="space-y-4">
              <div className="bg-dark-600 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="text-white font-medium">The Ultimate Guide to Moving Average Crossover Strategy</h6>
                    <p className="text-sm text-gray-400">Posted by TradingMaster • 5 days ago</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center text-gray-400 text-sm">
                      <MessageSquare className="h-4 w-4 mr-1" /> 42
                    </span>
                    <span className="flex items-center text-gray-400 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" /> 87
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-600 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="text-white font-medium">MACD Divergence: How to Spot Potential Reversals</h6>
                    <p className="text-sm text-gray-400">Posted by MarketGuru • 3 days ago</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center text-gray-400 text-sm">
                      <MessageSquare className="h-4 w-4 mr-1" /> 28
                    </span>
                    <span className="flex items-center text-gray-400 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" /> 65
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-600 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="text-white font-medium">Fundamental Analysis: P/E Ratio Isn't Everything</h6>
                    <p className="text-sm text-gray-400">Posted by StockAnalyst • 7 days ago</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center text-gray-400 text-sm">
                      <MessageSquare className="h-4 w-4 mr-1" /> 37
                    </span>
                    <span className="flex items-center text-gray-400 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" /> 92
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="moderation">
          <div className="bg-dark-700 rounded-lg p-6">
            <h5 className="text-white font-medium mb-4">Moderation Queue</h5>

            <div className="space-y-4">
              <div className="bg-dark-600 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="text-white font-medium">Reported Comment</h6>
                    <p className="text-sm text-gray-400">Reported by User123 • 2 hours ago</p>
                    <p className="mt-2 p-2 bg-dark-500 rounded text-gray-300 text-sm">
                      This is spam content promoting an external service. Please remove.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm">
                      <XCircle className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-dark-600 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="text-white font-medium">Thread Flagged for Review</h6>
                    <p className="text-sm text-gray-400">Flagged by System • 5 hours ago</p>
                    <p className="mt-2 p-2 bg-dark-500 rounded text-gray-300 text-sm">
                      This thread contains potentially misleading financial advice.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm">
                      <Lock className="h-4 w-4 mr-1" />
                      Lock
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="bg-dark-700 rounded-lg p-6">
            <h5 className="text-white font-medium mb-4">Top Contributors</h5>

            <div className="space-y-4">
              <div className="bg-dark-600 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-dark-500 rounded-full mr-3"></div>
                    <div>
                      <h6 className="text-white font-medium">TradingMaster</h6>
                      <p className="text-sm text-gray-400">342 posts • 876 reputation</p>
                    </div>
                  </div>
                  <div className="text-green-500 font-medium">+24% activity</div>
                </div>
              </div>

              <div className="bg-dark-600 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-dark-500 rounded-full mr-3"></div>
                    <div>
                      <h6 className="text-white font-medium">StockAnalyst</h6>
                      <p className="text-sm text-gray-400">256 posts • 721 reputation</p>
                    </div>
                  </div>
                  <div className="text-green-500 font-medium">+18% activity</div>
                </div>
              </div>

              <div className="bg-dark-600 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-dark-500 rounded-full mr-3"></div>
                    <div>
                      <h6 className="text-white font-medium">MarketGuru</h6>
                      <p className="text-sm text-gray-400">412 posts • 932 reputation</p>
                    </div>
                  </div>
                  <div className="text-green-500 font-medium">+32% activity</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
