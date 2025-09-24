'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import { useProductStore } from '@/store/productStore'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ProductEditModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function ProductEditModal({ product, isOpen, onClose, onSave }: ProductEditModalProps) {
  const { updateProduct, addProduct } = useProductStore()
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    weight: '',
    expirationDate: '',
    inStock: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = [
    'Овощи', 'Фрукты', 'Молочка', 'Хлеб', 'Мясо', 
    'Рыба', 'Крупы', 'Напитки', 'Сладости', 'Заморозка'
  ]

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        category: product.category,
        weight: product.weight || '',
        expirationDate: product.expirationDate || '',
        inStock: product.inStock
      })
    } else {
      setFormData({
        name: '', price: '', description: '', category: '',
        weight: '', expirationDate: '', inStock: true
      })
    }
    setErrors({})
  }, [product])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Название товара обязательно'
    if (!formData.price.trim()) newErrors.price = 'Цена обязательна'
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Цена должна быть положительным числом'
    }
    if (!formData.description.trim()) newErrors.description = 'Описание обязательно'
    if (!formData.category.trim()) newErrors.category = 'Категория обязательна'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const productData: Omit<Product, 'id'> = {
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      category: formData.category,
      weight: formData.weight.trim() || undefined,
      expirationDate: formData.expirationDate || undefined,
      inStock: formData.inStock,
      image: '/images/placeholder.jpg'
    }

    let success = false
    if (product) {
      success = await updateProduct(product.id, productData)
    } else {
      success = await addProduct(productData)
    }
    
    if (success) {
      onSave()
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-strong w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">
                {product ? 'Редактировать товар' : 'Добавить товар'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                <XMarkIcon className="h-6 w-6 text-neutral-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Название */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Название товара *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm transition-colors ${
                    errors.name ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                    : 'border-neutral-300 bg-white focus:border-primary-500 focus:ring-primary-200'
                  }`}
                  placeholder="Введите название товара"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Цена */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Цена (₽) *</label>
                <input
                  type="number" min="0" step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm transition-colors ${
                    errors.price ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                    : 'border-neutral-300 bg-white focus:border-primary-500 focus:ring-primary-200'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>

              {/* Описание */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Описание *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-xl text-sm transition-colors resize-none ${
                    errors.description ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                    : 'border-neutral-300 bg-white focus:border-primary-500 focus:ring-primary-200'
                  }`}
                  placeholder="Описание товара"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Категория */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Категория *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm transition-colors ${
                    errors.category ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                    : 'border-neutral-300 bg-white focus:border-primary-500 focus:ring-primary-200'
                  }`}
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              {/* Вес */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Вес/объем</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 bg-white rounded-xl text-sm focus:border-primary-500 focus:ring-primary-200 transition-colors"
                  placeholder="1 кг, 500 мл, 1 шт"
                />
              </div>

              {/* Срок годности */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Срок годности</label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 bg-white rounded-xl text-sm focus:border-primary-500 focus:ring-primary-200 transition-colors"
                />
              </div>

              {/* В наличии */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => handleInputChange('inStock', e.target.checked)}
                  className="h-4 w-4 text-primary-500 focus:ring-primary-200 border-neutral-300 rounded"
                />
                <label htmlFor="inStock" className="text-sm font-semibold text-primary">
                  Товар в наличии
                </label>
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 btn-primary py-2 text-sm font-semibold">
                  {product ? 'Сохранить изменения' : 'Добавить товар'}
                </button>
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors">
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
