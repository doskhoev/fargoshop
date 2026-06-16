'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useAuthStore } from '@/store/authStore'
import { ProfileUpdate } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, checkAuth, updateProfile, changePassword } = useAuthStore()
  const [isMounted, setIsMounted] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: ''
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isProfileSaving, setIsProfileSaving] = useState(false)
  const [isPasswordSaving, setIsPasswordSaving] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push('/')
    }
  }, [isMounted, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        address: user.address ?? '',
        currentPassword: ''
      })
    }
  }, [user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError('')
    setProfileMessage('')
    setIsProfileSaving(true)

    const payload: ProfileUpdate = {
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      address: profileForm.address
    }

    if (profileForm.email !== user?.email && profileForm.currentPassword) {
      payload.currentPassword = profileForm.currentPassword
    }

    const result = await updateProfile(payload)
    setIsProfileSaving(false)

    if (result.success) {
      setProfileMessage('Профиль успешно обновлён')
      setProfileForm((prev) => ({ ...prev, currentPassword: '' }))
    } else {
      setProfileError(result.error ?? 'Ошибка сохранения')
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordMessage('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Пароли не совпадают')
      return
    }

    setIsPasswordSaving(true)
    const result = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
    setIsPasswordSaving(false)

    if (result.success) {
      setPasswordMessage('Пароль успешно изменён')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      setPasswordError(result.error ?? 'Ошибка смены пароля')
    }
  }

  if (!isMounted || !user) {
    return (
      <div>
        <Header onSearch={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <p className="text-secondary">Загрузка...</p>
        </div>
      </div>
    )
  }

  const emailChanged = profileForm.email !== user.email

  return (
    <div>
      <Header onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Мой профиль</h1>

        <form onSubmit={handleProfileSubmit} className="card p-6 space-y-4 mb-8">
          <h2 className="text-xl font-semibold mb-2">Личные данные</h2>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Имя</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Email</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl"
              required
            />
          </div>

          {emailChanged && (
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Текущий пароль (для смены email)
              </label>
              <input
                type="password"
                value={profileForm.currentPassword}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, currentPassword: e.target.value })
                }
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Телефон</label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Адрес доставки
            </label>
            <textarea
              value={profileForm.address}
              onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl resize-none"
              rows={3}
              placeholder="Город, улица, дом, квартира"
            />
          </div>

          {profileError && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{profileError}</div>
          )}
          {profileMessage && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-xl">
              {profileMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isProfileSaving}
            className="btn-primary py-3 px-6 disabled:opacity-50"
          >
            {isProfileSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>

        <form onSubmit={handlePasswordSubmit} className="card p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Сменить пароль</h2>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Текущий пароль
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Новый пароль</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Подтвердите пароль
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl"
              minLength={6}
              required
            />
          </div>

          {passwordError && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{passwordError}</div>
          )}
          {passwordMessage && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-xl">
              {passwordMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isPasswordSaving}
            className="btn-secondary py-3 px-6 disabled:opacity-50"
          >
            {isPasswordSaving ? 'Сохранение...' : 'Сменить пароль'}
          </button>
        </form>
      </div>
    </div>
  )
}
