/**
 * @fileoverview rm command - Remove files and directories
 */

import { createCommand, CommandCategory } from '../../core/Command'
import { formatText } from '../../core/formatters'
import { getFileSystem } from '../../core/VirtualFileSystem'
import { hasFlag } from '../../core/ArgumentParser'

export const rm = createCommand({
  name: 'rm',
  description: 'Remove files and directories',
  category: CommandCategory.FILESYSTEM,
  usage: 'rm [options] <file...>',
  aliases: ['del', 'remove'],

  examples: [
    {
      command: 'rm file.txt',
      description: 'Remove a file',
    },
    {
      command: 'rm -r directory',
      description: 'Remove a directory recursively',
    },
    {
      command: 'rm file1.txt file2.txt',
      description: 'Remove multiple files',
    },
  ],

  longDescription:
    'Remove files and directories from the virtual filesystem. Use -r or --recursive to remove directories and their contents.',

  execute: async ({ parsed }) => {
    if (!parsed || !parsed.args || parsed.args.length === 0) {
      return [formatText('rm: missing operand', 'text-red-500')]
    }

    const fs = getFileSystem()
    const recursive = hasFlag(parsed, 'r') || hasFlag(parsed, 'recursive')
    const results: string[] = []

    for (const filePath of parsed.args) {
      const absPath = fs.resolvePath(filePath)

      if (!fs.exists(absPath)) {
        results.push(`rm: cannot remove '${filePath}': No such file or directory`)
        continue
      }

      const node = fs.getNode(absPath)

      // If it's a directory, require -r flag
      if (node?.type === 'directory' && !recursive) {
        results.push(`rm: cannot remove '${filePath}': Is a directory`)
        continue
      }

      const deleted = fs.delete(absPath, recursive)
      if (!deleted) {
        if (node?.type === 'directory') {
          results.push(`rm: cannot remove '${filePath}': Directory not empty`)
        } else {
          results.push(`rm: cannot remove '${filePath}'`)
        }
      }
    }

    if (results.length === 0) {
      return []
    }

    return results.map((msg) => formatText(msg, 'text-red-500'))
  },
})
