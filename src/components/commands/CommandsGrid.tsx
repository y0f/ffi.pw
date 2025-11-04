import { type FC, memo } from 'react'
import CommandCard from './CommandCard'
import type { CommandsGridProps } from './types'

const CommandsGrid: FC<CommandsGridProps> = memo(({
  commands,
  onCommandExpand,
  categoryColors,
  categoryBackgrounds,
}) => {
  if (commands.length === 0) {
    return (
      <div className='text-center py-12 text-gray-400'>
        No commands found
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4'>
      {commands.map((command) => (
        <CommandCard
          key={command.name}
          command={command}
          onExpand={onCommandExpand}
          categoryColor={categoryColors[command.category]}
          categoryBg={categoryBackgrounds[command.category]}
        />
      ))}
    </div>
  )
})

CommandsGrid.displayName = 'CommandsGrid'

export default CommandsGrid
