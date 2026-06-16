'use client'

import { useEffect, useState } from 'react'
import { useOrderStore } from '@/store/orderStore'
import OrderStatusBadge, { getOrderStatusLabel } from '@/components/OrderStatusBadge'
import { OrderStatus } from '@/types'

const ALL_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'ASSEMBLING',
  'READY_FOR_DELIVERY',
  'IN_DELIVERY',
  'DELIVERED',
  'CANCELLED'
]

const ADMIN_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['ASSEMBLING', 'CANCELLED'],
  ASSEMBLING: ['READY_FOR_DELIVERY', 'CANCELLED'],
  READY_FOR_DELIVERY: ['IN_DELIVERY', 'CANCELLED'],
  IN_DELIVERY: ['DELIVERED', 'CANCELLED']
}

export default function AdminOrdersPage() {
  const { adminOrders, fetchAdminOrders, updateOrderStatus, isLoading } = useOrderStore()
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchAdminOrders(statusFilter || undefined)
  }, [statusFilter, fetchAdminOrders])

  const handleStatusChange = async (orderId: string, status: string) => {
    const success = await updateOrderStatus(orderId, status)
    if (success) fetchAdminOrders(statusFilter || undefined)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Все заказы</h1>

      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-xl"
        >
          <option value="">Все статусы</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {getOrderStatusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-secondary">Загрузка...</p>
      ) : adminOrders.length === 0 ? (
        <p className="text-secondary">Заказов нет</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left">
                <th className="py-3 pr-4">Номер</th>
                <th className="py-3 pr-4">Клиент</th>
                <th className="py-3 pr-4">Телефон</th>
                <th className="py-3 pr-4">Сумма</th>
                <th className="py-3 pr-4">Статус</th>
                <th className="py-3 pr-4">Дата</th>
                <th className="py-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {adminOrders.map((order) => {
                const transitions = ADMIN_TRANSITIONS[order.status] ?? []
                return (
                  <tr key={order.id} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 font-medium">{order.orderNumber}</td>
                    <td className="py-3 pr-4">
                      {order.user?.name ?? order.guestName ?? 'Гость'}
                    </td>
                    <td className="py-3 pr-4">{order.phone}</td>
                    <td className="py-3 pr-4">{order.total} ₽</td>
                    <td className="py-3 pr-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3 pr-4">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="py-3">
                      {transitions.length > 0 && (
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleStatusChange(order.id, e.target.value)
                              e.target.value = ''
                            }
                          }}
                          className="px-2 py-1 border border-neutral-300 rounded-lg text-xs"
                        >
                          <option value="">Изменить...</option>
                          {transitions.map((s) => (
                            <option key={s} value={s}>
                              {getOrderStatusLabel(s)}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
