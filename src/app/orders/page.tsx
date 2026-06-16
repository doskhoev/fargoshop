'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import OrderStatusBadge from '@/components/OrderStatusBadge'
import { useAuthStore } from '@/store/authStore'
import { useOrderStore } from '@/store/orderStore'

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()
  const { orders, fetchMyOrders, isLoading } = useOrderStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push('/')
    }
  }, [isMounted, isAuthenticated, router])

  useEffect(() => {
    if (isMounted && isAuthenticated) {
      fetchMyOrders()
    }
  }, [isMounted, isAuthenticated, fetchMyOrders])

  return (
    <div>
      <Header onSearch={setSearchQuery} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Мои заказы</h1>

        {isLoading ? (
          <p className="text-secondary">Загрузка...</p>
        ) : orders.length === 0 ? (
          <div className="text-center card p-8">
            <p className="text-secondary mb-4">У вас пока нет заказов</p>
            <Link href="/" className="btn-primary">
              Перейти к покупкам
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block card p-6 hover:shadow-medium transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="font-semibold text-primary">{order.orderNumber}</p>
                    <p className="text-sm text-secondary mt-1">
                      {new Date(order.createdAt).toLocaleString('ru-RU')}
                    </p>
                    <p className="text-sm text-secondary mt-1">
                      {order.items.length} поз. · {order.total} ₽
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
