/**
 * @fileoverview ls command - List directory contents
 */

import { createCommand, CommandCategory } from '../../core/Command'
import { formatText, formatMultiPart } from '../../core/formatters'
import { getFileSystem } from '../../core/VirtualFileSystem'
import { getArg, hasFlag } from '../../core/ArgumentParser'

export const ls = createCommand({
  name: 'ls',
  description: 'List directory contents',
  category: CommandCategory.FILESYSTEM,
  usage: 'ls [path] [-l] [-a]',
  aliases: ['dir'],

  examples: [
    {
      command: 'ls',
      description: 'List current directory',
    },
    {
      command: 'ls /home',
      description: 'List /home directory',
    },
    {
      command: 'ls -l',
      description: 'List with details',
    },
    {
      command: 'ls -a',
      description: 'Show hidden files',
    },
  ],

  execute: async ({ parsed }) => {
    const fs = getFileSystem()
    const path = getArg(parsed, 0, '.')
    const longFormat = hasFlag(parsed, 'l')
    const showAll = hasFlag(parsed, 'a')

    const absPath = fs.resolvePath(path)
    const files = fs.listDirectory(absPath)

    if (files === null) {
      return [formatText(`ls: cannot access '${path}': No such file or directory`, 'text-red-500')]
    }

    if (files.length === 0) {
      return []
    }

    const visibleFiles = showAll ? files : files.filter((f) => !f.name.startsWith('.'))

    if (longFormat) {
      const output = visibleFiles.map((file) => {
        const permissions = file.permissions || 'rwxr-xr-x'
        const size = file.size?.toString().padStart(8) || '       -'
        const modified = file.modified?.toLocaleDateString() || 'Unknown'
        const name = file.type === 'directory' ? file.name + '/' : file.name
        const color = file.type === 'directory' ? 'text-blue-400' : 'text-gray-300'

        return formatMultiPart([
          { text: permissions + '  ', color: 'text-gray-500' },
          { text: size + '  ', color: 'text-yellow-400' },
          { text: modified + '  ', color: 'text-cyan-400' },
          { text: name, color },
        ])
      })

      return output
    }

    // Simple format - multiple columns
    const output = visibleFiles
      .map((file) => {
        const name = file.type === 'directory' ? file.name + '/' : file.name
        const color = file.type === 'directory' ? 'text-blue-400' : 'text-gray-300'
        return { text: name, color }
      })
      .reduce(
        (acc, file, i) => {
          if (i > 0 && i % 4 === 0) {
            acc.push({ text: '', color: 'text-gray-300' })
          }
          const last = acc[acc.length - 1]
          if (last && last.text) {
            last.text += '  ' + file.text
            last.color = file.color
          } else {
            acc[acc.length - 1] = file
          }
          return acc
        },
        [{ text: '', color: 'text-gray-300' }],
      )

    return output.length > 0 ? output : [formatText('')]
  },
})
