import { OrderStatus } from '@/types'

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Ожидает подтверждения',
  CONFIRMED: 'Подтверждён',
  ASSEMBLING: 'Собирается',
  READY_FOR_DELIVERY: 'Готов к доставке',
  IN_DELIVERY: 'В доставке',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён'
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  ASSEMBLING: 'bg-indigo-100 text-indigo-800',
  READY_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
  IN_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

export function getOrderStatusLabel(status: OrderStatus): string {
  return STATUS_LABELS[status] ?? status
}

export default function OrderStatusBadge({ status, className = '' }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status]} ${className}`}
    >
      {getOrderStatusLabel(status)}
    </span>
  )
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'ASSEMBLING',
  'READY_FOR_DELIVERY',
  'IN_DELIVERY',
  'DELIVERED'
]
