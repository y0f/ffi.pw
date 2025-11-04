import type { Command, CommandCategoryType } from '../../../modules/y0f-terminal/src'

export interface CommandCardProps {
  command: Command
  onExpand: (commandName: string) => void
  categoryColor: string
  categoryBg: string
}

export interface CommandsGridProps {
  commands: Command[]
  onCommandExpand: (commandName: string) => void
  categoryColors: Record<CommandCategoryType, string>
  categoryBackgrounds: Record<CommandCategoryType, string>
}

export interface ExpandedCommandViewProps {
  command: Command
  categoryColor: string
  categoryBg: string
  onClose: () => void
}

export interface SearchFilterProps {
  searchTerm: string
  selectedCategory: CommandCategoryType | 'all'
  categories: CommandCategoryType[]
  onSearchChange: (term: string) => void
  onCategoryChange: (category: CommandCategoryType | 'all') => void
  commandCounts: Record<CommandCategoryType | 'all', number>
  categoryNames: Record<CommandCategoryType, string>
}
