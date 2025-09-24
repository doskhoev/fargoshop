'use client'

import { useState } from 'react'
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline'

interface FilterSidebarProps {
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  isOpen?: boolean
  onClose?: () => void
  isMobile?: boolean
}

export default function FilterSidebar({ 
  categories, 
  selectedCategories, 
  onCategoryChange, 
  isOpen = true, 
  onClose,
  isMobile = false 
}: FilterSidebarProps) {
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
  }

  const handleClearFilters = () => {
    onCategoryChange([])
  }

  const content = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-primary">Фильтры</h3>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-neutral-600" />
          </button>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-semibold text-lg text-primary">Категории</h4>
          {selectedCategories.length > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              Очистить все
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="h-5 w-5 text-primary-500 focus:ring-primary-200 border-neutral-300 rounded-lg"
              />
              <span className="text-base text-secondary group-hover:text-primary transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

    </div>
  )

  if (isMobile) {
    return (
      <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-strong w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              {content}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      {content}
    </div>
  )
}
