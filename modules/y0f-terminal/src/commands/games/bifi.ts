import { createCommand, CommandCategory } from '../../core/Command'
import { formatHeader, formatDivider, formatText, formatEmptyLine } from '../../core/formatters'

export const bifi = createCommand({
  name: 'bifi',
  description: 'Play 2FAST4YOU - BiFi Racing',
  category: CommandCategory.GAMES,
  aliases: ['2fast4you', 'racing'],
  usage: 'bifi',

  execute: async ({ setActiveGame, setIsExpanded }) => {
    if (setIsExpanded) {
      setIsExpanded(true)
    }

    document.dispatchEvent(new CustomEvent('petalsToggle', { detail: false }))

    setActiveGame('bifi')

    return [
      formatHeader('2FAST4YOU'),
      formatDivider(),
      formatText('Loading DOS emulator...', 'text-primary-400'),
      formatEmptyLine(),
      formatText('Controls:', 'text-gray-400'),
      formatText('  Arrow keys - Steer'),
      formatText('  Ctrl - Accelerate'),
      formatText('  Alt - Brake'),
      formatText('  Space - Use Power-up'),
      formatText('  ESC - Exit game'),
      formatEmptyLine(),
      formatText('Navigate menus with arrow keys and Enter', 'text-orange-500'),
      formatDivider(),
    ]
  },
})
