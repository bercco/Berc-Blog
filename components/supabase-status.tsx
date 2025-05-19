"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function SupabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const { toast } = useToast()

  const checkConnection = async () => {
    try {
      setIsChecking(true)

      // Try to query the Supabase database
      const { data, error } = await supabase.from("products").select("count").limit(1)

      if (error) {
        console.error("Supabase connection error:", error)
        setIsConnected(false)
        toast({
          title: "Connection Error",
          description: "Could not connect to Supabase. Check your environment variables.",
          variant: "destructive",
        })
      } else {
        setIsConnected(true)
        toast({
          title: "Connected to Supabase",
          description: "Successfully connected to your Supabase database.",
        })
      }
    } catch (error) {
      console.error("Error checking Supabase connection:", error)
      setIsConnected(false)
      toast({
        title: "Connection Error",
        description: "An error occurred while checking the Supabase connection.",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              isConnected === null ? "bg-gray-500" : isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span>
            {isConnected === null
              ? "Checking Supabase connection..."
              : isConnected
                ? "Connected to Supabase"
                : "Not connected to Supabase"}
          </span>
        </div>
        <Button size="sm" onClick={checkConnection} disabled={isChecking}>
          {isChecking ? "Checking..." : "Check Connection"}
        </Button>
      </div>
    </div>
  )
}
