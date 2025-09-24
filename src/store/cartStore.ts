import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, CartItem, Product } from '@/types'

interface CartStore extends Cart {
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: string) => number
  calculateTotal: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      
      addItem: (product: Product) => {
        const items = get().items
        const existingItem = items.find(item => item.product.id === product.id)
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })
        } else {
          set({
            items: [...items, { product, quantity: 1 }]
          })
        }
        
        get().calculateTotal()
      },
      
      removeItem: (productId: string) => {
        set({
          items: get().items.filter(item => item.product.id !== productId)
        })
        get().calculateTotal()
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        })
        get().calculateTotal()
      },
      
      clearCart: () => {
        set({ items: [], total: 0 })
      },
      
      getItemQuantity: (productId: string) => {
        const item = get().items.find(item => item.product.id === productId)
        return item ? item.quantity : 0
      },
      
      calculateTotal: () => {
        const total = get().items.reduce(
          (sum, item) => sum + (item.product.price * item.quantity),
          0
        )
        set({ total })
      }
    }),
    {
      name: 'cart-storage',
    }
  )
)
