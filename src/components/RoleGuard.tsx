'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/types'
import Header from '@/components/Header'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: ReactNode
  title?: string
}

export default function RoleGuard({ allowedRoles, children, title }: RoleGuardProps) {
  const router = useRouter()
  const { user, isAuthenticated, checkAuth } = useAuthStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push('/')
    } else if (isMounted && user && !allowedRoles.includes(user.role)) {
      router.push('/')
    }
  }, [isMounted, isAuthenticated, user, allowedRoles, router])

  if (!isMounted || !user || !allowedRoles.includes(user.role)) {
    return (
      <div>
        <Header onSearch={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <p className="text-secondary">Проверка доступа...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header onSearch={() => {}} />
      {title && (
        <div className="bg-neutral-50 border-b border-neutral-200">
          <div className="container mx-auto px-4 py-3">
            <p className="text-sm text-secondary">{title}</p>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
