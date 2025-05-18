"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface SplitLayoutProps {
  children: React.ReactNode
}

export function SplitLayout({ children }: SplitLayoutProps) {
  const [activeSection, setActiveSection] = useState<"marketplace" | "forum">("marketplace")

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Navigation Tabs */}
      <div className="flex w-full bg-dark-900 border-b border-dark-700">
        <button
          onClick={() => setActiveSection("marketplace")}
          className={`flex-1 py-4 text-center font-medium text-lg transition-colors ${
            activeSection === "marketplace" ? "text-white border-b-2 border-white" : "text-gray-400"
          }`}
        >
          Marketplace
        </button>
        <button
          onClick={() => setActiveSection("forum")}
          className={`flex-1 py-4 text-center font-medium text-lg transition-colors ${
            activeSection === "forum" ? "text-white border-b-2 border-white" : "text-gray-400"
          }`}
        >
          Trading Forum
        </button>
      </div>

      {/* Content Area */}
      <div className="relative flex-grow overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ x: activeSection === "marketplace" ? 0 : "100%" }}
          animate={{ x: activeSection === "marketplace" ? 0 : "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="h-full overflow-y-auto">
            {/* Marketplace Content */}
            {children}
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ x: activeSection === "forum" ? 0 : "100%" }}
          animate={{ x: activeSection === "forum" ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="h-full overflow-y-auto">
            {/* Forum Content */}
            <div className="pt-16">
              <Link href="/forum" className="block w-full text-center py-8 bg-dark-800">
                <span className="text-xl font-bold text-white flex items-center justify-center">
                  Go to Trading Forum <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
