'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'

interface ActiveFiltersProps {
    selectedCategories: string[]
    onCategoryRemove: (category: string) => void
    onClearAll: () => void
}

export default function ActiveFilters({
    selectedCategories,
    onCategoryRemove,
    onClearAll
}: ActiveFiltersProps) {
    if (selectedCategories.length === 0) {
        return null
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200 mb-4">


            <div className="flex gap-3 justify-between items-start">
                <div className="flex flex-wrap gap-3">
                {selectedCategories.map((category) => (
                    <span
                        key={category}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-700 border border-primary-200 hover:bg-primary-200 transition-colors"
                    >
                        {category}
                        <button
                            onClick={() => onCategoryRemove(category)}
                            className="ml-2 hover:bg-primary-300 rounded-full p-1 transition-colors"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </span>
                ))}
                </div>

                <button
                    onClick={onClearAll}
                    className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
                >
                    Очистить
                </button>
            </div>
        </div>
    )
}
