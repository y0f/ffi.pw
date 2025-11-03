import { createCommand, CommandCategory } from '../../core/Command'
import { formatHeader, formatDivider, formatText, formatEmptyLine } from '../../core/formatters'

export const doom = createCommand({
  name: 'doom',
  description: 'Play DOOM (1993)',
  category: CommandCategory.GAMES,
  aliases: ['doom1'],
  usage: 'doom',

  execute: async ({ setActiveGame, setIsExpanded }) => {
    if (setIsExpanded) {
      setIsExpanded(true)
    }

    document.dispatchEvent(new CustomEvent('petalsToggle', { detail: false }))

    setActiveGame('doom')

    return [
      formatHeader('DOOM'),
      formatDivider(),
      formatText('Loading DOS emulator...', 'text-primary-400'),
      formatEmptyLine(),
      formatText('Controls:', 'text-gray-400'),
      formatText('  Arrow keys - Move'),
      formatText('  Ctrl - Fire'),
      formatText('  Space - Use/Open'),
      formatText('  1-7 - Select weapon'),
      formatText('  ESC - Exit game'),
      formatEmptyLine(),
      formatText('Rip and tear!', 'text-red-500'),
      formatDivider(),
    ]
  },
})
