import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireRoles } from '@/lib/api-auth'
import { serializeOrder } from '@/lib/orders'
import { OrderStatus } from '@prisma/client'

const orderInclude = {
  items: {
    include: {
      product: true
    }
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true
    }
  }
} as const

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireRoles(request, ['ADMIN'])
    if (authResult instanceof NextResponse) return authResult

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as OrderStatus | null

    const where = status ? { status } : {}

    const orders = await prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders.map(serializeOrder))
  } catch (error) {
    console.error('Get admin orders error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
