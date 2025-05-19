"use client"

import { SignUpButton, useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth/auth-modal"
import { motion } from "framer-motion"

export function AuthButtons() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return null
  }

  return (
    <div className="flex gap-2">
      <AuthModal />
      <SignUpButton mode="modal">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
          <Button size="sm">Sign Up</Button>
        </motion.div>
      </SignUpButton>
    </div>
  )
}
