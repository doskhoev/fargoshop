'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useOrderStore } from '@/store/orderStore'
import CartItem from '@/components/CartItem'
import Header from '@/components/Header'
import CheckoutDeliveryModal from '@/components/CheckoutDeliveryModal'
import CheckoutPaymentStep from '@/components/CheckoutPaymentStep'
import Link from 'next/link'
import { PaymentMethod } from '@/types'

export default function CartPage() {
  const { items, total, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const { createOrder, isLoading, error } = useOrderStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [deliveryData, setDeliveryData] = useState({
    phone: '',
    address: '',
    guestName: ''
  })
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCheckoutClick = () => {
    const needsDeliveryModal = !isAuthenticated || !user?.phone || !user?.address

    if (needsDeliveryModal) {
      setDeliveryData({
        phone: user?.phone ?? '',
        address: user?.address ?? '',
        guestName: user?.name ?? ''
      })
      setIsDeliveryModalOpen(true)
    } else {
      setDeliveryData({
        phone: user?.phone ?? '',
        address: user?.address ?? '',
        guestName: user?.name ?? ''
      })
      setIsPaymentModalOpen(true)
    }
  }

  const handleDeliverySubmit = (data: { phone: string; address: string; guestName?: string }) => {
    setDeliveryData({
      phone: data.phone,
      address: data.address,
      guestName: data.guestName ?? ''
    })
    setIsDeliveryModalOpen(false)
    setIsPaymentModalOpen(true)
  }

  const handleConfirmOrder = async (paymentMethod: PaymentMethod) => {
    const order = await createOrder({
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity
      })),
      phone: deliveryData.phone,
      address: deliveryData.address,
      paymentMethod,
      ...(deliveryData.guestName && !isAuthenticated && { guestName: deliveryData.guestName })
    })

    if (order) {
      await clearCart()
      setIsPaymentModalOpen(false)
      setCompletedOrderNumber(order.orderNumber)
    }
  }

  if (completedOrderNumber) {
    return (
      <div>
        <Header onSearch={handleSearch} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-lg mx-auto text-center card p-8">
            <div className="text-5xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Заказ оформлен!</h1>
            <p className="text-gray-600 mb-2">Номер вашего заказа:</p>
            <p className="text-2xl font-bold text-primary-600 mb-6">{completedOrderNumber}</p>
            <p className="text-secondary mb-8">
              {isAuthenticated
                ? 'Вы можете отслеживать статус в разделе «Мои заказы».'
                : 'Мы свяжемся с вами по указанному телефону.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isAuthenticated && (
                <Link href="/orders" className="btn-primary">
                  Мои заказы
                </Link>
              )}
              <Link href="/" className="btn-secondary">
                На главную
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div>
        <Header onSearch={handleSearch} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Корзина пуста</h1>
            <p className="text-gray-600 mb-8">Добавьте товары в корзину, чтобы оформить заказ</p>
            <Link href="/" className="btn-primary">
              Перейти к покупкам
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Корзина</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Итого</h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Товары ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>{total} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка</span>
                  <span>Бесплатно</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>К оплате</span>
                  <span>{total} ₽</span>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl mb-4">{error}</div>
              )}

              <button onClick={handleCheckoutClick} className="w-full btn-primary mb-4">
                Оформить заказ
              </button>

              <button onClick={() => void clearCart()} className="w-full btn-secondary">
                Очистить корзину
              </button>
            </div>
          </div>
        </div>
      </div>

      <CheckoutDeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onSubmit={handleDeliverySubmit}
        initialPhone={deliveryData.phone || user?.phone || ''}
        initialAddress={deliveryData.address || user?.address || ''}
        initialName={deliveryData.guestName || user?.name || ''}
        isGuest={!isAuthenticated}
      />

      <CheckoutPaymentStep
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handleConfirmOrder}
        total={total}
        phone={deliveryData.phone}
        address={deliveryData.address}
        onEditDelivery={() => {
          setIsPaymentModalOpen(false)
          setIsDeliveryModalOpen(true)
        }}
        isLoading={isLoading}
      />
    </div>
  )
}
