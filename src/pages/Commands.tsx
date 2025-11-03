import { type FC, useMemo, useState } from 'react'
import { useCommandList, type CommandCategoryType } from '../../modules/y0f-terminal/src'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'

const Commands: FC = () => {
  const { isDarkMode } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<CommandCategoryType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { commands: allCommands, categories, getByCategory } = useCommandList()

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

  const categoryNames: Record<CommandCategoryType, string> = {
    system: 'System',
    info: 'Information',
    devtools: 'Developer Tools',
    effects: 'Effects',
    services: 'Services',
    games: 'Games',
    filesystem: 'Filesystem',
  }

  const categoryDescriptions: Record<CommandCategoryType, string> = {
    system: 'Core terminal operations and utilities',
    info: 'System and environment information',
    devtools: 'Development and debugging tools',
    effects: 'Visual effects and animations',
    services: 'Browse available services',
    games: 'Interactive games and entertainment',
    filesystem: 'File and directory operations',
  }

  const getCategoryColor = (category: CommandCategoryType): string => {
    const colors: Record<CommandCategoryType, string> = {
      system: 'text-blue-400',
      info: 'text-cyan-400',
      devtools: 'text-green-400',
      effects: 'text-purple-400',
      services: 'text-orange-400',
      games: 'text-pink-400',
      filesystem: 'text-yellow-400',
    }
    return colors[category] || 'text-gray-400'
  }

  const getCategoryBg = (category: CommandCategoryType): string => {
    const colors: Record<CommandCategoryType, string> = {
      system: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-100',
      info: isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-100',
      devtools: isDarkMode ? 'bg-green-500/10' : 'bg-green-100',
      effects: isDarkMode ? 'bg-purple-500/10' : 'bg-purple-100',
      services: isDarkMode ? 'bg-orange-500/10' : 'bg-orange-100',
      games: isDarkMode ? 'bg-pink-500/10' : 'bg-pink-100',
      filesystem: isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-100',
    }
    return colors[category] || (isDarkMode ? 'bg-gray-500/10' : 'bg-gray-100')
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-6xl'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className='mb-8'>
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Terminal Commands
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Complete reference of all available commands
          </p>
        </div>

        {/* Search and Filter */}
        <div className='mb-8 space-y-4'>
          <input
            type='text'
            placeholder='Search commands...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-primary-500`}
          />

          <div className='flex flex-wrap gap-2'>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({allCommands.length})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoryNames[category]} ({getByCategory(category).length})
              </button>
            ))}
          </div>
        </div>

        {/* Commands Grid */}
        <div className='space-y-6'>
          {filteredCommands.length === 0 ? (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No commands found matching &quot;{searchTerm}&quot;
            </div>
          ) : (
            filteredCommands.map((command) => (
              <motion.div
                key={command.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-lg border p-6 ${
                  isDarkMode
                    ? 'bg-gray-800/50 border-gray-700'
                    : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h3
                        className={`text-2xl font-mono font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                      >
                        {command.name}
                      </h3>
                      {command.aliases.length > 0 && (
                        <div className='flex gap-2'>
                          {command.aliases.map((alias) => (
                            <span
                              key={alias}
                              className={`text-xs px-2 py-1 rounded ${
                                isDarkMode
                                  ? 'bg-gray-700 text-gray-300'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              alias: {alias}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p
                      className={`text-base mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      {command.description}
                    </p>
                  </div>
                  <span
                    className={`${getCategoryBg(command.category)} ${getCategoryColor(command.category)} px-3 py-1 rounded-full text-xs font-semibold`}
                  >
                    {categoryNames[command.category]}
                  </span>
                </div>

                <div className='space-y-3'>
                  <div>
                    <h4
                      className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      Usage
                    </h4>
                    <code
                      className={`block px-4 py-2 rounded font-mono text-sm ${
                        isDarkMode ? 'bg-gray-900 text-green-400' : 'bg-gray-50 text-green-700'
                      }`}
                    >
                      $ {command.usage}
                    </code>
                  </div>

                  {/* Category Description */}
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {categoryDescriptions[command.category]}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Commands
