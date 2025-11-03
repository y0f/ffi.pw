import { createCommand, CommandCategory } from '../../core/Command'
import { formatHeader, formatDivider, formatText, formatEmptyLine } from '../../core/formatters'

export const omf = createCommand({
  name: 'omf',
  description: 'Play One Must Fall 2097 - Giant Robot Fighting',
  category: CommandCategory.GAMES,
  aliases: ['onemustfall', 'fighting'],
  usage: 'omf',

  execute: async ({ setActiveGame, setIsExpanded }) => {
    if (setIsExpanded) {
      setIsExpanded(true)
    }

    document.dispatchEvent(new CustomEvent('petalsToggle', { detail: false }))

    setActiveGame('omf')

    return [
      formatHeader('ONE MUST FALL 2097'),
      formatDivider(),
      formatText('Loading DOS emulator...', 'text-primary-400'),
      formatEmptyLine(),
      formatText('Default Controls:', 'text-gray-400'),
      formatText('  Numpad - Move/Jump'),
      formatText('  Enter - Punch'),
      formatText('  Right Shift - Kick'),
      formatText('  ESC - In-game Menu (configure controls here!)'),
      formatText('  Ctrl+Q or F10 - Exit Game'),
      formatEmptyLine(),
      formatText('Choose your robot and fight!', 'text-cyan-500'),
      formatDivider(),
    ]
  },
})
