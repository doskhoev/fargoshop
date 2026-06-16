'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'

interface HeaderProps {
  onSearch?: (query: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const { items, total } = useCartStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <header className="bg-white shadow-soft border-b border-neutral-200 sm:sticky sm:top-0 z-50">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 xs:h-18 sm:h-20 gap-2 xs:gap-4 sm:gap-6">
          <Link href="/" className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary-500 flex-shrink-0 hover:text-primary-600 transition-colors">
            FargoShop
          </Link>
          
          {/* Поиск - показывается только на больших экранах */}
          <div className="hidden lg:block flex-1 max-w-lg mx-8">
            {onSearch && <SearchBar onSearch={onSearch} />}
          </div>
          
           <nav className="hidden md:flex space-x-4 lg:space-x-8 flex-shrink-0">
             <Link href="/" className="text-sm lg:text-base text-neutral-700 hover:text-primary-500 font-medium transition-colors">
               Главная
             </Link>
             <Link href="/products" className="text-sm lg:text-base text-neutral-700 hover:text-primary-500 font-medium transition-colors">
               Каталог
             </Link>
             <Link href="/about" className="text-sm lg:text-base text-neutral-700 hover:text-primary-500 font-medium transition-colors">
               О нас
             </Link>
           </nav>
          
          <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Пользователь */}
            <UserMenu />
            
            {/* Корзина */}
            <Link href="/cart" className="relative p-2 xs:p-3 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all duration-200">
              <ShoppingCartIcon className="h-5 w-5 xs:h-6 xs:w-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-400 text-white text-xs font-bold rounded-full h-5 w-5 xs:h-6 xs:w-6 flex items-center justify-center shadow-medium">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </div>
        
        {/* Поиск для мобильных устройств */}
        <div className="lg:hidden pb-4 xs:pb-6">
          {onSearch && <SearchBar onSearch={onSearch} />}
        </div>
      </div>
    </header>
  )
}
