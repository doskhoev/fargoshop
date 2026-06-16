import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: Role
  phone: string | null
  address: string | null
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  return authHeader?.split(' ')[1] ?? null
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const token = getTokenFromRequest(request)
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      address: true
    }
  })

  return user
}

export async function requireAuth(request: NextRequest): Promise<AuthUser | NextResponse> {
  const user = await getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }
  return user
}

export async function requireRoles(
  request: NextRequest,
  roles: Role[]
): Promise<AuthUser | NextResponse> {
  const result = await requireAuth(request)
  if (result instanceof NextResponse) return result

  if (!roles.includes(result.role)) {
    return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 })
  }

  return result
}

export function isRoleCheck(user: AuthUser, role: Role): boolean {
  return user.role === role
}

export function isStaffRole(role: Role): boolean {
  return role === 'ADMIN' || role === 'PICKER' || role === 'COURIER'
}
