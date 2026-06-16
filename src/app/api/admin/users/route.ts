import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireRoles } from '@/lib/api-auth'
import { hashPassword } from '@/lib/auth'
import { createStaffUserSchema } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireRoles(request, ['ADMIN'])
    if (authResult instanceof NextResponse) return authResult

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { orders: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRoles(request, ['ADMIN'])
    if (authResult instanceof NextResponse) return authResult

    const body = await request.json()
    const { email, password, name, role } = createStaffUserSchema.parse(body)

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Create staff user error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
