import { createCommand, CommandCategory } from '../../core/Command'
import { formatHeader, formatDivider, formatText, formatEmptyLine } from '../../core/formatters'

export const games = createCommand({
  name: 'games',
  description: 'List available games',
  category: CommandCategory.GAMES,
  usage: 'games',

  execute: async () => {
    return [
      formatHeader('GAMES'),
      formatDivider(),
      formatText('Games:'),
      formatEmptyLine(),
      formatText('bifi    - 2FAST4YOU Racing'),
      formatText('doom    - DOOM (1993)'),
      formatText('omf     - One Must Fall 2097'),
      formatText('snake   - Classic Snake'),
      formatText('sparrow - Soaring Sparrow'),
      formatEmptyLine(),
      formatHeader('Type a game name to start'),
    ]
  },
})

export const snake = createCommand({
  name: 'snake',
  description: 'Play the classic Snake game',
  category: CommandCategory.GAMES,
  usage: 'snake',

  execute: async ({ setActiveGame }) => {
    setActiveGame('snake')
    return [
      formatHeader('SNAKE'),
      formatDivider(),
      formatText('Controls: WASD/Arrow Keys'),
      formatText('Quit: Q/ESC'),
      formatEmptyLine(),
    ]
  },
})

export const sparrow = createCommand({
  name: 'sparrow',
  description: 'Play the Soaring Sparrow game',
  category: CommandCategory.GAMES,
  usage: 'sparrow',

  execute: async ({ setActiveGame }) => {
    setActiveGame('sparrow')
    return [formatHeader('SOARING SPARROW'), formatDivider(), formatEmptyLine()]
  },
})

export { bifi } from './bifi'
export { doom } from './doom'
export { omf } from './omf'
