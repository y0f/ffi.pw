/**
 * @fileoverview figlet command - ASCII art text
 */

import { createCommand, CommandCategory } from '../../core/Command'
import { formatText } from '../../core/formatters'

const FONT: Record<string, string[]> = {
  A: ['  ___  ', ' / _ \\ ', '| |_| |', '|  _  |', '|_| |_|'],
  B: [' _____ ', '| ___ |', '| |_| |', '| ___ |', '|_____| '],
  C: [' _____ ', '|  ___|', '| |    ', '| |___ ', '|_____|'],
  D: [' _____ ', '| ___ \\', '| |  | |', '| |__| |', '|_____/'],
  E: [' _____ ', '| ____|', '| |__  ', '|  __| ', '|_____|'],
  F: [' _____ ', '|  ___|', '| |_   ', '|  _|  ', '|_|    '],
  G: [' _____ ', '|  __ \\', '| |  \\|', '| | __ ', '|_____/'],
  H: [' _   _ ', '| | | |', '| |_| |', '|  _  |', '|_| |_|'],
  I: [' _____ ', '|_   _|', '  | |  ', ' _| |_ ', '|_____|'],
  J: [' _____ ', '  _  _|', ' | |   ', ' | |   ', ' |_|   '],
  K: [' _   _ ', '| | / |', '| |/ / ', '|   <  ', '|_|\\_\\ '],
  L: [' _     ', '| |    ', '| |    ', '| |___ ', '|_____|'],
  M: [' __  __ ', '|  \\/  |', '| |\\/| |', '| |  | |', '|_|  |_|'],
  N: [' _   _ ', '| \\ | |', '|  \\| |', '| |\\  |', '|_| \\_|'],
  O: [' _____ ', '|  _  |', '| | | |', '| |_| |', '|_____|'],
  P: [' _____ ', '| ___ |', '| |_/ /', '|  __/ ', '|_|    '],
  Q: [' _____ ', '|  _  |', '| | | |', '| |_| |', '|__/\\_|'],
  R: [' _____ ', '| ___ |', '| |_/ /', '|    / ', '|_|\\_\\ '],
  S: [' _____ ', '/  ___|', '\\ `--. ', ' `--. \\', '/\\__/ /'],
  T: [' _____ ', '|_   _|', '  | |  ', '  | |  ', '  |_|  '],
  U: [' _   _ ', '| | | |', '| | | |', '| |_| |', ' \\___/ '],
  V: [' _   _ ', '| | | |', '| | | |', '| |/ / ', '|___/  '],
  W: [' _ _ _ ', '| | | |', '| | | |', '| |_| |', ' \\___/ '],
  X: [' _   _ ', '| \\ / |', ' \\ V / ', ' / _ \\ ', '/_/ \\_\\'],
  Y: [' _   _ ', '| \\ / |', ' \\ V / ', '  | |  ', '  |_|  '],
  Z: [' _____ ', '|_   _|', ' /  /  ', '/ /    ', '/_____/'],
  ' ': ['     ', '     ', '     ', '     ', '     '],
  '!': [' _ ', '| |', '| |', '|_|', '(_)'],
  '?': [' ___ ', '|__ \\', '   ) |', '  / / ', ' |_|  '],
}

const FONT_HEIGHT = 5

export const figlet = createCommand({
  name: 'figlet',
  description: 'Create ASCII art text',
  category: CommandCategory.EFFECTS,
  usage: 'figlet <text>',

  examples: [
    {
      command: 'figlet HELLO',
      description: 'Create ASCII art for "HELLO"',
    },
    {
      command: 'figlet CODE',
      description: 'Create ASCII art for "CODE"',
    },
  ],

  execute: async ({ parsed }) => {
    const text = (parsed?.args || []).join(' ').toUpperCase()

    if (!text) {
      return [formatText('Usage: figlet <text>', 'text-yellow-400')]
    }

    const lines: string[] = Array(FONT_HEIGHT).fill('')

    for (const char of text) {
      const charArt = FONT[char] || FONT[' ']
      if (!charArt) continue
      for (let i = 0; i < FONT_HEIGHT; i++) {
        lines[i] += (charArt[i] || '     ') + ' '
      }
    }

    return lines.map((line) => formatText(line, 'text-cyan-400'))
  },
})
