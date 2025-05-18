"use client"

import { useState, useEffect } from "react"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, User } from "lucide-react"
import Image from "next/image"
import type { Database } from "@/lib/supabase/types"

type Profile = Database["public"]["Tables"]["user_profiles"]["Row"]

export function UserProfile() {
  const { user } = useSupabaseAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return

      try {
        setLoading(true)

        const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

        if (error) throw error

        setProfile(data)
        setFullName(data.full_name || "")
        setAvatarUrl(data.avatar_url || "")
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handleUpdateProfile = async () => {
    if (!user) return

    try {
      setUpdating(true)

      const { error } = await supabase
        .from("user_profiles")
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      // Update the profile state
      setProfile({
        ...profile!,
        full_name: fullName,
        avatar_url: avatarUrl,
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="rounded-lg bg-red-900/20 p-4 text-center text-red-400">
        Error loading profile. Please try again.
      </div>
    )
  }

  return (
    <Card className="bg-dark-800">
      <CardHeader>
        <CardTitle className="text-white">Your Profile</CardTitle>
        <CardDescription className="text-gray-400">Update your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-dark-700">
            {avatarUrl ? (
              <Image src={avatarUrl || "/placeholder.svg"} alt={fullName || "User"} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="bg-dark-700"
            />
            <p className="mt-1 text-xs text-gray-400">Enter a URL for your profile picture</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={profile.email} disabled className="bg-dark-700 text-gray-400" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="bg-dark-700"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdateProfile} disabled={updating}>
          {updating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
