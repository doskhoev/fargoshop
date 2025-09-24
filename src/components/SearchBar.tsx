'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = "Поиск товаров..." }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex-1">
      <div className={`relative flex items-center bg-neutral-100 rounded-2xl transition-all duration-200 ${
        isFocused ? 'bg-white shadow-medium ring-2 ring-primary-200' : 'hover:bg-neutral-50'
      }`}>
        <div className="pl-4">
          <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full py-4 pl-3 pr-12 bg-transparent border-none outline-none text-neutral-800 placeholder-neutral-500 text-base"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 p-1.5 hover:bg-neutral-200 rounded-full transition-colors"
            title="Очистить поиск"
          >
            <XMarkIcon className="h-4 w-4 text-neutral-400" />
          </button>
        )}
      </div>
    </form>
  )
}
