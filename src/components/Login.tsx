'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface LoginProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export default function Login({ isOpen, onClose, onSwitchToRegister }: LoginProps) {
  const { login, isLoading } = useAuthStore()
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const success = await login(credentials)
    if (success) {
      onClose()
      setCredentials({ email: '', password: '' })
    } else {
      setError('Неверный email или пароль')
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
              <h2 className="text-2xl font-bold text-primary">Вход</h2>
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
                  Пароль
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 bg-white rounded-xl text-base focus:border-primary-500 focus:ring-primary-200 transition-colors"
                  placeholder="Введите пароль"
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
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-secondary">
                Нет аккаунта?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                >
                  Зарегистрироваться
                </button>
              </p>
            </div>

            <div className="mt-4 p-3 bg-neutral-50 rounded-xl">
              <p className="text-xs text-neutral-600 mb-2">Тестовые аккаунты:</p>
              <div className="text-xs space-y-1.5 text-neutral-700">
                <div>
                  <strong>Админ:</strong> admin@fargoshop.ru / admin123
                  <span className="text-neutral-500"> — товары, заказы, пользователи</span>
                </div>
                <div>
                  <strong>Пользователь:</strong> user@fargoshop.ru / user123
                  <span className="text-neutral-500"> — покупки, мои заказы</span>
                </div>
                <div>
                  <strong>Сборщик:</strong> picker@fargoshop.ru / picker123
                  <span className="text-neutral-500"> — панель сборки</span>
                </div>
                <div>
                  <strong>Курьер:</strong> courier@fargoshop.ru / courier123
                  <span className="text-neutral-500"> — панель доставки</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
