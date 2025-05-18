"use client"

import { useState } from "react"
import Link from "next/link"

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [seedLoading, setSeedLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [seedResult, setSeedResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [seedError, setSeedError] = useState<string | null>(null)

  const checkDatabase = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/db-check")
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("Failed to check database: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setLoading(false)
    }
  }

  const seedDatabase = async () => {
    setSeedLoading(true)
    setSeedError(null)

    try {
      const response = await fetch("/api/seed")
      const data = await response.json()
      setSeedResult(data)
    } catch (err) {
      setSeedError("Failed to seed database: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSeedLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Database Setup</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Check Database Connection</h2>
        <p className="mb-4">Click the button below to check your Supabase database connection and structure.</p>

        <button
          onClick={checkDatabase}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check Database"}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Seed Sample Data</h2>
        <p className="mb-4">
          Click the button below to add sample products to your database. Make sure you've run the SQL migration first.
        </p>

        <button
          onClick={seedDatabase}
          disabled={seedLoading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {seedLoading ? "Seeding..." : "Seed Database"}
        </button>

        {seedError && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            <p className="font-semibold">Error:</p>
            <p>{seedError}</p>
          </div>
        )}

        {seedResult && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">{JSON.stringify(seedResult, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>

        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <p className="font-medium">Run the SQL migration scripts in your Supabase SQL Editor</p>
            <p className="text-gray-600">
              Copy the SQL from the <code>supabase/migrations/001_initial_schema.sql</code> file and run it in your
              Supabase SQL Editor.
            </p>
          </li>
          <li>
            <p className="font-medium">Check the database structure</p>
            <p className="text-gray-600">
              Use the "Check Database" button above to verify that your tables were created correctly.
            </p>
          </li>
          <li>
            <p className="font-medium">Add sample data</p>
            <p className="text-gray-600">Use the "Seed Database" button to add sample products to your database.</p>
          </li>
        </ol>

        <div className="mt-6">
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
