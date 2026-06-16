import { create } from 'zustand'
import { Order, CreateOrderPayload } from '@/types'
import { getAuthToken } from './authStore'

interface OrderStore {
  orders: Order[]
  currentOrder: Order | null
  staffOrders: Order[]
  adminOrders: Order[]
  isLoading: boolean
  error: string | null
  fetchMyOrders: () => Promise<void>
  fetchOrderById: (id: string) => Promise<Order | null>
  createOrder: (payload: CreateOrderPayload) => Promise<Order | null>
  fetchStaffOrders: () => Promise<void>
  fetchAdminOrders: (status?: string) => Promise<void>
  updateOrderStatus: (id: string, status: string) => Promise<boolean>
}

function authHeaders(): HeadersInit {
  const token = getAuthToken()
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  currentOrder: null,
  staffOrders: [],
  adminOrders: [],
  isLoading: false,
  error: null,

  fetchMyOrders: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/orders', { headers: authHeaders() })
      if (response.ok) {
        const orders = await response.json()
        set({ orders, isLoading: false })
      } else {
        set({ error: 'Ошибка загрузки заказов', isLoading: false })
      }
    } catch {
      set({ error: 'Ошибка сети', isLoading: false })
    }
  },

  fetchOrderById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/orders/${id}`, { headers: authHeaders() })
      if (response.ok) {
        const order = await response.json()
        set({ currentOrder: order, isLoading: false })
        return order
      }
      set({ error: 'Заказ не найден', isLoading: false })
      return null
    } catch {
      set({ error: 'Ошибка сети', isLoading: false })
      return null
    }
  },

  createOrder: async (payload: CreateOrderPayload) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      })
      if (response.ok) {
        const order = await response.json()
        set({ isLoading: false })
        return order
      }
      const data = await response.json()
      set({ error: data.error ?? 'Ошибка создания заказа', isLoading: false })
      return null
    } catch {
      set({ error: 'Ошибка сети', isLoading: false })
      return null
    }
  },

  fetchStaffOrders: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/orders/staff', { headers: authHeaders() })
      if (response.ok) {
        const staffOrders = await response.json()
        set({ staffOrders, isLoading: false })
      } else {
        set({ error: 'Ошибка загрузки заказов', isLoading: false })
      }
    } catch {
      set({ error: 'Ошибка сети', isLoading: false })
    }
  },

  fetchAdminOrders: async (status?: string) => {
    set({ isLoading: true, error: null })
    try {
      const url = status ? `/api/admin/orders?status=${status}` : '/api/admin/orders'
      const response = await fetch(url, { headers: authHeaders() })
      if (response.ok) {
        const adminOrders = await response.json()
        set({ adminOrders, isLoading: false })
      } else {
        set({ error: 'Ошибка загрузки заказов', isLoading: false })
      }
    } catch {
      set({ error: 'Ошибка сети', isLoading: false })
    }
  },

  updateOrderStatus: async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status })
      })
      return response.ok
    } catch {
      return false
    }
  }
}))
