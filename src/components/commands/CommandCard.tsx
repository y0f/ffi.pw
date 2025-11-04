import { type FC, memo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import clsx from 'clsx'
import type { CommandCardProps } from './types'

const CommandCard: FC<CommandCardProps> = memo(({
  command,
  onExpand,
  categoryColor,
  categoryBg
}) => {
  const { isDarkMode } = useTheme()

  // Truncate description to 2 lines max
  const shortDescription = command.description.length > 80
    ? command.description.substring(0, 80) + '...'
    : command.description

  return (
    <div
      onClick={() => onExpand(command.name)}
      className={clsx(
        'relative rounded-lg border p-3 cursor-pointer group',
        'transition-all duration-150 hover:-translate-y-1 h-[140px] flex flex-col',
        isDarkMode
          ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
      )}
    >
      {/* Category Badge */}
      <div className='flex items-start justify-between mb-2'>
        <span
          className={clsx(
            'text-xs px-2 py-0.5 rounded-full font-semibold',
            categoryBg,
            categoryColor
          )}
        >
          {command.category}
        </span>
        {command.aliases.length > 0 && (
          <span className={clsx(
            'text-xs',
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          )}>
            +{command.aliases.length}
          </span>
        )}
      </div>

      {/* Command Name */}
      <h3 className={clsx(
        'text-lg font-mono font-bold mb-2 truncate',
        isDarkMode ? 'text-white' : 'text-gray-900'
      )}>
        {command.name}
      </h3>

      {/* Description (2 lines max) */}
      <p className={clsx(
        'text-sm line-clamp-2 flex-1',
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      )}>
        {shortDescription}
      </p>

      {/* Usage Hint */}
      <div className={clsx(
        'text-xs font-mono mt-2 pt-2 border-t',
        isDarkMode
          ? 'text-gray-500 border-gray-700'
          : 'text-gray-500 border-gray-200'
      )}>
        $ {command.usage.split(' ')[0]}...
      </div>

      {/* Hover Indicator */}
      <div className={clsx(
        'absolute bottom-2 right-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity',
        isDarkMode ? 'text-gray-500' : 'text-gray-400'
      )}>
        Click to expand
      </div>
    </div>
  )
})

CommandCard.displayName = 'CommandCard'

export default CommandCard
