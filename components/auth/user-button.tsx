"use client"

import { UserButton as ClerkUserButton } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { User } from "lucide-react"

export function UserButton() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    return (
      <Link href="/sign-in">
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
          <User className="h-5 w-5 mr-1" />
          Sign In
        </Button>
      </Link>
    )
  }

  return (
    <ClerkUserButton
      appearance={{
        elements: {
          userButtonAvatarBox: "w-8 h-8",
          userButtonTrigger: "focus:outline-none focus:ring-0",
        },
      }}
    />
  )
}
