import { type FC } from 'react'
import { useTheme } from '../../hooks/useTheme'
import type { SearchFilterProps } from './types'

const CommandSearchFilter: FC<SearchFilterProps> = ({
  searchTerm,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange,
  commandCounts,
  categoryNames,
}) => {
  const { isDarkMode } = useTheme()

  return (
    <div className='mb-8 space-y-4'>
      {/* Search Input */}
      <input
        type='text'
        placeholder='Search commands...'
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-lg border ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
        } focus:outline-none focus:ring-2 focus:ring-primary-500`}
      />

      {/* Category Filter Buttons */}
      <div className='flex flex-wrap gap-2'>
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary-500 text-white'
              : isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({commandCounts.all})
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary-500 text-white'
                : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {categoryNames[category]} ({commandCounts[category]})
          </button>
        ))}
      </div>
    </div>
  )
}

export default CommandSearchFilter
