'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import RoleGuard from '@/components/RoleGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin/orders', label: 'Заказы' },
    { href: '/admin/users', label: 'Пользователи' },
    { href: '/admin/users/new', label: 'Создать сотрудника' }
  ]

  return (
    <RoleGuard allowedRoles={['ADMIN']} title="Панель администратора">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex flex-wrap gap-2 mb-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </RoleGuard>
  )
}
