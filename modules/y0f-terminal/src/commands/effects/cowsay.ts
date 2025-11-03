/**
 * @fileoverview cowsay command - ASCII art cow that says things
 */

import { createCommand, CommandCategory } from '../../core/Command'
import { formatText } from '../../core/formatters'

export const cowsay = createCommand({
  name: 'cowsay',
  description: 'Make a cow say something',
  category: CommandCategory.EFFECTS,
  usage: 'cowsay [message]',

  examples: [
    {
      command: 'cowsay Hello World',
      description: 'Make the cow say "Hello World"',
    },
    {
      command: 'cowsay "Multiple words work too!"',
      description: 'Use quotes for multi-word messages',
    },
  ],

  execute: async ({ parsed }) => {
    const message = (parsed?.args || []).join(' ') || 'Moo!'
    const messageLength = message.length
    const topBorder = ' ' + '_'.repeat(messageLength + 2)
    const bottomBorder = ' ' + '-'.repeat(messageLength + 2)

    const cow = `
${topBorder}
< ${message} >
${bottomBorder}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`

    return cow.split('\n').map((line) => formatText(line, 'text-green-400'))
  },
})
