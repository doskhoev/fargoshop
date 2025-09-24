'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import CartItem from '@/components/CartItem'
import Header from '@/components/Header'
import Link from 'next/link'

export default function CartPage() {
  const { items, total, clearCart } = useCartStore()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
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
              
              <button className="w-full btn-primary mb-4">
                Оформить заказ
              </button>
              
              <button 
                onClick={clearCart}
                className="w-full btn-secondary"
              >
                Очистить корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
