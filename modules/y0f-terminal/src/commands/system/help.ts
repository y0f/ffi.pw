import { createCommand, CommandCategory } from '../../core/Command'
import { formatHeader, formatDivider, formatText, formatLink } from '../../core/formatters'
import registry from '../index'

export const help = createCommand({
  name: 'help',
  description: 'List available commands',
  category: CommandCategory.SYSTEM,
  usage: 'help [category]',

  execute: async ({ parsed }) => {
    const category = parsed?.args[0]?.toLowerCase()

    // If category specified, show commands for that category
    if (category) {
      const categoryMap: Record<string, typeof CommandCategory[keyof typeof CommandCategory]> = {
        system: CommandCategory.SYSTEM,
        filesystem: CommandCategory.FILESYSTEM,
        effects: CommandCategory.EFFECTS,
        games: CommandCategory.GAMES,
        devtools: CommandCategory.DEVTOOLS,
        info: CommandCategory.INFO,
        services: CommandCategory.SERVICES,
      }

      const selectedCategory = categoryMap[category]
      if (!selectedCategory) {
        return [
          formatText(`Unknown category: ${category}`, 'text-red-500'),
          formatText(
            'Available: system, filesystem, effects, games, devtools, info',
            'text-gray-400',
          ),
        ]
      }

      const commands = registry
        .getByCategory(selectedCategory)
        .filter((cmd) => !cmd.hidden)
        .sort((a, b) => a.name.localeCompare(b.name))

      const output = [formatHeader(`${selectedCategory.toUpperCase()} COMMANDS`), formatDivider()]

      for (const cmd of commands) {
        const paddedName = cmd.name.padEnd(12, ' ')
        output.push(formatText(`${paddedName} - ${cmd.description}`, 'text-gray-300'))
      }

      output.push(formatDivider())
      output.push(formatText('Type "help" to see all categories', 'text-gray-400'))

      return output
    }

    return [
      formatHeader('COMMANDS'),
      formatDivider(),
      formatText('  clear      - Clear terminal'),
      formatText('  whoami     - About the developer'),
      formatText('  services   - View my services'),
      formatText('  links      - Social links'),
      formatText('  neofetch   - System info'),
      formatDivider(),
      formatText(''),
      formatText('COMMAND CATEGORIES:', 'text-blue-400'),
      formatText('  help system      - System commands'),
      formatText('  help filesystem  - File operations'),
      formatText('  help effects     - Visual effects'),
      formatText('  help games       - Available games'),
      formatText('  help devtools    - Developer tools'),
      formatDivider(),
      formatLink('View all commands', '/commands'),
    ]
  },
})
