export interface Product {
  id: string
  name: string
  price: number
  image?: string
  description: string
  category: string
  inStock: boolean
  weight?: string
  expirationDate?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
}

// Типы для авторизации
export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
}
