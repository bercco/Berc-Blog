"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { SupabaseStatus } from "@/components/supabase-status"
import { Database, RefreshCw, Table, Plus } from "lucide-react"

export default function DatabaseAdminPage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isAddingSampleData, setIsAddingSampleData] = useState(false)
  const { toast } = useToast()

  const initializeSchema = async () => {
    try {
      setIsInitializing(true)

      const response = await fetch("/api/admin/init-schema", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to initialize schema")
      }

      toast({
        title: "Schema Initialized",
        description: "Database schema has been successfully initialized.",
      })
    } catch (error) {
      console.error("Error initializing schema:", error)
      toast({
        title: "Initialization Error",
        description: error instanceof Error ? error.message : "Failed to initialize schema",
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  const addSampleData = async () => {
    try {
      setIsAddingSampleData(true)

      const response = await fetch("/api/admin/sample-data", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to add sample data")
      }

      toast({
        title: "Sample Data Added",
        description: "Sample data has been successfully added to the database.",
      })
    } catch (error) {
      console.error("Error adding sample data:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add sample data",
        variant: "destructive",
      })
    } finally {
      setIsAddingSampleData(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <h1 className="text-3xl font-bold text-white mb-8">Database Management</h1>

      <SupabaseStatus />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-800 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Database className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-bold text-white">Initialize Schema</h2>
          </div>
          <p className="text-gray-400 mb-4">Create the necessary database tables and functions for the application.</p>
          <Button onClick={initializeSchema} disabled={isInitializing} className="w-full">
            {isInitializing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Table className="h-4 w-4 mr-2" />
                Initialize Schema
              </>
            )}
          </Button>
        </div>

        <div className="bg-dark-800 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Plus className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-xl font-bold text-white">Add Sample Data</h2>
          </div>
          <p className="text-gray-400 mb-4">Populate the database with sample products, reviews, and forum posts.</p>
          <Button onClick={addSampleData} disabled={isAddingSampleData} className="w-full">
            {isAddingSampleData ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Adding Data...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Sample Data
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
