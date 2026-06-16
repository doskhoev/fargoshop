'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAuthToken } from '@/store/authStore'
import { UserRole } from '@/types'

interface AdminUser {
  id: string
  email: string
  name: string
  phone: string | null
  address: string | null
  role: UserRole
  createdAt: string
  _count: { orders: number }
}

const ROLE_LABELS: Record<UserRole, string> = {
  USER: 'Пользователь',
  ADMIN: 'Администратор',
  PICKER: 'Сборщик',
  COURIER: 'Курьер'
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      const token = getAuthToken()
      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        setUsers(await response.json())
      }
      setIsLoading(false)
    }
    fetchUsers()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Пользователи</h1>
        <Link href="/admin/users/new" className="btn-primary text-sm">
          Создать сотрудника
        </Link>
      </div>

      {isLoading ? (
        <p className="text-secondary">Загрузка...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left">
                <th className="py-3 pr-4">Имя</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Телефон</th>
                <th className="py-3 pr-4">Роль</th>
                <th className="py-3 pr-4">Заказов</th>
                <th className="py-3">Регистрация</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-neutral-100">
                  <td className="py-3 pr-4 font-medium">{user.name}</td>
                  <td className="py-3 pr-4">{user.email}</td>
                  <td className="py-3 pr-4">{user.phone ?? '—'}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-1 bg-neutral-100 rounded-full text-xs">
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{user._count.orders}</td>
                  <td className="py-3">
                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
