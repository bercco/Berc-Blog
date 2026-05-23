import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Kimlik Doğrulama Hatası</h1>
        <p className="text-muted-foreground mb-6">
          Kimlik doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.
        </p>

        <Button asChild className="w-full">
          <Link href="/auth/login">Tekrar Giriş Yap</Link>
        </Button>
      </Card>
    </div>
  )
}
