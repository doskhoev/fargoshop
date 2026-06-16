'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import OrderStatusBadge, { ORDER_STATUS_FLOW, getOrderStatusLabel } from '@/components/OrderStatusBadge'
import { useAuthStore } from '@/store/authStore'
import { useOrderStore } from '@/store/orderStore'
import { OrderStatus } from '@/types'

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const { isAuthenticated, checkAuth } = useAuthStore()
  const { currentOrder, fetchOrderById, isLoading } = useOrderStore()
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
    if (isMounted && isAuthenticated && orderId) {
      fetchOrderById(orderId)
    }
  }, [isMounted, isAuthenticated, orderId, fetchOrderById])

  const order = currentOrder

  const statusIndex = order ? ORDER_STATUS_FLOW.indexOf(order.status as OrderStatus) : -1

  return (
    <div>
      <Header onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <Link href="/orders" className="text-primary-500 hover:text-primary-600 text-sm mb-4 inline-block">
          ← Назад к заказам
        </Link>

        {isLoading || !order ? (
          <p className="text-secondary">Загрузка...</p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
                <p className="text-secondary mt-1">
                  {new Date(order.createdAt).toLocaleString('ru-RU')}
                </p>
              </div>
              <OrderStatusBadge status={order.status} className="text-sm" />
            </div>

            {order.status !== 'CANCELLED' && statusIndex >= 0 && (
              <div className="card p-6 mb-8">
                <h2 className="font-semibold mb-4">Статус заказа</h2>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUS_FLOW.map((status, index) => (
                    <div key={status} className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index <= statusIndex ? 'bg-primary-500' : 'bg-neutral-200'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          index <= statusIndex ? 'text-primary font-medium' : 'text-secondary'
                        }`}
                      >
                        {getOrderStatusLabel(status)}
                      </span>
                      {index < ORDER_STATUS_FLOW.length - 1 && (
                        <span className="text-neutral-300 mx-1">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold">Товары</h2>
                {order.items.map((item) => (
                  <div key={item.id} className="card p-4 flex gap-4">
                    {item.product?.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.name ?? 'Товар'}</p>
                      <p className="text-sm text-secondary">
                        {item.quantity} × {item.price} ₽
                      </p>
                    </div>
                    <p className="font-semibold">{item.quantity * item.price} ₽</p>
                  </div>
                ))}
              </div>

              <div className="card p-6 h-fit">
                <h2 className="font-semibold mb-4">Доставка</h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-secondary">Телефон: </span>
                    {order.phone}
                  </p>
                  <p>
                    <span className="text-secondary">Адрес: </span>
                    {order.address}
                  </p>
                  <p>
                    <span className="text-secondary">Оплата: </span>
                    {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'При получении' : 'ЮKassa'}
                  </p>
                  <hr className="my-4" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Итого</span>
                    <span>{order.total} ₽</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
