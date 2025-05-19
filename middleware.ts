import { clerkMiddleware, clerkClient, getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export default async function middleware(req: NextRequest) {
  // Check if the request is for the admin page
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const { userId } = getAuth(req)

    // If no user is logged in, redirect to the home page
    if (!userId) {
      return NextResponse.redirect(new URL("/?admin_login=true", req.url))
    }

    try {
      // Get the user's organization memberships
      const user = await clerkClient.users.getUser(userId)

      // Check if the user has the admin role in the Data Fortress Ltd. organization
      // This is a simplified check - in a real app, you would check organization memberships
      // and specific roles within those organizations
      const isAdmin =
        user.privateMetadata.role === "admin" ||
        user.emailAddresses.some((email) => email.emailAddress.endsWith("@datafortress.ltd"))

      if (!isAdmin) {
        // If the user is not an admin, redirect to the home page
        return NextResponse.redirect(new URL("/", req.url))
      }
    } catch (error) {
      console.error("Error checking admin status:", error)
      // If there's an error, redirect to the home page
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Continue with the Clerk middleware for other routes
  return clerkMiddleware()(req)
}

// Define a simpler matcher configuration without capturing groups
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    "/api/:path*",
  ],
}
