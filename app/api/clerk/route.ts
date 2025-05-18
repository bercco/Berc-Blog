import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Example of using clerkClient to get users
    // In a real app, you'd want to add proper authorization checks
    const users = await clerkClient.users.getUserList({
      limit: 10,
    })

    return NextResponse.json({
      success: true,
      message: "Clerk is properly configured",
      userCount: users.length,
    })
  } catch (error) {
    console.error("Clerk API error:", error)
    return NextResponse.json({ success: false, error: "Failed to connect to Clerk" }, { status: 500 })
  }
}
