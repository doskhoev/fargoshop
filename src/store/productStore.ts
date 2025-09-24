import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'
import { mockProducts } from '@/data/mockProducts'
import { useAuthStore } from './authStore'

interface ProductStore {
  products: Product[]
  isLoading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<boolean>
  updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<boolean>
  deleteProduct: (id: string) => Promise<boolean>
  getProductById: (id: string) => Product | undefined
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      isLoading: false,
      error: null,
      
      fetchProducts: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/products')
          if (response.ok) {
            const products = await response.json()
            set({ products, isLoading: false })
          } else {
            set({ error: 'Ошибка загрузки продуктов', isLoading: false })
          }
        } catch (error) {
          set({ error: 'Ошибка сети', isLoading: false })
        }
      },
      
      addProduct: async (productData: Omit<Product, 'id'>) => {
        const { token } = useAuthStore.getState()
        if (!token) return false

        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
          })
          
          if (response.ok) {
            const newProduct = await response.json()
            set(state => ({
              products: [...state.products, newProduct],
              isLoading: false
            }))
            return true
          } else {
            set({ error: 'Ошибка создания продукта', isLoading: false })
            return false
          }
        } catch (error) {
          set({ error: 'Ошибка сети', isLoading: false })
          return false
        }
      },
      
      updateProduct: async (id: string, productData: Omit<Product, 'id'>) => {
        const { token } = useAuthStore.getState()
        if (!token) return false

        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
          })
          
          if (response.ok) {
            const updatedProduct = await response.json()
            set(state => ({
              products: state.products.map(product =>
                product.id === id ? updatedProduct : product
              ),
              isLoading: false
            }))
            return true
          } else {
            set({ error: 'Ошибка обновления продукта', isLoading: false })
            return false
          }
        } catch (error) {
          set({ error: 'Ошибка сети', isLoading: false })
          return false
        }
      },
      
      deleteProduct: async (id: string) => {
        const { token } = useAuthStore.getState()
        if (!token) return false

        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            set(state => ({
              products: state.products.filter(product => product.id !== id),
              isLoading: false
            }))
            return true
          } else {
            set({ error: 'Ошибка удаления продукта', isLoading: false })
            return false
          }
        } catch (error) {
          set({ error: 'Ошибка сети', isLoading: false })
          return false
        }
      },
      
      getProductById: (id: string) => {
        return get().products.find(product => product.id === id)
      }
    }),
    {
      name: 'product-storage',
    }
  )
)
