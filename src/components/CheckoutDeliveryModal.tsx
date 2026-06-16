'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface CheckoutDeliveryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { phone: string; address: string; guestName?: string }) => void
  initialPhone?: string
  initialAddress?: string
  initialName?: string
  isGuest?: boolean
}

export default function CheckoutDeliveryModal({
  isOpen,
  onClose,
  onSubmit,
  initialPhone = '',
  initialAddress = '',
  initialName = '',
  isGuest = false
}: CheckoutDeliveryModalProps) {
  const [phone, setPhone] = useState(initialPhone)
  const [address, setAddress] = useState(initialAddress)
  const [guestName, setGuestName] = useState(initialName)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setPhone(initialPhone)
      setAddress(initialAddress)
      setGuestName(initialName)
      setError('')
    }
  }, [isOpen, initialPhone, initialAddress, initialName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length < 10) {
      setError('Введите корректный номер телефона')
      return
    }
    if (address.length < 5) {
      setError('Введите полный адрес доставки')
      return
    }
    if (isGuest && guestName.length < 2) {
      setError('Введите ваше имя')
      return
    }
    onSubmit({
      phone,
      address,
      ...(isGuest && { guestName })
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-strong w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Доставка</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-neutral-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isGuest && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 bg-white rounded-xl text-base focus:border-primary-500 focus:ring-primary-200 transition-colors"
                    placeholder="Как к вам обращаться"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Телефон для связи
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 bg-white rounded-xl text-base focus:border-primary-500 focus:ring-primary-200 transition-colors"
                  placeholder="+7 (999) 123-45-67"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Адрес доставки
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 bg-white rounded-xl text-base focus:border-primary-500 focus:ring-primary-200 transition-colors resize-none"
                  placeholder="Город, улица, дом, квартира"
                  rows={3}
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</div>
              )}

              <button type="submit" className="w-full btn-primary py-3 text-base font-semibold">
                Продолжить к оплате
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
