import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types'

interface AuthStore extends AuthState {
  token: string | null
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (credentials: RegisterCredentials) => Promise<boolean>
  logout: () => void
  hasRole: (role: 'USER' | 'ADMIN') => boolean
  isAdmin: () => boolean
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
        } catch (error) {
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
        } catch (error) {
          set({ isLoading: false })
          return false
        }
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
      
      hasRole: (role: 'ADMIN' | 'USER') => {
        const { user } = get()
        return user?.role === role
      },
      
      isAdmin: () => {
        const { user } = get()
        return user?.role === 'ADMIN'
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) return

        try {
          const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          
          if (response.ok) {
            const data = await response.json()
            set({ user: data.user, isAuthenticated: true })
          } else {
            set({ user: null, token: null, isAuthenticated: false })
          }
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false })
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)
