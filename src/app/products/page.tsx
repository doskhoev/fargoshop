'use client'

import { useState, useEffect } from 'react'
import ProductGrid from '@/components/ProductGrid'
import Header from '@/components/Header'
import FilterSidebar from '@/components/FilterSidebar'
import FilterButton from '@/components/FilterButton'
import ActiveFilters from '@/components/ActiveFilters'
import ViewToggle from '@/components/ViewToggle'
import { mockProducts } from '@/data/mockProducts'

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isListView, setIsListView] = useState(false)

  // Получаем уникальные категории из товаров
  const categories = Array.from(new Set(mockProducts.map(product => product.category)))

  // Определяем мобильное устройство
  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories)
  }

  const handleCategoryClick = (category: string) => {
    // Клик только добавляет категорию, если её ещё нет в фильтрах
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleCategoryRemove = (category: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category))
  }

  const handleClearAllFilters = () => {
    setSelectedCategories([])
  }

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handleViewToggle = () => {
    setIsListView(!isListView)
  }

  const getFilterCount = () => {
    return selectedCategories.length
  }

  const getPageTitle = () => {
    if (searchQuery) {
      return `Результаты поиска: "${searchQuery}"`
    }
    if (selectedCategories.length > 0) {
      return `Категория: ${selectedCategories.join(', ')}`
    }
    return 'Каталог товаров'
  }

  // Показываем загрузку до монтирования компонента
  if (!isMounted) {
    return (
      <div>
        <Header onSearch={handleSearch} />
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-8 xs:py-10 sm:py-12">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-primary mb-8 xs:mb-10 sm:mb-12">Каталог товаров</h2>
          <div className="flex flex-col lg:flex-row gap-4 xs:gap-6 sm:gap-8">
            <div className="w-full lg:w-72 flex-shrink-0">
              <div className="card p-4 xs:p-6 sm:p-8">
                <div className="animate-pulse">
                  <div className="h-6 xs:h-8 bg-neutral-200 rounded-2xl mb-4 xs:mb-6"></div>
                  <div className="space-y-3 xs:space-y-4">
                    <div className="h-4 xs:h-5 bg-neutral-200 rounded-xl"></div>
                    <div className="h-4 xs:h-5 bg-neutral-200 rounded-xl"></div>
                    <div className="h-4 xs:h-5 bg-neutral-200 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xs:gap-6 sm:gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card p-4 xs:p-6 animate-pulse">
                    <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl mb-4 xs:mb-6"></div>
                    <div className="space-y-3 xs:space-y-4">
                      <div className="h-5 xs:h-6 bg-neutral-200 rounded-xl"></div>
                      <div className="h-3 xs:h-4 bg-neutral-200 rounded-lg"></div>
                      <div className="h-6 xs:h-8 bg-neutral-200 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header onSearch={handleSearch} />
      
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-8 xs:py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 xs:gap-6 mb-8 xs:mb-10 sm:mb-12">
          <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
            {getPageTitle()}
          </h2>
          
          {/* Кнопки для мобильных */}
          {isMobile && (
            <div className="flex items-center gap-2 xs:gap-3">
              <ViewToggle 
                isListView={isListView}
                onToggle={handleViewToggle}
              />
              <FilterButton 
                onClick={handleFilterToggle}
                filterCount={getFilterCount()}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Боковая панель фильтров для десктопа */}
          {!isMobile && (
            <div className="w-full lg:w-64 flex-shrink-0">
              <FilterSidebar
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          )}

          {/* Основной контент */}
          <div className="flex-1">
            <ActiveFilters
              selectedCategories={selectedCategories}
              onCategoryRemove={handleCategoryRemove}
              onClearAll={handleClearAllFilters}
            />
            <ProductGrid 
              searchQuery={searchQuery} 
              selectedCategories={selectedCategories}
              isListView={isMobile ? isListView : false}
              onCategoryClick={handleCategoryClick}
            />
          </div>
        </div>
      </div>

      {/* Модальное окно фильтров для мобильных */}
      {isMobile && (
        <FilterSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          isMobile={true}
        />
      )}
    </div>
  )
}
