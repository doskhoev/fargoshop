'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import Login from './Login'
import Register from './Register'

export default function UserMenu() {
  const { user, isAuthenticated, logout, isAdmin } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Проверка монтирования компонента
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLoginClick = () => {
    setIsLoginOpen(true)
    setIsRegisterOpen(false)
    setIsMenuOpen(false)
  }

  const handleRegisterClick = () => {
    setIsRegisterOpen(true)
    setIsLoginOpen(false)
    setIsMenuOpen(false)
  }

  const handleCloseModals = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(false)
  }

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Кнопка пользователя */}
        <button
          onClick={handleMenuToggle}
          className="flex items-center space-x-1 xs:space-x-2 p-2 xs:p-3 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all duration-200"
        >
          <UserIcon className="h-5 w-5 xs:h-6 xs:w-6" />
          {isMounted && isAuthenticated && (
            <span className="hidden sm:block text-sm font-medium">
              {user?.name}
            </span>
          )}
          <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${
            isMenuOpen ? 'rotate-180' : ''
          }`} />
        </button>

        {/* Контекстное меню */}
        {isMounted && isMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-strong border border-neutral-200 py-2 z-50">
            {isAuthenticated ? (
              // Меню для авторизованного пользователя
              <div className="px-4 py-3">
                {/* Информация о пользователе */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-primary truncate">
                      {user?.name}
                    </p>
                    <p className="text-sm text-secondary truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Роль пользователя */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary">Роль:</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      isMounted && isAdmin() 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {isMounted && isAdmin() ? 'Администратор' : 'Пользователь'}
                    </span>
                  </div>
                  {isMounted && isAdmin() && (
                    <div className="mt-2 text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">
                      ✨ Доступ к редактированию товаров
                    </div>
                  )}
                </div>

                {/* Действия */}
                <div className="space-y-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 rounded-xl transition-colors"
                  >
                    Выйти из аккаунта
                  </button>
                </div>
              </div>
            ) : (
              // Меню для неавторизованного пользователя
              <div className="px-4 py-3">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserIcon className="h-6 w-6 text-neutral-400" />
                  </div>
                  <p className="text-sm text-secondary">
                    Войдите в аккаунт для доступа к персональным функциям
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleLoginClick}
                    className="w-full btn-primary py-2 text-sm font-semibold"
                  >
                    Войти
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="w-full px-3 py-2 text-sm text-primary-500 hover:bg-primary-50 rounded-xl transition-colors font-medium"
                  >
                    Зарегистрироваться
                  </button>
                </div>

              </div>
            )}
          </div>
        )}
      </div>

      {/* Модальные окна авторизации */}
      <Login 
        isOpen={isLoginOpen} 
        onClose={handleCloseModals} 
        onSwitchToRegister={handleRegisterClick}
      />
      <Register 
        isOpen={isRegisterOpen} 
        onClose={handleCloseModals} 
        onSwitchToLogin={handleLoginClick}
      />
    </>
  )
}
