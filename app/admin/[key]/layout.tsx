import type React from "react"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ key: string }>
}) {
  const { key } = await params
  const validKey = process.env.ADMIN_URL_KEY

  if (!validKey || key !== validKey) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
