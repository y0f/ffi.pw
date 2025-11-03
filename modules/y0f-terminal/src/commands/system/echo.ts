/**
 * @fileoverview echo command - Display text with various formatting options
 */

import { createCommand, CommandCategory } from '../../core/Command'
import { formatText } from '../../core/formatters'
import { hasFlag, getOption } from '../../core/ArgumentParser'

export const echo = createCommand({
  name: 'echo',
  description: 'Display text with formatting options',
  category: CommandCategory.SYSTEM,
  usage: 'echo [options] [text...]',

  examples: [
    {
      command: 'echo Hello World',
      description: 'Print simple text',
    },
    {
      command: 'echo -e "Line 1\nLine 2"',
      description: 'Process escape sequences',
    },
    {
      command: 'echo --upper "make me loud"',
      description: 'Convert to uppercase',
    },
    {
      command: 'echo --color cyan "Colored text"',
      description: 'Print with custom color',
    },
  ],

  longDescription:
    'Display text with various formatting options including escape sequences, colors, and case transformations.',

  execute: async ({ parsed }) => {
    if (!parsed || !parsed.args || parsed.args.length === 0) {
      return [formatText('')]
    }

    const text = parsed.args.join(' ')
    const enableEscapes = hasFlag(parsed, 'e')
    const upper = hasFlag(parsed, 'upper')
    const lower = hasFlag(parsed, 'lower')
    const colorOption = getOption(parsed, 'color', '') as string

    let output = text

    if (enableEscapes) {
      output = output
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r')
        .replace(/\\\\/g, '\\')
    }

    // Case transformations
    if (upper) {
      output = output.toUpperCase()
    } else if (lower) {
      output = output.toLowerCase()
    }

    // Determine color
    let color = 'text-gray-100'
    if (colorOption && typeof colorOption === 'string') {
      const colorMap: Record<string, string> = {
        cyan: 'text-cyan-400',
        green: 'text-green-400',
        red: 'text-red-400',
        yellow: 'text-yellow-400',
        blue: 'text-blue-400',
        purple: 'text-purple-400',
        pink: 'text-pink-400',
        orange: 'text-orange-400',
        gray: 'text-gray-400',
        white: 'text-white',
      }
      color = colorMap[colorOption.toLowerCase()] || color
    }

    if (output.includes('\n')) {
      const lines = output.split('\n')
      return lines.map((line) => formatText(line, color))
    }

    // Single line output
    return [formatText(output, color)]
  },
})
