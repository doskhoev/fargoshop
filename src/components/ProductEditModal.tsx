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
    inStock: true,
    image: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const categories = [
    'Овощи', 'Фрукты', 'Молочка', 'Хлеб', 'Мясо', 
    'Рыба', 'Крупы', 'Напитки', 'Сладости', 'Заморозка'
  ]

  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    setErrors(prev => ({ ...prev, image: '' }))

    try {
      const formData = new FormData()
      formData.append('file', file)

      const token = localStorage.getItem('auth-storage')
      const authData = token ? JSON.parse(token) : null

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authData?.state?.token}`
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setFormData(prev => ({ ...prev, image: data.imageUrl }))
        setImagePreview(data.imageUrl)
      } else {
        setErrors(prev => ({ ...prev, image: data.error }))
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, image: 'Ошибка загрузки изображения' }))
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Валидация на клиенте
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Неподдерживаемый формат файла' }))
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Файл слишком большой (максимум 5MB)' }))
        return
      }

      handleImageUpload(file)
    }
  }

  const handleRemoveImage = () => {
    if (confirm('Вы уверены, что хотите удалить изображение?')) {
      // Очищаем поле изображения
      setFormData(prev => ({ ...prev, image: '' }))
      setImagePreview(null)
      setErrors(prev => ({ ...prev, image: '' }))
      
      // Очищаем input файла
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    }
  }

  useEffect(() => {
    if (product) {
      // Проверяем, что изображение не является placeholder
      const hasRealImage = product.image && !product.image.includes('placeholder')
      
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        category: product.category,
        weight: product.weight || '',
        expirationDate: product.expirationDate || '',
        inStock: product.inStock,
        image: hasRealImage ? product.image! : ''
      })
      setImagePreview(hasRealImage ? product.image! : null)
    } else {
      setFormData({
        name: '', price: '', description: '', category: '',
        weight: '', expirationDate: '', inStock: true, image: ''
      })
      setImagePreview(null)
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
      image: formData.image || undefined // Не передаем placeholder, пусть API сам решает
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

              {/* Изображение */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Изображение товара
                  {imagePreview && (
                    <span className="ml-2 text-xs text-green-600 font-normal">✓ Загружено</span>
                  )}
                </label>
                
                {/* Предварительный просмотр */}
                {imagePreview && (
                  <div className="mb-3 relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Предварительный просмотр" 
                      className="w-32 h-32 object-cover rounded-lg border border-neutral-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                      title="Удалить изображение"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {/* Загрузка файла */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-xl">
                      <div className="text-sm text-primary-600">Загрузка...</div>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-neutral-500 mt-1">
                  Поддерживаемые форматы: JPEG, PNG, WebP. Максимальный размер: 5MB
                </p>
                
                {/* Кнопка удаления изображения */}
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Удалить изображение
                  </button>
                )}
                
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
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
