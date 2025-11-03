/**
 * @fileoverview cat command - Display file contents
 */

import { createCommand, CommandCategory } from '../../core/Command'
import { formatText } from '../../core/formatters'
import { getFileSystem } from '../../core/VirtualFileSystem'
import { getArg, hasFlag } from '../../core/ArgumentParser'

export const cat = createCommand({
  name: 'cat',
  description: 'Display file contents',
  category: CommandCategory.FILESYSTEM,
  usage: 'cat <file> [-n]',

  examples: [
    {
      command: 'cat README.md',
      description: 'Display README.md contents',
    },
    {
      command: 'cat -n file.txt',
      description: 'Display with line numbers',
    },
    {
      command: 'cat /home/user/secrets.txt',
      description: 'Display file with absolute path',
    },
  ],

  execute: async ({ parsed }) => {
    const fs = getFileSystem()
    const path = getArg(parsed, 0)
    const showLineNumbers = hasFlag(parsed, 'n')

    if (!path) {
      return [formatText('cat: missing file operand', 'text-red-500')]
    }

    const absPath = fs.resolvePath(path)

    if (!fs.exists(absPath)) {
      return [formatText(`cat: ${path}: No such file or directory`, 'text-red-500')]
    }

    if (!fs.isFile(absPath)) {
      return [formatText(`cat: ${path}: Is a directory`, 'text-red-500')]
    }

    const content = fs.readFile(absPath)

    if (content === null) {
      return [formatText(`cat: ${path}: Cannot read file`, 'text-red-500')]
    }

    const lines = content.split('\n')

    if (showLineNumbers) {
      return lines.map((line, i) => {
        const lineNum = (i + 1).toString().padStart(4, ' ')
        return formatText(`${lineNum}  ${line}`, 'text-gray-300')
      })
    }

    return lines.map((line) => formatText(line, 'text-gray-300'))
  },
})
