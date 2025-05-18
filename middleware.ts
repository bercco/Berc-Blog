import { clerkMiddleware } from "@clerk/nextjs/server"

// Export the Clerk middleware
export default clerkMiddleware()

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
