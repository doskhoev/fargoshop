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

const STAFF_STATUS_FILTERS: Record<string, OrderStatus[]> = {
  PICKER: ['CONFIRMED', 'ASSEMBLING'],
  COURIER: ['READY_FOR_DELIVERY', 'IN_DELIVERY'],
  ADMIN: []
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireRoles(request, ['ADMIN', 'PICKER', 'COURIER'])
    if (authResult instanceof NextResponse) return authResult

    const statuses = STAFF_STATUS_FILTERS[authResult.role]
    const where = statuses.length > 0 ? { status: { in: statuses } } : {}

    const orders = await prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(orders.map(serializeOrder))
  } catch (error) {
    console.error('Get staff orders error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
