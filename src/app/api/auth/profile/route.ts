import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'
import { profileUpdateSchema, changePasswordSchema } from '@/lib/validation'
import { hashPassword, verifyPassword } from '@/lib/auth'

const userSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  address: true,
  role: true,
  createdAt: true,
  updatedAt: true
} as const

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult

    const body = await request.json()

    if (body.currentPassword !== undefined && body.newPassword !== undefined) {
      const { currentPassword, newPassword } = changePasswordSchema.parse({
        currentPassword: body.currentPassword,
        newPassword: body.newPassword
      })

      const dbUser = await prisma.user.findUnique({ where: { id: authResult.id } })
      if (!dbUser || !(await verifyPassword(currentPassword, dbUser.password))) {
        return NextResponse.json({ error: 'Неверный текущий пароль' }, { status: 400 })
      }

      const user = await prisma.user.update({
        where: { id: authResult.id },
        data: { password: await hashPassword(newPassword) },
        select: userSelect
      })

      return NextResponse.json({ user })
    }

    const data = profileUpdateSchema.parse(body)

    if (data.email && data.email !== authResult.email) {
      if (!data.currentPassword) {
        return NextResponse.json(
          { error: 'Для смены email укажите текущий пароль' },
          { status: 400 }
        )
      }

      const dbUser = await prisma.user.findUnique({ where: { id: authResult.id } })
      if (!dbUser || !(await verifyPassword(data.currentPassword, dbUser.password))) {
        return NextResponse.json({ error: 'Неверный текущий пароль' }, { status: 400 })
      }

      const existing = await prisma.user.findUnique({ where: { email: data.email } })
      if (existing && existing.id !== authResult.id) {
        return NextResponse.json(
          { error: 'Пользователь с таким email уже существует' },
          { status: 409 }
        )
      }
    }

    const user = await prisma.user.update({
      where: { id: authResult.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.address !== undefined && { address: data.address || null })
      },
      select: userSelect
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
