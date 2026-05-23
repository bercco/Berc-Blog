import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Kayıt Başarılı!</h1>
        <p className="text-muted-foreground mb-6">
          E-posta adresinizi doğrulamak için bir bağlantı gönderildi. E-postanızı kontrol edin.
        </p>

        <Button asChild className="w-full">
          <Link href="/auth/login">Giriş Sayfasına Dön</Link>
        </Button>
      </Card>
    </div>
  )
}
