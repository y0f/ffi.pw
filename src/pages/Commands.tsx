import { type FC, useMemo, useState } from 'react'
import { useCommandList, type CommandCategoryType } from '../../modules/y0f-terminal/src'
import { AnimatePresence } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import CommandsGrid from '../components/commands/CommandsGrid'
import CommandSearchFilter from '../components/commands/CommandSearchFilter'
import CommandCardExpanded from '../components/commands/CommandCardExpanded'
import PageHeader from '../components/common/PageHeader'
import useDeviceCapability from '../hooks/useDeviceCapability'

const Commands: FC = () => {
  const { isDarkMode } = useTheme()
  const { isMobile, shouldReduceMotion } = useDeviceCapability()
  const [selectedCategory, setSelectedCategory] = useState<CommandCategoryType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCommand, setExpandedCommand] = useState<string | null>(null)

  const { commands: allCommands, categories, getByCategory } = useCommandList()

  const shouldAnimate = !isMobile && !shouldReduceMotion

  // Filter commands based on search and category
  const filteredCommands = useMemo(() => {
    let commands = allCommands

    if (selectedCategory !== 'all') {
      commands = getByCategory(selectedCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      commands = commands.filter(
        (cmd) =>
          cmd.name.toLowerCase().includes(term) ||
          cmd.description.toLowerCase().includes(term) ||
          cmd.aliases.some((alias) => alias.toLowerCase().includes(term)),
      )
    }

    return commands
  }, [selectedCategory, searchTerm, allCommands, getByCategory])

  // Category configuration
  const categoryNames: Record<CommandCategoryType, string> = {
    system: 'System',
    info: 'Information',
    devtools: 'Developer Tools',
    effects: 'Effects',
    services: 'Services',
    games: 'Games',
    filesystem: 'Filesystem',
  }

  const categoryColors: Record<CommandCategoryType, string> = {
    system: 'text-blue-400',
    info: 'text-cyan-400',
    devtools: 'text-green-400',
    effects: 'text-purple-400',
    services: 'text-orange-400',
    games: 'text-pink-400',
    filesystem: 'text-yellow-400',
  }

  const categoryBackgrounds: Record<CommandCategoryType, string> = {
    system: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-100',
    info: isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-100',
    devtools: isDarkMode ? 'bg-green-500/10' : 'bg-green-100',
    effects: isDarkMode ? 'bg-purple-500/10' : 'bg-purple-100',
    services: isDarkMode ? 'bg-orange-500/10' : 'bg-orange-100',
    games: isDarkMode ? 'bg-pink-500/10' : 'bg-pink-100',
    filesystem: isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-100',
  }

  // Command counts for filter buttons
  const commandCounts = useMemo(() => {
    const counts: Partial<Record<CommandCategoryType | 'all', number>> = { all: allCommands.length }
    categories.forEach((cat) => {
      counts[cat] = getByCategory(cat).length
    })
    return counts as Record<CommandCategoryType | 'all', number>
  }, [allCommands, categories, getByCategory])

  // Get expanded command data
  const expandedCommandData = useMemo(() => {
    if (!expandedCommand) return null
    return allCommands.find((cmd) => cmd.name === expandedCommand) || null
  }, [expandedCommand, allCommands])

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      {/* Header */}
      <PageHeader
        title='TERMINAL COMMANDS'
        subtitle='Complete reference of all available commands'
        isDarkMode={isDarkMode}
        shouldAnimate={shouldAnimate}
      />

      {/* Search and Filter */}
      <CommandSearchFilter
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        categories={categories}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        commandCounts={commandCounts}
        categoryNames={categoryNames}
      />

      {/* Commands Grid */}
      <CommandsGrid
        commands={filteredCommands}
        onCommandExpand={setExpandedCommand}
        categoryColors={categoryColors}
        categoryBackgrounds={categoryBackgrounds}
      />

      {/* Expanded Command View */}
      <AnimatePresence>
        {expandedCommandData && (
          <CommandCardExpanded
            command={expandedCommandData}
            categoryColor={categoryColors[expandedCommandData.category]}
            categoryBg={categoryBackgrounds[expandedCommandData.category]}
            onClose={() => setExpandedCommand(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Commands
