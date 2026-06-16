import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'
import { addCartItemSchema, updateCartItemSchema } from '@/lib/validation'
import { buildCartResponse } from '@/lib/cart'

const productInclude = {
  product: true
} as const

async function getCartForUser(userId: string) {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: productInclude,
    orderBy: { createdAt: 'asc' }
  })

  return buildCartResponse(
    cartItems.map((item) => ({
      product: item.product,
      quantity: item.quantity
    }))
  )
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult

    const cart = await getCartForUser(authResult.id)
    return NextResponse.json(cart)
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult

    const body = await request.json()
    const { productId, quantity } = addCartItemSchema.parse(body)

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
    }
    if (!product.inStock) {
      return NextResponse.json({ error: 'Товар отсутствует в наличии' }, { status: 400 })
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: authResult.id, productId } }
    })

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity }
      })
    } else {
      await prisma.cartItem.create({
        data: { userId: authResult.id, productId, quantity }
      })
    }

    const cart = await getCartForUser(authResult.id)
    return NextResponse.json(cart)
  } catch (error) {
    console.error('Add cart item error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult

    const body = await request.json()
    const { productId, quantity } = updateCartItemSchema.parse(body)

    if (quantity === 0) {
      await prisma.cartItem.deleteMany({
        where: { userId: authResult.id, productId }
      })
    } else {
      const product = await prisma.product.findUnique({ where: { id: productId } })
      if (!product) {
        return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
      }

      await prisma.cartItem.upsert({
        where: { userId_productId: { userId: authResult.id, productId } },
        create: { userId: authResult.id, productId, quantity },
        update: { quantity }
      })
    }

    const cart = await getCartForUser(authResult.id)
    return NextResponse.json(cart)
  } catch (error) {
    console.error('Update cart item error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (productId) {
      await prisma.cartItem.deleteMany({
        where: { userId: authResult.id, productId }
      })
    } else {
      await prisma.cartItem.deleteMany({
        where: { userId: authResult.id }
      })
    }

    const cart = await getCartForUser(authResult.id)
    return NextResponse.json(cart)
  } catch (error) {
    console.error('Delete cart error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
