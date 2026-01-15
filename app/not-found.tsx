import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Sayfa Bulunamadı</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Button asChild>
        <Link href="/">
          <Home className="w-4 h-4 mr-2" />
          Ana Sayfaya Dön
        </Link>
      </Button>
    </div>
  )
}
