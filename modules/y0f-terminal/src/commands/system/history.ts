import { createCommand, CommandCategory } from '../../core/Command'
import { formatHeader, formatMultiPart, formatText, formatEmptyLine } from '../../core/formatters'
import { getArg, hasFlag } from '../../core/ArgumentParser'

// This command needs access to history from the hook
// We'll export a function that takes history as a parameter
export const createHistoryCommand = (getHistory: () => string[], clearHistory: () => void) => {
  return createCommand({
    name: 'history',
    description: 'Show command history',
    category: CommandCategory.SYSTEM,
    usage: 'history [-c | --clear] [search]',
    aliases: ['h'],

    execute: async ({ parsed }) => {
      if (!parsed) {
        return [formatText('Error: Invalid command', 'text-red-500')]
      }

      const shouldClear = hasFlag(parsed, 'c') || hasFlag(parsed, 'clear')
      const searchTerm = getArg(parsed, 0)

      if (shouldClear) {
        clearHistory()
        return [formatText('Command history cleared', 'text-primary-400')]
      }

      const history = getHistory()

      if (history.length === 0) {
        return [formatText('No command history', 'text-gray-500')]
      }

      const output = [formatHeader('COMMAND HISTORY'), formatEmptyLine()]

      let filteredHistory = history
      if (searchTerm) {
        filteredHistory = history.filter((cmd) => cmd.includes(searchTerm))
        if (filteredHistory.length === 0) {
          output.push(formatText(`No commands found matching '${searchTerm}'`, 'text-gray-500'))
          return output
        }
        output.push(formatText(`Showing commands matching '${searchTerm}':`, 'text-primary-300'))
        output.push(formatEmptyLine())
      }

      filteredHistory.forEach((cmd, index) => {
        const actualIndex = searchTerm ? history.indexOf(cmd) : index
        output.push(
          formatMultiPart([
            { text: `${(actualIndex + 1).toString().padStart(4, ' ')}  `, color: 'text-gray-500' },
            { text: cmd, color: 'text-gray-200' },
          ]),
        )
      })

      output.push(formatEmptyLine())
      output.push(
        formatText(
          `Total: ${filteredHistory.length} command${filteredHistory.length === 1 ? '' : 's'}`,
          'text-gray-500',
        ),
      )

      return output
    },
  })
}

export const history = createHistoryCommand(
  () => [],
  () => {},
)
