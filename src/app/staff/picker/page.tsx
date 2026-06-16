'use client'

import { useEffect } from 'react'
import RoleGuard from '@/components/RoleGuard'
import OrderStatusBadge, { getOrderStatusLabel } from '@/components/OrderStatusBadge'
import { useOrderStore } from '@/store/orderStore'
import { OrderStatus } from '@/types'

const PICKER_ACTIONS: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
  CONFIRMED: { label: 'Взять в сборку', next: 'ASSEMBLING' },
  ASSEMBLING: { label: 'Собран', next: 'READY_FOR_DELIVERY' }
}

export default function PickerPage() {
  const { staffOrders, fetchStaffOrders, updateOrderStatus, isLoading } = useOrderStore()

  useEffect(() => {
    fetchStaffOrders()
  }, [fetchStaffOrders])

  const handleAction = async (orderId: string, status: OrderStatus) => {
    const success = await updateOrderStatus(orderId, status)
    if (success) fetchStaffOrders()
  }

  return (
    <RoleGuard allowedRoles={['PICKER', 'ADMIN']} title="Панель сборщика">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Заказы на сборку</h1>

        {isLoading ? (
          <p className="text-secondary">Загрузка...</p>
        ) : staffOrders.length === 0 ? (
          <p className="text-secondary">Нет заказов для сборки</p>
        ) : (
          <div className="space-y-4">
            {staffOrders.map((order) => {
              const action = PICKER_ACTIONS[order.status]
              return (
                <div key={order.id} className="card p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-semibold text-lg">{order.orderNumber}</p>
                      <p className="text-sm text-secondary mt-1">
                        {order.address} · {order.phone}
                      </p>
                      <p className="text-sm text-secondary mt-1">
                        {order.items.length} поз. · {order.total} ₽
                      </p>
                      <ul className="mt-2 text-sm">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.product?.name} × {item.quantity}
                          </li>
                        ))}
                      </ul>
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
