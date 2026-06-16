'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface RegisterProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export default function Register({ isOpen, onClose, onSwitchToLogin }: RegisterProps) {
  const { register, isLoading } = useAuthStore()
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (credentials.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }

    if (credentials.phone.length < 10) {
      setError('Введите корректный номер телефона')
      return
    }
    
    const success = await register(credentials)
    if (success) {
      onClose()
      setCredentials({ email: '', password: '', name: '', phone: '', address: '' })
    } else {
      setError('Ошибка регистрации')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-strong w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Регистрация</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-neutral-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  value={credentials.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 bg-white rounded-xl text-base focus:border-primary-500 focus:ring-primary-200 transition-colors"
                  placeholder="Введите ваше имя"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 bg-white rounded-xl text-base focus:border-primary-500 focus:ring-primary-200 transition-colors"
                  placeholder="Введите email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={credentials.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 bg-white rounded-xl text-base focus:border-primary-500 focus:ring-primary-200 transition-colors"
                  placeholder="+7 (999) 123-45-67"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Адрес доставки <span className="text-secondary font-normal">(необязательно)</span>
                </label>
                <textarea
                  value={credentials.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 bg-white rounded-xl text-base focus:border-primary-500 focus:ring-primary-200 transition-colors resize-none"
                  placeholder="Город, улица, дом, квартира"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Пароль
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 bg-white rounded-xl text-base focus:border-primary-500 focus:ring-primary-200 transition-colors"
                  placeholder="Минимум 6 символов"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-secondary">
                Уже есть аккаунт?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                >
                  Войти
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
