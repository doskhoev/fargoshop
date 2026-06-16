'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

interface CartProviderProps {
  children: ReactNode
}

export default function CartProvider({ children }: CartProviderProps) {
  const { isAuthenticated, checkAuth } = useAuthStore()
  const { syncAfterAuth, resetLocalCart, setUseServerCart } = useCartStore()
  const wasAuthenticated = useRef(false)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isAuthenticated) {
      syncAfterAuth()
      wasAuthenticated.current = true
    } else if (wasAuthenticated.current) {
      setUseServerCart(false)
      resetLocalCart()
      wasAuthenticated.current = false
    }
  }, [isAuthenticated, syncAfterAuth, resetLocalCart, setUseServerCart])

  return <>{children}</>
}
