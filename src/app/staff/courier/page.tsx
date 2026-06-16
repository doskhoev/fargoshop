'use client'

import { useEffect } from 'react'
import RoleGuard from '@/components/RoleGuard'
import OrderStatusBadge, { getOrderStatusLabel } from '@/components/OrderStatusBadge'
import { useOrderStore } from '@/store/orderStore'
import { OrderStatus } from '@/types'

const COURIER_ACTIONS: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
  READY_FOR_DELIVERY: { label: 'Взять в доставку', next: 'IN_DELIVERY' },
  IN_DELIVERY: { label: 'Доставлен', next: 'DELIVERED' }
}

export default function CourierPage() {
  const { staffOrders, fetchStaffOrders, updateOrderStatus, isLoading } = useOrderStore()

  useEffect(() => {
    fetchStaffOrders()
  }, [fetchStaffOrders])

  const handleAction = async (orderId: string, status: OrderStatus) => {
    const success = await updateOrderStatus(orderId, status)
    if (success) fetchStaffOrders()
  }

  return (
    <RoleGuard allowedRoles={['COURIER', 'ADMIN']} title="Панель курьера">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Заказы к доставке</h1>

        {isLoading ? (
          <p className="text-secondary">Загрузка...</p>
        ) : staffOrders.length === 0 ? (
          <p className="text-secondary">Нет заказов для доставки</p>
        ) : (
          <div className="space-y-4">
            {staffOrders.map((order) => {
              const action = COURIER_ACTIONS[order.status]
              return (
                <div key={order.id} className="card p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-semibold text-lg">{order.orderNumber}</p>
                      <p className="text-sm text-secondary mt-1">
                        {order.user?.name ?? order.guestName ?? 'Гость'}
                      </p>
                      <p className="text-sm font-medium mt-2">{order.address}</p>
                      <p className="text-sm text-secondary">{order.phone}</p>
                      <p className="text-sm text-secondary mt-1">
                        {order.items.length} поз. · {order.total} ₽ ·{' '}
                        {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Оплата при получении' : 'ЮKassa'}
                      </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-3">
                      <OrderStatusBadge status={order.status} />
                      {action && (
                        <button
                          onClick={() => handleAction(order.id, action.next)}
                          className="btn-primary text-sm"
                        >
                          {action.label}
                        </button>
                      )}
                      {!action && (
                        <span className="text-sm text-secondary">
                          {getOrderStatusLabel(order.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </RoleGuard>
  )
}
