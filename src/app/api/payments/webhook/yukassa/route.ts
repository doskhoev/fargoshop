import { NextRequest, NextResponse } from 'next/server'
import { yukassaProvider } from '@/lib/payments/yukassa'

// TODO: Implement YooKassa webhook when payment integration is enabled
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const result = await yukassaProvider.handleWebhook?.(payload)

    if (!result?.success) {
      return NextResponse.json({ error: result?.error ?? 'Not implemented' }, { status: 501 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Yukassa webhook error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
