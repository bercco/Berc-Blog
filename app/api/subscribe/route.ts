import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from('subscribers').insert({
      email,
      is_active: true,
    })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Subscribe error:', error)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
