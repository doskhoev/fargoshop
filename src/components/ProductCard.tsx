'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useProductStore } from '@/store/productStore'
import { PlusIcon, MinusIcon, ShoppingCartIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface ProductCardProps {
  product: Product
  onCategoryClick?: (category: string) => void
  selectedCategories?: string[]
  onEditProduct?: (product: Product) => void
  onDeleteProduct?: (productId: string, productName: string) => void
}

export default function ProductCard({ product, onCategoryClick, selectedCategories = [], onEditProduct, onDeleteProduct }: ProductCardProps) {
  const { addItem, removeItem, updateQuantity, getItemQuantity } = useCartStore()
  const { isAdmin } = useAuthStore()
  const [isMounted, setIsMounted] = useState(false)
  const quantity = getItemQuantity(product.id)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAdd = () => {
    void addItem(product)
  }

  const handleRemove = () => {
    if (quantity === 1) {
      void removeItem(product.id)
    } else {
      void updateQuantity(product.id, quantity - 1)
    }
  }

  const handleEdit = () => {
    onEditProduct?.(product)
  }

  const handleDelete = () => {
    onDeleteProduct?.(product.id, product.name)
  }

  return (
    <div className="card-hover p-4 xs:p-6 group relative">
      {/* Админ-кнопки */}
      {isMounted && isAdmin() && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={handleEdit}
            className="p-1.5 bg-white/90 hover:bg-white text-primary-600 hover:text-primary-700 rounded-lg shadow-soft transition-colors"
            title="Редактировать товар"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 bg-white/90 hover:bg-white text-red-600 hover:text-red-700 rounded-lg shadow-soft transition-colors"
            title="Удалить товар"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl mb-4 xs:mb-6 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Если изображение не загрузилось, показываем заглушку
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <span className={`text-neutral-400 text-xs xs:text-sm font-medium ${product.image ? 'hidden' : ''}`}>
          Изображение
        </span>
      </div>
      
      <div className="space-y-3 xs:space-y-4">
        <div>
          <h3 
            className="font-bold text-lg xs:text-xl text-primary mb-1 xs:mb-2 group-hover:text-primary-600 transition-colors truncate"
            title={product.name}
          >
            {product.name}
          </h3>
          <p 
            className="text-secondary text-xs xs:text-sm leading-relaxed line-clamp-2 h-8 xs:h-10"
            title={product.description}
          >
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl xs:text-3xl font-bold text-primary-500">
            {product.price} ₽
          </span>
          {product.weight && (
            <span className="text-xs xs:text-sm text-muted bg-neutral-100 px-2 xs:px-3 py-1 rounded-full">
              {product.weight}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-xs xs:text-sm font-medium px-2 xs:px-3 py-1 rounded-full ${
            product.inStock 
              ? 'text-primary-700 bg-primary-100' 
              : 'text-red-600 bg-red-100'
          }`}>
            {product.inStock ? 'В наличии' : 'Нет в наличии'}
          </span>
          <button
            onClick={() => onCategoryClick?.(product.category)}
            disabled={selectedCategories.includes(product.category)}
            className={`text-xs px-2 py-1 rounded-lg transition-colors ${
              selectedCategories.includes(product.category)
                ? 'text-neutral-400 bg-neutral-100'
                : 'text-muted bg-neutral-50 hover:bg-primary-50 hover:text-primary-600 cursor-pointer'
            }`}
            title={
              selectedCategories.includes(product.category)
                ? `Категория "${product.category}" уже выбрана`
                : `Добавить фильтр по категории: ${product.category}`
            }
          >
            {product.category}
          </button>
        </div>
        
        <div className="space-y-2 xs:space-y-3">
          {product.inStock ? (
            quantity === 0 ? (
              <button
                onClick={handleAdd}
                className="w-full btn-primary flex items-center justify-center gap-2 xs:gap-3 py-3 xs:py-4 text-sm xs:text-base font-semibold"
              >
                <ShoppingCartIcon className="h-4 w-4 xs:h-5 xs:w-5" />
                В корзину
              </button>
            ) : (
              <div className="flex items-center justify-between bg-neutral-50 rounded-2xl p-2 xs:p-3 border border-neutral-200">
                <button
                  onClick={handleRemove}
                  className="p-1 xs:p-2 rounded-xl hover:bg-neutral-200 transition-colors group/btn"
                  title="Убрать один товар"
                >
                  <MinusIcon className="h-4 w-4 xs:h-5 xs:w-5 text-neutral-600 group-hover/btn:text-primary-600" />
                </button>
                
                <span className="font-bold text-primary text-base xs:text-lg min-w-[2.5rem] xs:min-w-[3rem] text-center">
                  {quantity}
                </span>
                
                <button
                  onClick={handleAdd}
                  className="p-1 xs:p-2 rounded-xl hover:bg-neutral-200 transition-colors group/btn"
                  title="Добавить еще один товар"
                >
                  <PlusIcon className="h-4 w-4 xs:h-5 xs:w-5 text-neutral-600 group-hover/btn:text-primary-600" />
                </button>
              </div>
            )
          ) : (
            <button
              disabled
              className="w-full bg-neutral-200 text-neutral-500 cursor-not-allowed flex items-center justify-center gap-2 xs:gap-3 py-3 xs:py-4 text-sm xs:text-base font-semibold rounded-xl"
              title="Товар временно недоступен"
            >
              <ShoppingCartIcon className="h-4 w-4 xs:h-5 xs:w-5" />
              В корзину
            </button>
          )}
        </div>
      </div>

    </div>
  )
}