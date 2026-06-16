'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { PaymentMethod } from '@/types'

interface CheckoutPaymentStepProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (paymentMethod: PaymentMethod) => void
  total: number
  phone: string
  address: string
  onEditDelivery: () => void
  isLoading?: boolean
}

export default function CheckoutPaymentStep({
  isOpen,
  onClose,
  onConfirm,
  total,
  phone,
  address,
  onEditDelivery,
  isLoading = false
}: CheckoutPaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-strong w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Оплата</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-neutral-600" />
              </button>
            </div>

            <div className="bg-neutral-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Телефон:</span>
                <span className="font-medium">{phone}</span>
              </div>
              <div>
                <span className="text-secondary">Адрес:</span>
                <p className="font-medium mt-1">{address}</p>
              </div>
              <button
                type="button"
                onClick={onEditDelivery}
                className="text-primary-500 hover:text-primary-600 text-sm font-medium"
              >
                Изменить адрес
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-sm font-semibold text-primary">Способ оплаты</p>

              <label className="flex items-center gap-3 p-4 border-2 border-primary-500 bg-primary-50 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="CASH_ON_DELIVERY"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className="text-primary-500"
                />
                <div>
                  <p className="font-semibold text-primary">При получении</p>
                  <p className="text-sm text-secondary">Оплата курьеру при доставке</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl opacity-50 cursor-not-allowed">
                <input
                  type="radio"
                  name="payment"
                  value="YUKASSA"
                  disabled
                  className="text-primary-500"
                />
                <div>
                  <p className="font-semibold text-primary">ЮKassa</p>
                  <p className="text-sm text-secondary">Скоро</p>
                </div>
              </label>
            </div>

            <div className="flex justify-between items-center mb-6 text-lg font-semibold">
              <span>К оплате:</span>
              <span>{total} ₽</span>
            </div>

            <button
              onClick={() => onConfirm(paymentMethod)}
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Оформление...' : 'Подтвердить заказ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
