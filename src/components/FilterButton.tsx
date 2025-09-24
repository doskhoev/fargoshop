'use client'

import { FunnelIcon } from '@heroicons/react/24/outline'

interface FilterButtonProps {
  onClick: () => void
  filterCount: number
}

export default function FilterButton({ onClick, filterCount }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 xs:space-x-3 px-4 xs:px-6 py-2 xs:py-3 bg-white border-2 border-neutral-300 rounded-2xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 shadow-soft hover:shadow-medium"
    >
      <FunnelIcon className="h-4 w-4 xs:h-5 xs:w-5 text-neutral-600" />
      <span className="text-sm xs:text-base font-semibold text-primary">Фильтры</span>
      {filterCount > 0 && (
        <span className="inline-flex items-center justify-center w-5 h-5 xs:w-6 xs:h-6 text-xs font-bold text-white bg-secondary-400 rounded-full shadow-medium">
          {filterCount}
        </span>
      )}
    </button>
  )
}
