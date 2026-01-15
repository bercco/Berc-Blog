import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Berkay Blog",
    template: "%s | Berkay Blog",
  },
  description: "Tech, systems, future. Production-ready insights.",
  keywords: ["blog", "tech", "web development", "AI", "systems"],
  authors: [{ name: "Berkay" }],
  creator: "Berkay",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://berkay.blog",
    siteName: "Berkay Blog",
    title: "Berkay Blog",
    description: "Tech, systems, future.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Berkay Blog",
    description: "Tech, systems, future.",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
