"use client"

import { useState } from "react"
import { SignIn } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@clerk/nextjs"

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="relative overflow-hidden group">
          <span className="relative z-10">Sign In</span>
          <motion.div
            className="absolute inset-0 bg-white bg-opacity-10"
            initial={{ x: "-100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </Button>
      </DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="sm:max-w-md p-0 bg-transparent border-none shadow-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-dark-800 rounded-xl overflow-hidden border border-dark-600"
            >
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
        )}
      </AnimatePresence>
    </Dialog>
  )
}
