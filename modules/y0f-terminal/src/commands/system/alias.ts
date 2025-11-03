import { createCommand, CommandCategory } from '../../core/Command'
import {
  formatHeader,
  formatMultiPart,
  formatText,
  formatEmptyLine,
  formatError,
} from '../../core/formatters'
import { getArg } from '../../core/ArgumentParser'

// Simple in-memory alias storage
const aliases: Record<string, string> = {}

export const alias = createCommand({
  name: 'alias',
  description: 'Create command aliases',
  category: CommandCategory.SYSTEM,
  usage: 'alias [name=command]',

  execute: async ({ parsed }) => {
    if (!parsed) {
      return [formatError('alias', 'Invalid command')]
    }

    const arg = getArg(parsed, 0)

    // No argument: list all aliases
    if (!arg) {
      const aliasList = Object.entries(aliases)

      if (aliasList.length === 0) {
        return [formatText('No aliases defined', 'text-gray-500')]
      }

      const output = [formatHeader('COMMAND ALIASES'), formatEmptyLine()]

      aliasList.forEach(([name, command]) => {
        output.push(
          formatMultiPart([
            { text: name, color: 'text-primary-400' },
            { text: '=', color: 'text-gray-500' },
            { text: `'${command}'`, color: 'text-gray-200' },
          ]),
        )
      })

      output.push(formatEmptyLine())
      output.push(
        formatText(
          `Total: ${aliasList.length} alias${aliasList.length === 1 ? '' : 'es'}`,
          'text-gray-500',
        ),
      )

      return output
    }

    const match = arg.match(/^([a-zA-Z0-9_-]+)=(.+)$/)

    if (!match) {
      return [formatError('alias', 'Invalid syntax. Usage: alias name=command')]
    }

    const [, name, command] = match
    if (!name || !command) {
      return [formatError('alias', 'Invalid syntax. Usage: alias name=command')]
    }

    // Store alias
    aliases[name] = command.replace(/^['"]|['"]$/g, '')

    return [
      formatText(`Alias created: `, 'text-primary-300'),
      formatMultiPart([
        { text: name, color: 'text-primary-400' },
        { text: ' → ', color: 'text-gray-500' },
        { text: aliases[name] || '', color: 'text-gray-200' },
      ]),
      formatEmptyLine(),
      formatText('Note: Aliases are stored for this session only', 'text-gray-500'),
    ]
  },
})

export function getAliases(): Record<string, string> {
  return { ...aliases }
}

export function expandAlias(input: string): string {
  const parts = input.trim().split(/\s+/)
  const command = parts[0]

  if (command && aliases[command]) {
    return aliases[command] + (parts.length > 1 ? ' ' + parts.slice(1).join(' ') : '')
  }

  return input
}
