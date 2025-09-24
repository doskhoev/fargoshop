'use client'

import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { PlusIcon, MinusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'

interface ProductCardListProps {
  product: Product
  onCategoryClick?: (category: string) => void
  selectedCategories?: string[]
}

export default function ProductCardList({ product, onCategoryClick, selectedCategories = [] }: ProductCardListProps) {
  const { addItem, removeItem, updateQuantity, getItemQuantity } = useCartStore()
  const quantity = getItemQuantity(product.id)

  const handleAdd = () => {
    addItem(product)
  }

  const handleRemove = () => {
    if (quantity === 1) {
      removeItem(product.id)
    } else {
      updateQuantity(product.id, quantity - 1)
    }
  }

  return (
    <div className="card-hover p-3 xs:p-4 group">
      <div className="flex gap-3 xs:gap-4">
        {/* Изображение - в 2 раза меньше */}
        <div className="w-16 h-16 xs:w-20 xs:h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
          <span className="text-neutral-400 text-xs font-medium">Фото</span>
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1 xs:mb-2">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-bold text-base xs:text-lg text-primary group-hover:text-primary-600 transition-colors truncate"
                title={product.name}
              >
                {product.name}
              </h3>
              <p 
                className="text-secondary text-xs xs:text-sm leading-relaxed line-clamp-2 mt-1 h-6 xs:h-8"
                title={product.description}
              >
                {product.description}
              </p>
            </div>

            {/* Цена и вес */}
            <div className="text-right ml-2 xs:ml-4 flex-shrink-0">
              <div className="text-lg xs:text-2xl font-bold text-primary-500 mb-1">
                {product.price} ₽
              </div>
              {product.weight && (
                <div className="text-xs text-muted bg-neutral-100 px-2 py-1 rounded-full">
                  {product.weight}
                </div>
              )}
            </div>
          </div>

          {/* Статус и категория */}
          <div className="flex items-center justify-between mb-2 xs:mb-3">
            <div className="flex items-center gap-1 xs:gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.inStock
                  ? 'text-primary-700 bg-primary-100'
                  : 'text-red-600 bg-red-100'
                }`}>
                {product.inStock ? 'В наличии' : 'Нет в наличии'}
              </span>
              <button
                onClick={() => onCategoryClick?.(product.category)}
                disabled={selectedCategories.includes(product.category)}
                className={`text-xs px-2 py-1 rounded-lg transition-colors ${selectedCategories.includes(product.category)
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
          </div>

          {/* Кнопки управления */}
          <div className="flex items-center justify-between">
            {product.inStock ? (
              quantity === 0 ? (
                <button
                  onClick={handleAdd}
                  className="btn-primary flex items-center gap-1 xs:gap-2 py-2 px-3 xs:px-4 text-xs xs:text-sm font-semibold"
                >
                  <ShoppingCartIcon className="h-3 w-3 xs:h-4 xs:w-4" />
                  В корзину
                </button>
              ) : (
                <div className="flex items-center gap-2 xs:gap-3">
                  <div className="flex items-center bg-neutral-50 rounded-xl p-1 xs:p-2 border border-neutral-200">
                    <button
                      onClick={handleRemove}
                      className="p-1 rounded-lg hover:bg-neutral-200 transition-colors"
                      title="Убрать один товар"
                    >
                      <MinusIcon className="h-3 w-3 xs:h-4 xs:w-4 text-neutral-600" />
                    </button>
                    
                    <span className="font-bold text-primary text-sm xs:text-base min-w-[1.5rem] xs:min-w-[2rem] text-center mx-1 xs:mx-2">
                      {quantity}
                    </span>
                    
                    <button
                      onClick={handleAdd}
                      className="p-1 rounded-lg hover:bg-neutral-200 transition-colors"
                      title="Добавить еще один товар"
                    >
                      <PlusIcon className="h-3 w-3 xs:h-4 xs:w-4 text-neutral-600" />
                    </button>
                  </div>
                </div>
              )
            ) : (
              <button
                disabled
                className="bg-neutral-200 text-neutral-500 cursor-not-allowed flex items-center gap-1 xs:gap-2 py-2 px-3 xs:px-4 text-xs xs:text-sm font-semibold rounded-xl"
                title="Товар временно недоступен"
              >
                <ShoppingCartIcon className="h-3 w-3 xs:h-4 xs:w-4" />
                В корзину
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
