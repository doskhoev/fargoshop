import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser } from '@/lib/api-auth'
import { serializeOrder } from '@/lib/orders'
import { isStaffRole } from '@/lib/api-auth'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUser(request)
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: orderInclude
    })

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 })
    }

    const isOwner = authUser && order.userId === authUser.id
    const isStaff = authUser && isStaffRole(authUser.role)

    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 })
    }

    return NextResponse.json(serializeOrder(order))
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
