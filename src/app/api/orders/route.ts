import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser } from '@/lib/api-auth'
import { createOrderSchema } from '@/lib/validation'
import { generateOrderNumber, serializeOrder } from '@/lib/orders'
import { getPaymentProvider } from '@/lib/payments'
import { OrderStatus, PaymentStatus } from '@prisma/client'

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
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    if (authUser.role !== 'USER') {
      return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: authUser.id },
      include: orderInclude,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders.map(serializeOrder))
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const orderData = createOrderSchema.parse(body)
    const authUser = await getAuthUser(request)

    const productIds = orderData.items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'Некоторые товары не найдены' }, { status: 400 })
    }

    const productMap = new Map(products.map((p) => [p.id, p]))
    let total = 0

    for (const item of orderData.items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json({ error: 'Товар не найден' }, { status: 400 })
      }
      if (!product.inStock) {
        return NextResponse.json(
          { error: `Товар «${product.name}» отсутствует в наличии` },
          { status: 400 }
        )
      }
      total += Number(product.price) * item.quantity
    }

    if (orderData.paymentMethod === 'YUKASSA') {
      return NextResponse.json({ error: 'ЮKassa пока не подключена' }, { status: 400 })
    }

    const provider = getPaymentProvider(orderData.paymentMethod)
    const orderNumber = await generateOrderNumber()
    const paymentPreview = await provider.processOrder()

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId: authUser?.id ?? null,
          phone: orderData.phone,
          address: orderData.address,
          guestName: orderData.guestName ?? null,
          status: (paymentPreview.orderStatus as OrderStatus) ?? 'CONFIRMED',
          paymentMethod: orderData.paymentMethod,
          paymentStatus: paymentPreview.paymentStatus as PaymentStatus,
          total,
          items: {
            create: orderData.items.map((item) => {
              const product = productMap.get(item.productId)!
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
              }
            })
          }
        },
        include: orderInclude
      })

      if (authUser) {
        await tx.user.update({
          where: { id: authUser.id },
          data: {
            phone: orderData.phone,
            address: orderData.address
          }
        })

        await tx.cartItem.deleteMany({
          where: { userId: authUser.id }
        })
      }

      return created
    })

    return NextResponse.json(serializeOrder(order), { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
