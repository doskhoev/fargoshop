'use client'

import { CartItem as CartItemType } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()
  const { product, quantity } = item

  return (
    <div className="card p-4">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-400 text-xs">Фото</span>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-gray-600 text-sm">{product.description}</p>
          <p className="text-primary-600 font-semibold">{product.price} ₽</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => void updateQuantity(product.id, quantity - 1)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          
          <span className="w-8 text-center font-semibold">{quantity}</span>
          
          <button
            onClick={() => void updateQuantity(product.id, quantity + 1)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => void removeItem(product.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded-full ml-2"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
