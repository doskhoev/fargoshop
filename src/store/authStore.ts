import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthState, LoginCredentials, RegisterCredentials, ProfileUpdate, ChangePasswordPayload, UserRole } from '@/types'

interface AuthStore extends AuthState {
  token: string | null
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (credentials: RegisterCredentials) => Promise<boolean>
  updateProfile: (data: ProfileUpdate) => Promise<{ success: boolean; error?: string }>
  changePassword: (data: ChangePasswordPayload) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  hasRole: (role: UserRole) => boolean
  isAdmin: () => boolean
  isPicker: () => boolean
  isCourier: () => boolean
  isStaff: () => boolean
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true })

        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          })

          const data = await response.json()

          if (response.ok) {
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false
            })
            return true
          } else {
            set({ isLoading: false })
            return false
          }
        } catch {
          set({ isLoading: false })
          return false
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true })

        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          })

          const data = await response.json()

          if (response.ok) {
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false
            })
            return true
          } else {
            set({ isLoading: false })
            return false
          }
        } catch {
          set({ isLoading: false })
          return false
        }
      },

      updateProfile: async (data: ProfileUpdate) => {
        const { token } = get()
        if (!token) return { success: false, error: 'Требуется авторизация' }

        try {
          const response = await fetch('/api/auth/profile', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
          })

          const result = await response.json()

          if (response.ok) {
            set({ user: result.user })
            return { success: true }
          }
          return { success: false, error: result.error ?? 'Ошибка обновления профиля' }
        } catch {
          return { success: false, error: 'Ошибка сети' }
        }
      },

      changePassword: async (data: ChangePasswordPayload) => {
        const { token } = get()
        if (!token) return { success: false, error: 'Требуется авторизация' }

        try {
          const response = await fetch('/api/auth/profile', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              currentPassword: data.currentPassword,
              newPassword: data.newPassword
            })
          })

          const result = await response.json()

          if (response.ok) {
            set({ user: result.user })
            return { success: true }
          }
          return { success: false, error: result.error ?? 'Ошибка смены пароля' }
        } catch {
          return { success: false, error: 'Ошибка сети' }
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      hasRole: (role: UserRole) => {
        const { user } = get()
        return user?.role === role
      },

      isAdmin: () => get().hasRole('ADMIN'),

      isPicker: () => get().hasRole('PICKER'),

      isCourier: () => get().hasRole('COURIER'),

      isStaff: () => {
        const { user } = get()
        return user?.role === 'ADMIN' || user?.role === 'PICKER' || user?.role === 'COURIER'
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) return

        try {
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          })

          if (response.ok) {
            const data = await response.json()
            set({ user: data.user, isAuthenticated: true })
          } else {
            set({ user: null, token: null, isAuthenticated: false })
          }
        } catch {
          set({ user: null, token: null, isAuthenticated: false })
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  const authStorage = localStorage.getItem('auth-storage')
  if (!authStorage) return null
  try {
    const authData = JSON.parse(authStorage)
    return authData?.state?.token ?? null
  } catch {
    return null
  }
}
