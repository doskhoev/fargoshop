import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireRoles } from '@/lib/api-auth'
import { updateOrderStatusSchema } from '@/lib/validation'
import { canTransitionStatus, serializeOrder } from '@/lib/orders'
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireRoles(request, ['ADMIN', 'PICKER', 'COURIER'])
    if (authResult instanceof NextResponse) return authResult

    const body = await request.json()
    const { status } = updateOrderStatusSchema.parse(body)

    const order = await prisma.order.findUnique({
      where: { id: params.id }
    })

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 })
    }

    if (!canTransitionStatus(authResult.role, order.status, status as OrderStatus)) {
      return NextResponse.json(
        { error: `Нельзя изменить статус с «${order.status}» на «${status}»` },
        { status: 400 }
      )
    }

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: { status: status as OrderStatus },
      include: orderInclude
    })

    return NextResponse.json(serializeOrder(updated))
  } catch (error) {
    console.error('Update order status error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
