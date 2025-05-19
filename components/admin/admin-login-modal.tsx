"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { SignIn } from "@clerk/nextjs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { motion } from "framer-motion"

export function AdminLoginModal() {
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if the admin_login query parameter is present
    const adminLogin = searchParams.get("admin_login")
    if (adminLogin === "true") {
      setIsOpen(true)
    }
  }, [searchParams])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none shadow-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-dark-800 rounded-xl overflow-hidden border border-dark-600"
        >
          <div className="p-4 border-b border-dark-600">
            <h2 className="text-xl font-bold text-white">Admin Login</h2>
            <p className="text-gray-400 text-sm">
              Please sign in with your admin credentials to access the admin panel.
            </p>
          </div>
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-transparent shadow-none",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-400",
                formButtonPrimary: "bg-white text-black hover:bg-gray-200",
                formFieldInput: "bg-dark-700 border-dark-600 text-white",
                formFieldLabel: "text-gray-300",
                footerActionLink: "text-white hover:text-gray-300",
              },
            }}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
