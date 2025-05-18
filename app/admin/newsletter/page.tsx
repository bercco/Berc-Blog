"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Send, Users, Calendar, FileText, RefreshCw, CheckCircle2, Search } from "lucide-react"
import Link from "next/link"

export default function AdminNewsletterPage() {
  const [topic, setTopic] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for the newsletter",
        variant: "destructive",
      })
      return
    }

    try {
      setIsGenerating(true)

      const response = await fetch("/api/newsletter/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedContent(data.content)
        toast({
          title: "Newsletter generated",
          description: "Your newsletter content has been generated successfully",
        })
      } else {
        toast({
          title: "Generation failed",
          description: data.error || "Failed to generate newsletter. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Newsletter generation error:", error)
      toast({
        title: "Generation failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSend = async () => {
    if (!generatedContent) {
      toast({
        title: "No content",
        description: "Please generate newsletter content first",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSending(true)

      const response = await fetch("/api/newsletter/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, sendEmail: true }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscriberCount(data.recipientCount)
        toast({
          title: "Newsletter sent",
          description: `Newsletter sent to ${data.recipientCount} subscribers`,
        })
      } else {
        toast({
          title: "Sending failed",
          description: data.error || "Failed to send newsletter. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Newsletter sending error:", error)
      toast({
        title: "Sending failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
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
                <Link href="/admin">Dashboard</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/users">Users</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/products">Products</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start bg-dark-700" asChild>
                <Link href="/admin/newsletter">
                  <Mail className="mr-2 h-5 w-5" />
                  Newsletter
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/forum">Forum</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/settings">Settings</Link>
              </Button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-white mb-8">Newsletter Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-dark-800 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-white">Subscribers</h3>
                </div>
                <p className="text-3xl font-bold text-white">1,245</p>
                <p className="text-sm text-gray-400 mt-1">+12% from last month</p>
              </div>

              <div className="bg-dark-800 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-white">Sent</h3>
                </div>
                <p className="text-3xl font-bold text-white">24</p>
                <p className="text-sm text-gray-400 mt-1">Newsletters this year</p>
              </div>

              <div className="bg-dark-800 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-white">Next Scheduled</h3>
                </div>
                <p className="text-xl font-bold text-white">Saturday, May 25</p>
                <p className="text-sm text-gray-400 mt-1">Weekly newsletter</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-dark-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Generate Newsletter</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-1">
                      Newsletter Topic
                    </label>
                    <Input
                      id="topic"
                      placeholder="e.g., Cryptocurrency trends, Stock market analysis"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      disabled={isGenerating}
                    />
                  </div>

                  <Button onClick={handleGenerate} disabled={isGenerating || !topic} className="w-full">
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>

                  {generatedContent && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-white">Preview</h3>
                        <Button onClick={handleSend} disabled={isSending} size="sm">
                          {isSending ? (
                            <>
                              <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-3 w-3" />
                              Send to Subscribers
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="bg-dark-700 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                        <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
                      </div>
                    </div>
                  )}

                  {subscriberCount > 0 && (
                    <div className="flex items-center gap-2 p-4 bg-green-900/20 border border-green-900 rounded-lg mt-4">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <p className="text-green-300">Newsletter sent successfully to {subscriberCount} subscribers!</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-dark-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Subscriber Management</h2>

                <div className="space-y-4">
                  <div className="relative">
                    <Input placeholder="Search subscribers..." className="pl-10" />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>

                  <div className="bg-dark-700 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-dark-600">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-600">
                        <tr>
                          <td className="px-4 py-3 text-sm text-white">john.doe@example.com</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">Active</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">May 10, 2023</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-white">jane.smith@example.com</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">Active</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">Apr 22, 2023</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-white">robert.johnson@example.com</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-900 text-yellow-300">
                              Pending
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">May 18, 2023</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-white">emily.davis@example.com</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-red-900 text-red-300">Unsubscribed</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">Mar 05, 2023</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400">Showing 4 of 1,245 subscribers</p>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
