import { OrderStatus, Role } from '@prisma/client'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Ожидает подтверждения',
  CONFIRMED: 'Подтверждён',
  ASSEMBLING: 'Собирается',
  READY_FOR_DELIVERY: 'Готов к доставке',
  IN_DELIVERY: 'В доставке',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён'
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  ASSEMBLING: 'bg-indigo-100 text-indigo-800',
  READY_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
  IN_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

export const ROLE_LABELS: Record<Role, string> = {
  USER: 'Пользователь',
  ADMIN: 'Администратор',
  PICKER: 'Сборщик',
  COURIER: 'Курьер'
}

const STATUS_TRANSITIONS: Record<Role, Partial<Record<OrderStatus, OrderStatus[]>>> = {
  PICKER: {
    CONFIRMED: ['ASSEMBLING'],
    ASSEMBLING: ['READY_FOR_DELIVERY']
  },
  COURIER: {
    READY_FOR_DELIVERY: ['IN_DELIVERY'],
    IN_DELIVERY: ['DELIVERED']
  },
  ADMIN: {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['ASSEMBLING', 'CANCELLED'],
    ASSEMBLING: ['READY_FOR_DELIVERY', 'CANCELLED'],
    READY_FOR_DELIVERY: ['IN_DELIVERY', 'CANCELLED'],
    IN_DELIVERY: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [],
    CANCELLED: []
  },
  USER: {}
}

export function canTransitionStatus(
  role: Role,
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {
  if (role === 'ADMIN') {
    const allowed = STATUS_TRANSITIONS.ADMIN[currentStatus] ?? []
    return allowed.includes(newStatus)
  }

  const roleTransitions = STATUS_TRANSITIONS[role]
  const allowed = roleTransitions?.[currentStatus] ?? []
  return allowed.includes(newStatus)
}

export async function generateOrderNumber(): Promise<string> {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const prefix = `FS-${dateStr}`

  const { prisma } = await import('@/lib/db')
  const count = await prisma.order.count({
    where: {
      orderNumber: { startsWith: prefix }
    }
  })

  const seq = String(count + 1).padStart(4, '0')
  return `${prefix}-${seq}`
}

export function serializeOrder(order: {
  id: string
  orderNumber: string
  userId: string | null
  phone: string
  address: string
  guestName: string | null
  status: OrderStatus
  paymentMethod: string
  paymentStatus: string
  total: { toString(): string } | number
  createdAt: Date
  updatedAt: Date
  items: Array<{
    id: string
    productId: string
    quantity: number
    price: { toString(): string } | number
    product?: {
      id: string
      name: string
      price: { toString(): string } | number
      image: string | null
      description: string
      category: string
      inStock: boolean
      weight: string | null
      expirationDate: Date | null
    } | null
  }>
  user?: {
    id: string
    name: string
    email: string
    phone: string | null
  } | null
}) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    userId: order.userId,
    phone: order.phone,
    address: order.address,
    guestName: order.guestName,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    user: order.user ?? null,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      price: Number(item.price),
      product: item.product
        ? {
            id: item.product.id,
            name: item.product.name,
            price: Number(item.product.price),
            image: item.product.image ?? undefined,
            description: item.product.description,
            category: item.product.category,
            inStock: item.product.inStock,
            weight: item.product.weight ?? undefined,
            expirationDate: item.product.expirationDate?.toISOString()
          }
        : undefined
    }))
  }
}
