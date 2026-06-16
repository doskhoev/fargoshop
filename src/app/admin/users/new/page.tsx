'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAuthToken } from '@/store/authStore'

export default function AdminNewStaffPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PICKER' as 'PICKER' | 'COURIER'
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const token = getAuthToken()
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (response.ok) {
        router.push('/admin/users')
      } else {
        const data = await response.json()
        setError(data.error ?? 'Ошибка создания')
      }
    } catch {
      setError('Ошибка сети')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <Link href="/admin/users" className="text-primary-500 text-sm mb-4 inline-block">
        ← Назад к пользователям
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Создать сотрудника</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Имя</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Пароль</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl"
            minLength={6}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Роль</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as 'PICKER' | 'COURIER' })}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl"
          >
            <option value="PICKER">Сборщик</option>
            <option value="COURIER">Курьер</option>
          </select>
        </div>

        {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-3 disabled:opacity-50"
        >
          {isLoading ? 'Создание...' : 'Создать'}
        </button>
      </form>
    </div>
  )
}
