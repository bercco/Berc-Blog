"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, RefreshCw } from "lucide-react"
import { syncProductsWithShopify } from "@/app/actions/sync-products"

export function SyncProductsButton() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSync = async () => {
    try {
      setLoading(true)
      const result = await syncProductsWithShopify()

      if (result.success) {
        toast({
          title: "Products synced",
          description: result.message,
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Error syncing products:", error)
      toast({
        title: "Sync failed",
        description: "There was an error syncing products from Shopify. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleSync} disabled={loading} variant="outline" className="flex items-center gap-2">
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Syncing...
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4" />
          Sync with Shopify
        </>
      )}
    </Button>
  )
}
