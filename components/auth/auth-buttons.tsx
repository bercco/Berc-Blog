"use client"

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function AuthButtons() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return null
  }

  return (
    <div className="flex gap-2">
      <SignInButton mode="modal">
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button size="sm">Sign Up</Button>
      </SignUpButton>
    </div>
  )
}
