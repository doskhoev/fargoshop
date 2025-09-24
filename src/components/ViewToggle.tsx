'use client'

import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline'

interface ViewToggleProps {
  isListView: boolean
  onToggle: () => void
}

export default function ViewToggle({ isListView, onToggle }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-neutral-100 rounded-2xl p-1">
      <button
        onClick={onToggle}
        className={`flex items-center justify-center w-8 h-8 xs:w-10 xs:h-10 rounded-xl transition-all duration-200 ${
          !isListView
            ? 'bg-white shadow-soft text-primary-600'
            : 'text-neutral-600 hover:bg-neutral-200'
        }`}
        title="Сетка"
      >
        <Squares2X2Icon className="h-4 w-4 xs:h-5 xs:w-5" />
      </button>
      
      <button
        onClick={onToggle}
        className={`flex items-center justify-center w-8 h-8 xs:w-10 xs:h-10 rounded-xl transition-all duration-200 ${
          isListView
            ? 'bg-white shadow-soft text-primary-600'
            : 'text-neutral-600 hover:bg-neutral-200'
        }`}
        title="Список"
      >
        <ListBulletIcon className="h-4 w-4 xs:h-5 xs:w-5" />
      </button>
    </div>
  )
}
