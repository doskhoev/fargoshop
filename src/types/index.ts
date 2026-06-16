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

export type UserRole = 'USER' | 'ADMIN' | 'PICKER' | 'COURIER'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ASSEMBLING'
  | 'READY_FOR_DELIVERY'
  | 'IN_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'

export type PaymentMethod = 'CASH_ON_DELIVERY' | 'YUKASSA'

export type PaymentStatus = 'NOT_REQUIRED' | 'PENDING' | 'PAID' | 'FAILED'

export interface User {
  id: string
  email: string
  name: string
  phone?: string | null
  address?: string | null
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
  phone: string
  address?: string
}

export interface ProfileUpdate {
  name?: string
  email?: string
  phone?: string
  address?: string
  currentPassword?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product?: Product
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string | null
  phone: string
  address: string
  guestName?: string | null
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  total: number
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  user?: Pick<User, 'id' | 'name' | 'email' | 'phone'> | null
}

export interface CreateOrderPayload {
  items: { productId: string; quantity: number }[]
  phone: string
  address: string
  paymentMethod: PaymentMethod
  guestName?: string
}
