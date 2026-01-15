"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@heroui/react"
import { Moon, Sun, Rss, Github } from "lucide-react"
import { useEffect, useState } from "react"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <nav className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">B</span>
          </div>
          <span className="font-semibold text-lg group-hover:text-primary transition-colors">Berkay Blog</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            as={Link}
            href="/tags"
            variant="light"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            Tags
          </Button>
          <Button
            as="a"
            href="/rss.xml"
            variant="light"
            size="sm"
            isIconOnly
            aria-label="RSS Feed"
            className="text-muted-foreground hover:text-foreground"
          >
            <Rss className="w-4 h-4" />
          </Button>
          <Button
            as="a"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
            size="sm"
            isIconOnly
            aria-label="GitHub"
            className="text-muted-foreground hover:text-foreground"
          >
            <Github className="w-4 h-4" />
          </Button>
          {mounted && (
            <Button
              variant="light"
              size="sm"
              isIconOnly
              aria-label="Toggle theme"
              onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}
