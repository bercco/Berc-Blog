import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-dark-900">
      <DashboardNav />
      <div className="flex-1 md:ml-64">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
