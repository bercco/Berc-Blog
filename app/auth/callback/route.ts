import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const proto = request.headers.get('x-forwarded-proto')
      const host =
        forwardedHost && proto
          ? `${proto}://${forwardedHost}`
          : request.nextUrl.origin
      return NextResponse.redirect(`${host}${next}`)
    }
  }

  return NextResponse.redirect(`${request.nextUrl.origin}/auth/error`)
}
