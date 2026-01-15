import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Berkay Blog. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/tags" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tags
            </Link>
            <Link href="/rss.xml" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              RSS
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
