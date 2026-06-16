import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, CartItem, Product } from '@/types'
import { getAuthToken } from './authStore'

interface CartStore extends Cart {
  isLoading: boolean
  useServerCart: boolean
  setUseServerCart: (value: boolean) => void
  fetchCart: () => Promise<void>
  mergeLocalCart: () => Promise<void>
  syncAfterAuth: () => Promise<void>
  addItem: (product: Product) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getItemQuantity: (productId: string) => number
  calculateTotal: () => void
  resetLocalCart: () => void
}

function authHeaders(): HeadersInit {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

function applyCartData(
  set: (partial: Partial<CartStore>) => void,
  data: { items: CartItem[]; total: number }
) {
  set({ items: data.items, total: data.total, isLoading: false })
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      isLoading: false,
      useServerCart: false,

      setUseServerCart: (value: boolean) => set({ useServerCart: value }),

      calculateTotal: () => {
        const total = get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
        set({ total })
      },

      resetLocalCart: () => set({ items: [], total: 0 }),

      fetchCart: async () => {
        const token = getAuthToken()
        if (!token) return

        set({ isLoading: true })
        try {
          const response = await fetch('/api/cart', { headers: authHeaders() })
          if (response.ok) {
            const data = await response.json()
            applyCartData(set, data)
          } else {
            set({ isLoading: false })
          }
        } catch {
          set({ isLoading: false })
        }
      },

      mergeLocalCart: async () => {
        const token = getAuthToken()
        if (!token) return

        const localItems = [...get().items]
        set({ isLoading: true })

        try {
          if (localItems.length > 0) {
            for (const item of localItems) {
              await fetch('/api/cart', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({
                  productId: item.product.id,
                  quantity: item.quantity
                })
              })
            }
          }
          await get().fetchCart()
        } catch {
          set({ isLoading: false })
        }
      },

      syncAfterAuth: async () => {
        await get().mergeLocalCart()
        set({ useServerCart: true })
      },

      addItem: async (product: Product) => {
        if (get().useServerCart && getAuthToken()) {
          set({ isLoading: true })
          try {
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: authHeaders(),
              body: JSON.stringify({ productId: product.id, quantity: 1 })
            })
            if (response.ok) {
              applyCartData(set, await response.json())
            } else {
              set({ isLoading: false })
            }
          } catch {
            set({ isLoading: false })
          }
          return
        }

        const items = get().items
        const existingItem = items.find((item) => item.product.id === product.id)

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })
        } else {
          set({ items: [...items, { product, quantity: 1 }] })
        }
        get().calculateTotal()
      },

      removeItem: async (productId: string) => {
        if (get().useServerCart && getAuthToken()) {
          set({ isLoading: true })
          try {
            const response = await fetch(`/api/cart?productId=${productId}`, {
              method: 'DELETE',
              headers: authHeaders()
            })
            if (response.ok) {
              applyCartData(set, await response.json())
            } else {
              set({ isLoading: false })
            }
          } catch {
            set({ isLoading: false })
          }
          return
        }

        set({ items: get().items.filter((item) => item.product.id !== productId) })
        get().calculateTotal()
      },

      updateQuantity: async (productId: string, quantity: number) => {
        if (quantity <= 0) {
          await get().removeItem(productId)
          return
        }

        if (get().useServerCart && getAuthToken()) {
          set({ isLoading: true })
          try {
            const response = await fetch('/api/cart', {
              method: 'PUT',
              headers: authHeaders(),
              body: JSON.stringify({ productId, quantity })
            })
            if (response.ok) {
              applyCartData(set, await response.json())
            } else {
              set({ isLoading: false })
            }
          } catch {
            set({ isLoading: false })
          }
          return
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        })
        get().calculateTotal()
      },

      clearCart: async () => {
        if (get().useServerCart && getAuthToken()) {
          set({ isLoading: true })
          try {
            const response = await fetch('/api/cart', {
              method: 'DELETE',
              headers: authHeaders()
            })
            if (response.ok) {
              applyCartData(set, await response.json())
            } else {
              set({ items: [], total: 0, isLoading: false })
            }
          } catch {
            set({ items: [], total: 0, isLoading: false })
          }
          return
        }

        set({ items: [], total: 0 })
      },

      getItemQuantity: (productId: string) => {
        const item = get().items.find((item) => item.product.id === productId)
        return item ? item.quantity : 0
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.useServerCart ? [] : state.items,
        total: state.useServerCart ? 0 : state.total,
        useServerCart: state.useServerCart
      })
    }
  )
)
