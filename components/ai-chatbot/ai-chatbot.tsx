"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react"
import { usePathname } from "next/navigation"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your AI assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Get page context when pathname changes
  useEffect(() => {
    if (isOpen) {
      const pageContext = getPageContext(pathname)
      if (pageContext) {
        setMessages([
          {
            role: "assistant",
            content: `Hi there! I'm your AI assistant. I see you're on the ${pageContext.pageName} page. How can I help you with ${pageContext.pageDescription}?`,
          },
        ])
      }
    }
  }, [pathname, isOpen])

  const getPageContext = (path: string) => {
    // Map paths to context information
    const pageContextMap: Record<string, { pageName: string; pageDescription: string }> = {
      "/": { pageName: "Home", pageDescription: "our products and services" },
      "/shop": { pageName: "Shop", pageDescription: "finding products or making purchases" },
      "/product": { pageName: "Product Detail", pageDescription: "this product or making a purchase" },
      "/forum": { pageName: "Forum", pageDescription: "discussions or finding information" },
      "/forum/thread": { pageName: "Forum Thread", pageDescription: "this discussion thread" },
      "/about": { pageName: "About", pageDescription: "information about our company" },
      "/contact": { pageName: "Contact", pageDescription: "getting in touch with us" },
      "/music": { pageName: "Music", pageDescription: "our music NFTs and collections" },
      "/checkout": { pageName: "Checkout", pageDescription: "completing your purchase" },
      "/admin": { pageName: "Admin", pageDescription: "managing your account" },
      "/profile": { pageName: "Profile", pageDescription: "your account settings" },
    }

    // Find the matching path
    for (const key in pageContextMap) {
      if (path.startsWith(key)) {
        return pageContextMap[key]
      }
    }

    // Default context
    return { pageName: "Current", pageDescription: "finding what you need" }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Get page context
      const pageContext = getPageContext(pathname)

      // In a real implementation, you would call the Gemini API here
      // For demo purposes, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a contextual response based on the user's question and current page
      const response = generateContextualResponse(input, pageContext)

      // Add assistant message
      const assistantMessage: Message = { role: "assistant", content: response }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I encountered an error. Please try again later." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Simple function to generate contextual responses based on keywords and current page
  const generateContextualResponse = (query: string, pageContext: { pageName: string; pageDescription: string }) => {
    const lowerQuery = query.toLowerCase()

    // Product related responses
    if (pathname.startsWith("/product") || pathname.startsWith("/shop")) {
      if (lowerQuery.includes("price") || lowerQuery.includes("cost")) {
        return "The price of this product is shown on the product page. We offer competitive pricing and occasional discounts for registered users."
      }
      if (lowerQuery.includes("shipping") || lowerQuery.includes("delivery")) {
        return "We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Shipping costs are calculated at checkout based on your location."
      }
      if (lowerQuery.includes("return") || lowerQuery.includes("refund")) {
        return "We have a 30-day return policy. If you're not satisfied with your purchase, you can return it within 30 days for a full refund."
      }
    }

    // Forum related responses
    if (pathname.startsWith("/forum")) {
      if (lowerQuery.includes("post") || lowerQuery.includes("thread")) {
        return "To create a new thread, click the 'New Thread' button at the top of the forum page. You'll need to be signed in to post."
      }
      if (lowerQuery.includes("comment") || lowerQuery.includes("reply")) {
        return "To reply to a thread or comment, use the reply form at the bottom of the thread or click the 'Reply' button on a specific comment."
      }
    }

    // Checkout related responses
    if (pathname.startsWith("/checkout")) {
      if (lowerQuery.includes("payment") || lowerQuery.includes("pay")) {
        return "We accept credit/debit cards and cryptocurrency payments. All transactions are secure and encrypted."
      }
      if (lowerQuery.includes("discount") || lowerQuery.includes("coupon")) {
        return "You can enter discount codes on the checkout page in the 'Discount Code' field before finalizing your purchase."
      }
    }

    // Generic responses based on common questions
    if (lowerQuery.includes("contact") || lowerQuery.includes("support")) {
      return "You can contact our support team through the Contact page or by emailing support@datafortress.com. We typically respond within 24 hours."
    }
    if (lowerQuery.includes("account") || lowerQuery.includes("login")) {
      return "You can create an account or log in using the buttons in the top-right corner of the page. We also support Web3 wallet connections."
    }

    // Default response with page context
    return `I'd be happy to help you with ${pageContext.pageDescription}. Could you provide more details about what you're looking for?`
  }

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-dark-800 rounded-lg shadow-xl flex flex-col z-50 border border-dark-600">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-600">
            <div className="flex items-center">
              <Bot className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="font-medium text-white">AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close chat">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-purple-600 text-white" : "bg-dark-700 text-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-dark-700 text-gray-200">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-dark-600">
            <div className="flex items-center">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-dark-700 border-dark-600 text-white resize-none min-h-[40px] max-h-[120px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="ml-2 bg-purple-600 hover:bg-purple-700"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
