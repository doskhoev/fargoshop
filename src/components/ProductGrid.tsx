'use client'

import { Product } from '@/types'
import { useProductStore } from '@/store/productStore'
import ProductCard from './ProductCard'
import ProductCardList from './ProductCardList'

interface ProductGridProps {
  searchQuery?: string
  selectedCategories?: string[]
  isListView?: boolean
  onCategoryClick?: (category: string) => void
  onEditProduct?: (product: Product) => void
  onDeleteProduct?: (productId: string, productName: string) => void
}

export default function ProductGrid({ searchQuery = '', selectedCategories = [], isListView = false, onCategoryClick, onEditProduct, onDeleteProduct }: ProductGridProps) {
  const { products } = useProductStore()
  
  // Фильтрация товаров по поисковому запросу и категориям
  const filteredProducts = products.filter(product => {
    // Фильтр по поисковому запросу
    const matchesSearch = !searchQuery.trim() || (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Фильтр по категориям
    const matchesCategories = selectedCategories.length === 0 || 
      selectedCategories.includes(product.category)

    return matchesSearch && matchesCategories
  })

  if (filteredProducts.length === 0) {
    const hasFilters = searchQuery.trim() || selectedCategories.length > 0
    
    return (
      <div className="text-center py-20">
        <div className="text-neutral-300 mb-8">
          <svg className="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-primary mb-4">Товары не найдены</h3>
        <p className="text-secondary text-lg max-w-md mx-auto">
          {hasFilters 
            ? 'По выбранным фильтрам ничего не найдено. Попробуйте изменить параметры поиска.'
            : 'Товары не найдены'
          }
        </p>
      </div>
    )
  }

  if (isListView) {
    return (
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <ProductCardList 
            key={product.id} 
            product={product} 
            onCategoryClick={onCategoryClick}
            selectedCategories={selectedCategories}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onCategoryClick={onCategoryClick}
          selectedCategories={selectedCategories}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
        />
      ))}
    </div>
  )
}
